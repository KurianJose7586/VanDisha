"""
FRA Atlas - Final Integrated Server
-----------------------------------
A single FastAPI service that fully replaces the mock Express backend and
connects to the VanDisha React frontend.

Endpoints:
- POST /api/ingest: Upload a claim form for full OCR + satellite analysis.
- GET /api/claims: Get a GeoJSON FeatureCollection of all processed claims.
- GET /api/assets: Get a GeoJSON FeatureCollection of all processed assets (NDVI/NDWI).
- GET /api/dss/recommend/{claim_id}: Get mock DSS recommendations for a claim.
"""

from __future__ import annotations

import io
import re
import traceback
import uuid
from typing import Dict, List, Optional, Tuple
from scipy.ndimage import gaussian_filter


import geopandas as gpd
import numpy as np
import pytesseract
import rasterio
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pdf2image import convert_from_bytes
from PIL import Image
from pyproj import CRS, Transformer
from rasterio import features
from rasterio.transform import from_bounds
from shapely import wkt
from shapely.geometry import Point, Polygon, mapping, shape

# ======================================================================
# API INITIALIZATION & IN-MEMORY DATABASE
# ======================================================================

app = FastAPI(
    title="FRA Atlas Final API",
    version="4.0",
    description="Unified service for FRA document OCR and satellite analysis."
)

# Allow all origins for development
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# --- In-memory storage to act as a temporary database ---
DB: Dict[str, List[Dict]] = {
    "claims": [],
    "assets": []
}

# --- Analysis Configuration ---
RASTER_WIDTH = 512
RASTER_HEIGHT = 512
NDVI_THRESHOLD = 0.35
NDWI_THRESHOLD = 0.2
POINT_BUFFER_METERS = 500

# ======================================================================
# CORE OCR & GEOSPATIAL LOGIC (Internal Functions)
# ======================================================================

def image_from_uploadfile(upload_file: UploadFile) -> Image.Image:
    data = upload_file.file.read()
    if upload_file.filename.lower().endswith(".pdf"):
        pages = convert_from_bytes(data, dpi=200)
        if not pages: raise ValueError("PDF conversion failed")
        return pages[0]
    return Image.open(io.BytesIO(data)).convert("RGB")

def run_ocr_on_image(img: Image.Image) -> str:
    return pytesseract.image_to_string(img, lang="eng")

def clean_value(v: Optional[str]) -> Optional[str]:
    if not v: return None
    val = v.strip()
    return None if val.lower() in ["n/a", "not applicable", "none", "nil"] else val

def post_clean_text(v: Optional[str]) -> Optional[str]:
    if not v: return None
    return re.sub(r'\s*\d+\.\s*$', '', v.strip()).strip().rstrip(':,;')

def regex_extract_fields(text: str) -> Dict:
    nt = re.sub(r"\s+", " ", text)
    # Simplified patterns for robustness
    patterns = {
        "claimant": r"claimant\(s\):(.*?)(?=\d+\.)",
        "type": r"Type of Claim Filed:(.*?)(?=Claimant Details)",
        "coordinates_raw": r"(POLYGON\s*\(\(.*?\)\)|POINT\s*\(.*?\))"
    }
    data = {k: m.group(1).strip() if (m := re.search(p, nt, re.I | re.S)) else None for k, p in patterns.items()}
    return data

def generate_demo_bands(width: int, height: int) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed=abs(hash((width, height))))
    y, x = np.mgrid[0:1:height*1j, 0:1:width*1j]
    noise = gaussian_filter(rng.standard_normal((height, width)), sigma=8)
    base = (noise - noise.min()) / (noise.max() - noise.min())
    red = 0.3 * base + 0.2 * y
    green = 0.35 * base + 0.15 * (1 - y)
    nir = 0.6 * (1 - base) + 0.3 * (1 - y)
    def norm(a): return (a - np.min(a)) / (np.max(a) - np.min(a))
    return norm(red).astype("float32"), norm(green).astype("float32"), norm(nir).astype("float32")

def calc_index(numer: np.ndarray, denom: np.ndarray) -> np.ndarray:
    with np.errstate(divide='ignore', invalid='ignore'):
        return np.nan_to_num((numer - denom) / (numer + denom)).clip(-1, 1)

def get_analysis_area(geom: Polygon | Point) -> Tuple[Tuple[float, ...], Polygon | None]:
    if isinstance(geom, Polygon): return geom.bounds, geom
    if isinstance(geom, Point):
        wgs84, utm = CRS("EPSG:4326"), CRS(f"EPSG:{32600 + int((geom.x + 180) / 6) + 1}")
        to_utm = Transformer.from_crs(wgs84, utm, always_xy=True).transform
        buffer_wgs84 = gpd.GeoSeries([Point(to_utm(geom.x, geom.y)).buffer(POINT_BUFFER_METERS)], crs=utm).to_crs(wgs84).iloc[0]
        return buffer_wgs84.bounds, None
    raise ValueError("Input must be a valid WKT POLYGON or POINT")

def run_full_pipeline(file: UploadFile) -> None:
    """The complete OCR and Satellite Analysis workflow."""
    # 1. OCR Processing
    img = image_from_uploadfile(file)
    ocr_text = run_ocr_on_image(img)
    if not ocr_text: raise ValueError("OCR failed to extract text.")
    
    extracted_data = regex_extract_fields(ocr_text)
    wkt_string = extracted_data.get("coordinates_raw")
    if not wkt_string: raise ValueError("Could not find coordinates in the document.")

    # 2. Geospatial Analysis
    claim_geom = wkt.loads(wkt_string)
    analysis_bbox, clip_geom = get_analysis_area(claim_geom)
    
    transform = from_bounds(*analysis_bbox, width=RASTER_WIDTH, height=RASTER_HEIGHT)
    red, green, nir = generate_demo_bands(RASTER_WIDTH, RASTER_HEIGHT)
    
    ndvi = calc_index(nir, red)
    ndwi = calc_index(green, nir)

    # 3. Create GeoJSON Features and add to DB
    claim_id = f"CLAIM-{str(uuid.uuid4())[:4].upper()}"
    claim_type_raw = extracted_data.get("type", "IFR")
    claim_type = "CFR" if "CFR" in claim_type_raw else "CR" if "CR" in claim_type_raw else "IFR"

    claim_feature = {
        "type": "Feature",
        "properties": {
            "claim_id": claim_id,
            "type": claim_type,
            "status": "Pending", # New claims are always pending
            "claimant": {"name": post_clean_text(extracted_data.get("claimant", "Unknown"))},
        },
        "geometry": mapping(claim_geom)
    }
    DB["claims"].append(claim_feature)

    for index_name, index_data, threshold, color in [("NDVI", ndvi, NDVI_THRESHOLD, "#86efac"), ("NDWI", ndwi, NDWI_THRESHOLD, "#60a5fa")]:
        mask = index_data > threshold
        if not np.any(mask): continue
        
        shapes = features.shapes(mask.astype("uint8"), mask=mask, transform=transform)
        geoms = [shape(geom) for geom, val in shapes if val == 1]
        if not geoms: continue

        gdf = gpd.GeoDataFrame(geometry=geoms, crs="EPSG:4326")
        if clip_geom:
            gdf = gpd.clip(gdf, clip_geom, keep_geom_type=True)
        
        for geom in gdf.geometry:
            asset_feature = {
                "type": "Feature",
                "properties": {"layer": index_name, "claim_id": claim_id, "color": color},
                "geometry": mapping(geom)
            }
            DB["assets"].append(asset_feature)

# ======================================================================
# API ENDPOINTS
# ======================================================================

@app.post("/api/ingest")
async def ingest_claim_document(file: UploadFile = File(...)):
    """Handles file upload and triggers the full processing pipeline."""
    try:
        run_full_pipeline(file)
        return {"status": "queued", "message": "File processed and data updated."}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/api/claims")
async def get_all_claims():
    """Returns a GeoJSON FeatureCollection of all processed claims."""
    return {"type": "FeatureCollection", "features": DB["claims"]}

@app.get("/api/assets")
async def get_all_assets():
    """Returns a GeoJSON FeatureCollection of all processed assets."""
    return {"type": "FeatureCollection", "features": DB["assets"]}

@app.get("/api/dss/recommend/{claim_id}")
async def get_dss_recommendations(claim_id: str):
    """Returns mock DSS recommendations for a given claim ID."""
    # This is a mock response, as in the original server
    return {
        "claim_id": claim_id,
        "recommendations": [
            {"scheme": "Forest Rights Act Assistance", "reason": "High NDVI region", "score": 0.92},
            {"scheme": "Community Water Conservation", "reason": "Proximity to NDWI layer", "score": 0.78},
        ]
    }