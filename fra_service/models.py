from sqlalchemy import Column, Integer, String
from geoalchemy2 import Geometry
from .database import Base

class FRAClaim(Base):
    __tablename__ = 'fra_claims'

    id = Column(Integer, primary_key=True, index=True)
    claimant_name = Column(String, index=True)
    claim_type = Column(String)  # e.g., 'IFR', 'CR', 'CFR'
    status = Column(String, default='potential') # 'potential' or 'granted'

    # This column will store the geographic shape (polygon) of the claim
    # SRID 4326 is the standard for GPS coordinates (latitude/longitude)
    geom = Column(Geometry('POLYGON', srid=4326))