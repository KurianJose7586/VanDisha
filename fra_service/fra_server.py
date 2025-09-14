import fitz  # PyMuPDF
import re
import io
import json
import os  # <-- ADDED
import shutil  # <-- ADDED
import zipfile  # <-- ADDED
import geopandas as gpd  # <-- ADDED

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from shapely.geometry import Polygon, Point
from geoalchemy2.shape import from_shape
from shapely import wkb

from . import models, sentinel_service, dss_service
from .database import engine, get_db
from pantic import BaseModel
from typing import List

# --- Database Table Creation on Startup ---
def create_db_tables():
    models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_tables()

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    properties: dict
    geometry: dict

class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]

# --- API Endpoints ---

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the VanDisha FRA Service API!"}


@app.post("/api/ingest", status_code=201)
async def ingest_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Ingests a scanned FRA document, extracts data including WKT-style
    coordinates (POINT or POLYGON), and saves it to the database.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    try:
        file_bytes = await file.read()
        pdf_document = fitz.open(stream=io.BytesIO(file_bytes))
        text = "".join(page.get_text() for page in pdf_document)

        name_match = re.search(r"Name of the claimant\(s\):\s*(.*)", text, re.IGNORECASE)
        claimant_name = name_match.group(1).strip() if name_match else "Unknown Claimant"

        type_match = re.search(r"Type of Claim Filed:\s*(.*)", text, re.IGNORECASE)
        claim_type_full = type_match.group(1).strip() if type_match else "Unknown"
        
        claim_type = "Unknown"
        if "Individual" in claim_type_full: claim_type = "IFR"
        elif "Community Forest Resource" in claim_type_full: claim_type = "CFR"
        elif "Community" in claim_type_full: claim_type = "CR"
        
        coord_pattern = re.compile(r"Coordinates of Claim Area.*?(POINT|POLYGON)\s*\({1,2}(.+?)\){1,2}", re.IGNORECASE | re.DOTALL)
        match = coord_pattern.search(text)

        if not match:
            raise HTTPException(status_code=400, detail="Could not find POINT or POLYGON coordinates in the document.")

        geom_type = match.group(1).upper()
        coord_text = match.group(2)
        
        numbers = [float(n) for n in re.findall(r"[-+]?\d*\.\d+|\d+", coord_text)]
        
        polygon = None
        if geom_type == "POLYGON":
            if len(numbers) < 6:
                raise HTTPException(status_code=400, detail="Invalid POLYGON data.")
            coordinates = list(zip(numbers[0::2], numbers[1::2]))
            polygon = Polygon(coordinates)
        elif geom_type == "POINT":
            if len(numbers) != 2:
                raise HTTPException(status_code=400, detail="Invalid POINT data.")
            lon, lat = numbers[0], numbers[1]
            point = Point(lon, lat)
            buffer_size = 0.0001
            polygon = point.buffer(buffer_size).envelope

        if not polygon:
             raise HTTPException(status_code=400, detail="Failed to create a valid geometry from the coordinates.")

        new_claim = models.FRAClaim(
            claimant_name=claimant_name,
            claim_type=claim_type,
            status="potential",
            geom=from_shape(polygon, srid=4326)
        )
        db.add(new_claim)
        db.commit()
        db.refresh(new_claim)
        
        return {"message": f"Claim ingested successfully as {geom_type}.", "claim_id": new_claim.id}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")


@app.post("/api/ingest-shapefile", status_code=201)
async def ingest_shapefile(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Ingests a zipped shapefile, extracts the geometries and properties,
    and saves them as new claims in the database.
    """
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .zip file.")

    temp_dir = "temp_shapefile"
    os.makedirs(temp_dir, exist_ok=True)

    try:
        zip_path = os.path.join(temp_dir, file.filename)
        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)

        shp_file = next((os.path.join(temp_dir, f) for f in os.listdir(temp_dir) if f.endswith('.shp')), None)

        if not shp_file:
            raise HTTPException(status_code=400, detail="No .shp file found in the zip archive.")

        gdf = gpd.read_file(shp_file)

        for index, row in gdf.iterrows():
            claimant_name = row.get('CLAIM_NAME', 'Unknown Claimant from Shapefile')
            claim_type = row.get('TYPE', 'IFR')
            
            geom = row['geometry']
            if geom.geom_type == 'Polygon':
                new_claim = models.FRAClaim(
                    claimant_name=claimant_name,
                    claim_type=claim_type,
                    status="granted",
                    geom=from_shape(geom, srid=4326)
                )
                db.add(new_claim)

        db.commit()
        return {"message": f"Successfully ingested {len(gdf)} claims from shapefile."}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process shapefile: {str(e)}")

    finally:
        shutil.rmtree(temp_dir)

@app.get("/api/claims", response_model=GeoJSONFeatureCollection)
def get_all_claims(db: Session = Depends(get_db)):
    """
    Retrieves all FRA claims and returns them as a GeoJSON FeatureCollection.
    """
    claims = db.query(models.FRAClaim).all()
    features = [
        GeoJSONFeature(
            properties={
                "id": claim.id, "claimant_name": claim.claimant_name,
                "type": claim.claim_type, "status": claim.status
            },
            geometry=wkb.loads(bytes(claim.geom.data)).__geo_interface__
        ) for claim in claims
    ]
    return GeoJSONFeatureCollection(features=features)

@app.get("/api/assets")
def get_assets(lat: float = 28.6139, lon: float = 77.2090):
    """
    Returns base64 encoded PNGs of real NDVI and NDWI data from Sentinel Hub.
    """
    try:
        ndvi_image = sentinel_service.get_ndvi_image(lon, lat)
        ndwi_image = sentinel_service.get_ndwi_image(lon, lat)
        return {"ndvi": ndvi_image, "ndwi": ndwi_image}
    except Exception as e:
        print(f"Error fetching from Sentinel Hub: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch satellite data: {str(e)}")

@app.get("/api/dss")
def get_dss_recommendations(lat: float = 28.6139, lon: float = 77.2090):
    """
    Returns mock Decision Support System recommendations.
    """
    return {
        "recommendations": [
            {"scheme": "PM-KISAN", "description": "Eligible for income support.", "priority": "High"},
            {"scheme": "Jal Jeevan Mission", "description": "Area shows low water index.", "priority": "Medium"}
        ]
    }