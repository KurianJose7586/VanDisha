from . import sentinel_service, llm_service
from shapely import wkb
from shapely.geometry import Point

def get_recommendations(claim_details):
    try:
        # Get the center point of the claim area to analyze
        geom_shapely = wkb.loads(bytes(claim_details.geom.data))
        centroid = geom_shapely.centroid
        lon, lat = centroid.x, centroid.y

        # Get real statistical data from the satellite service
        avg_ndwi = sentinel_service.get_ndwi_statistics(lon, lat)
        avg_ndvi = sentinel_service.get_ndvi_statistics(lon, lat)

        if avg_ndwi is None or avg_ndvi is None:
            return [{"scheme": "Data Error", "description": "Could not retrieve satellite data for analysis.", "priority": "N/A"}]

        env_data = {"avg_ndvi": avg_ndvi, "avg_ndwi": avg_ndwi}
        
        # Convert SQLAlchemy model to a dictionary for the LLM
        claim_dict = {c.name: getattr(claim_details, c.name) for c in claim_details.__table__.columns}
        
        # Call the LLM service with both claim and environmental data
        recommendations = llm_service.generate_dss_recommendations(claim_dict, env_data)

        if not recommendations:
             return [{"scheme": "AI Error", "description": "The AI model could not generate recommendations.", "priority": "N/A"}]

        return recommendations
    except Exception as e:
        print(f"Error in DSS service: {e}")
        return [{"scheme": "Error", "description": "Could not generate recommendations due to a service error.", "priority": "N/A"}]