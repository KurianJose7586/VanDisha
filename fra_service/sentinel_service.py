import base64
from sentinelhub import (
    SHConfig,
    SentinelHubRequest,
    DataCollection,
    MimeType,
    bbox_to_dimensions,
    BBox,
    CRS,
)

# --- CONFIGURE YOUR CREDENTIALS ---
# Replace these with the values from your Sentinel Hub dashboard
CLIENT_ID = "e80708f0-e305-4a37-865d-166b8f82a272"
CLIENT_SECRET = "iqJ3avC45E7R8RRXmht6IBI00imF3pW2"

config = SHConfig()
if CLIENT_ID and CLIENT_SECRET:
    config.sh_client_id = CLIENT_ID
    config.sh_client_secret = CLIENT_SECRET
else:
    print("Warning: Sentinel Hub credentials not set.")

# --- EVALSCRIPTS ---
# This script tells Sentinel Hub how to calculate NDVI (Vegetation Index)
evalscript_ndvi = """
//VERSION=3
function setup() {
    return {
        input: [{ bands: ["B04", "B08"], units: "DN" }],
        output: {
            bands: 3,
            sampleType: "UINT8" // <-- FIX: Changed from INT8 to UINT8
        }
    };
}
function evaluatePixel(sample) {
    let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
    if (ndvi < -0.2) return [0.2, 0.2, 0.2];
    else if (ndvi < 0) return [0.7, 0.4, 0.2];
    else if (ndvi < 0.2) return [1, 1, 0];
    else if (ndvi < 0.5) return [0.2, 0.8, 0.2];
    else return [0, 0.5, 0];
}
"""

# This script tells Sentinel Hub how to calculate NDWI (Water Index)
evalscript_ndwi = """
//VERSION=3
function setup() {
    return {
        input: [{ bands: ["B03", "B08"], units: "DN" }], // B03 is Green, B08 is NIR
        output: {
            bands: 3,
            sampleType: "UINT8" // <-- FIX: Changed from INT8 to UINT8
        }
    };
}
function evaluatePixel(sample) {
    let ndwi = (sample.B03 - sample.B08) / (sample.B03 + sample.B08);
    if (ndwi < 0) return [0.5, 0.5, 0.5];        // Not water (gray)
    else if (ndwi < 0.2) return [1, 1, 0.5];   // Moist soil (light yellow)
    else if (ndwi < 0.5) return [0, 0.5, 1];   // Low water content (light blue)
    else return [0, 0, 0.8];                   // High water content (dark blue)
}
"""

def get_satellite_image(lon, lat, evalscript, size_km=1.0):
    """
    A generic function to fetch a satellite image from Sentinel Hub
    based on a given location and evalscript.
    """
    center_coords = (lon, lat)
    bbox_size_deg = size_km / 111.32
    bbox = BBox(bbox=(
        center_coords[0] - bbox_size_deg / 2,
        center_coords[1] - bbox_size_deg / 2,
        center_coords[0] + bbox_size_deg / 2,
        center_coords[1] + bbox_size_deg / 2,
    ), crs=CRS.WGS84)

    image_size = bbox_to_dimensions(bbox, resolution=10)

    request = SentinelHubRequest(
        evalscript=evalscript,
        input_data=[
            SentinelHubRequest.input_data(
                data_collection=DataCollection.SENTINEL2_L2A,
                time_interval=("2023-01-01", "2023-12-31"),
                mosaicking_order="leastCC",
            )
        ],
        responses=[SentinelHubRequest.output_response("default", MimeType.PNG)],
        bbox=bbox,
        size=image_size,
        config=config,
    )
    image_data = request.get_data()[0]
    return f"data:image/png;base64,{base64.b64encode(image_data).decode()}"

def get_ndvi_image(lon: float, lat: float):
    return get_satellite_image(lon, lat, evalscript=evalscript_ndvi)

def get_ndwi_image(lon: float, lat: float):
    return get_satellite_image(lon, lat, evalscript=evalscript_ndwi)