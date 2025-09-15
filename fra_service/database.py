from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base # <-- Change this import

# The connection URL for your Docker database
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost:5432/fra_atlas"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This Base class is what your model classes will inherit from
Base = declarative_base() # <-- Change this line

# Dependency to get a DB session in your API endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()