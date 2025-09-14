import fitz  # PyMuPDF for OCR
import re
import io
import json

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from shapely.geometry import Polygon
from geoalchemy2.shape import from_shape
from shapely import wkb

# Import your project's modules
from . import models, sentinel_service
from .database import engine, get_db

# Pydantic models for structuring API responses
from pydantic import BaseModel
from typing import List

# --- Database Table Creation ---
def create_db_tables():
    print("Creating database tables if they don't exist...")
    models.Base.metadata.create_all(bind=engine)
    print("Database tables checked.")

# --- FastAPI App Setup ---
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

# --- Pydantic GeoJSON Models ---
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
    Ingests a scanned FRA document, extracts data, and saves it to the database.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    try:
        file_bytes = await file.read()
        pdf_document = fitz.open(stream=io.BytesIO(file_bytes))
        text = "".join(page.get_text() for page in pdf_document)

        name_match = re.search(r"Name\s*of\s*Claimant[:\s]+([\w\s]+)", text, re.IGNORECASE)
        claimant_name = name_match.group(1).strip() if name_match else "Unknown Claimant"

        claim_type = "Unknown"
        if re.search(r"Individual\s*Forest\s*Right", text, re.IGNORECASE): claim_type = "IFR"
        elif re.search(r"Community\s*Forest\s*Right", text, re.IGNORECASE): claim_type = "CFR"
        elif re.search(r"Community\s*Right", text, re.IGNORECASE): claim_type = "CR"

        # Placeholder for real coordinate extraction and conversion
        coordinates = [(77.1, 28.5), (77.2, 28.5), (77.2, 28.6), (77.1, 28.6), (77.1, 28.5)]
        polygon = Polygon(coordinates)

        new_claim = models.FRAClaim(
            claimant_name=claimant_name,
            claim_type=claim_type,
            status="potential",
            geom=from_shape(polygon, srid=4326)
        )
        db.add(new_claim)
        db.commit()
        db.refresh(new_claim)
        return {"message": "Claim ingested successfully", "claim_id": new_claim.id}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")


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