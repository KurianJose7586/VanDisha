from sqlalchemy import Column, Integer, String, Float, Text
from geoalchemy2 import Geometry
from .database import Base

class FRAClaim(Base):
    __tablename__ = 'fra_claims'

    id = Column(Integer, primary_key=True, index=True)
    claimant_name = Column(String, index=True)
    claim_type = Column(String)
    status = Column(String, default='potential')
    
    # --- NEW COLUMNS ---
    cultivation_area = Column(Float, default=0.0)
    habitation_area = Column(Float, default=0.0)
    other_rights = Column(Text, default="N/A")
    
    geom = Column(Geometry('POLYGON', srid=4326))