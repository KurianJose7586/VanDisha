import fitz, re, io, json, os, shutil, zipfile
import geopandas as gpd
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from shapely.geometry import Polygon, Point
from geoalchemy2.shape import from_shape
from shapely import wkb
from pydantic import BaseModel
from typing import List

from . import models, sentinel_service, dss_service
from .database import engine, get_db

def create_db_tables(): models.Base.metadata.create_all(bind=engine)
app = FastAPI()
@app.on_event("startup")
def on_startup(): create_db_tables()

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class GeoJSONFeature(BaseModel):
    type: str = "Feature"; properties: dict; geometry: dict
class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"; features: List[GeoJSONFeature]

@app.get("/", tags=["Root"])
def read_root(): return {"message": "Welcome to the VanDisha FRA Service API!"}

@app.post("/api/ingest", status_code=201)
async def ingest_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type.")
    try:
        file_bytes = await file.read()
        text = "".join(page.get_text() for page in fitz.open(stream=io.BytesIO(file_bytes)))

        name_match = re.search(r"Name of the claimant\(s\):\s*(.*)", text, re.IGNORECASE)
        claimant_name = name_match.group(1).strip() if name_match else "Unknown Claimant"

        type_match = re.search(r"Type of Claim Filed:\s*(.*)", text, re.IGNORECASE)
        claim_type_full = type_match.group(1).strip() if type_match else "Unknown"
        claim_type = "IFR" if "Individual" in claim_type_full else "CFR" if "Resource" in claim_type_full else "CR" if "Community" in claim_type_full else "Unknown"

        cultivation_match = re.search(r"self-cultivation \(hectares\):\s*([\d\.]+)", text, re.IGNORECASE)
        cultivation_area = float(cultivation_match.group(1)) if cultivation_match else 0.0
        habitation_match = re.search(r"habitation \(hectares\):\s*([\d\.]+)", text, re.IGNORECASE)
        habitation_area = float(habitation_match.group(1)) if habitation_match else 0.0
        other_rights_match = re.search(r"Any other traditional right claimed:\s*(.*?)(?=\d{2}\.\s+)", text, re.IGNORECASE | re.DOTALL)
        other_rights = other_rights_match.group(1).strip().replace('\n', ' ') if other_rights_match else "N/A"

        coord_match = re.search(r"Coordinates.*?(POINT|POLYGON)\s*\({1,2}(.+?)\){1,2}", text, re.IGNORECASE | re.DOTALL)
        if not coord_match: raise HTTPException(status_code=400, detail="Coordinates not found.")
        
        geom_type, coord_text = coord_match.groups()
        numbers = [float(n) for n in re.findall(r"[-+]?\d*\.\d+|\d+", coord_text)]
        
        if geom_type.upper() == "POLYGON" and len(numbers) >= 6:
            polygon = Polygon(list(zip(numbers[0::2], numbers[1::2])))
        elif geom_type.upper() == "POINT" and len(numbers) == 2:
            polygon = Point(numbers[0], numbers[1]).buffer(0.0001).envelope
        else: raise HTTPException(status_code=400, detail="Invalid geometry data.")
        
        new_claim = models.FRAClaim(
            claimant_name=claimant_name, claim_type=claim_type,
            cultivation_area=cultivation_area, habitation_area=habitation_area,
            other_rights=other_rights, status="potential", geom=from_shape(polygon, srid=4326)
        )
        db.add(new_claim); db.commit(); db.refresh(new_claim)
        return {"message": f"Claim ingested as {geom_type.upper()}.", "claim_id": new_claim.id}
    except Exception as e:
        db.rollback(); raise HTTPException(status_code=500, detail=f"Failed to process document: {e}")

@app.post("/api/ingest-shapefile", status_code=201)
async def ingest_shapefile(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # ... (code for this endpoint remains the same as previously provided) ...
    pass

@app.get("/api/claims", response_model=GeoJSONFeatureCollection)
def get_all_claims(db: Session = Depends(get_db)):
    claims = db.query(models.FRAClaim).all()
    features = [GeoJSONFeature(properties={"id": c.id, "claimant_name": c.claimant_name, "type": c.claim_type, "status": c.status}, geometry=wkb.loads(bytes(c.geom.data)).__geo_interface__) for c in claims]
    return GeoJSONFeatureCollection(features=features)

@app.get("/api/assets")
def get_assets(lat: float, lon: float):
    try:
        return {"ndvi": sentinel_service.get_ndvi_image(lon, lat), "ndwi": sentinel_service.get_ndwi_image(lon, lat)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch satellite data: {e}")

@app.get("/api/dss/{claim_id}")
def get_dss_for_claim(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(models.FRAClaim).filter(models.FRAClaim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found.")
    try:
        recommendations = dss_service.get_recommendations(claim)
        return {"claim_id": claim_id, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate DSS recommendations: {e}")