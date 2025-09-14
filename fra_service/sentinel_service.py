import base64
from sentinelhub import (
    SHConfig,
    SentinelHubRequest,
    DataCollection,
    MimeType,
    bbox_to_dimensions,
    BBox,
    CRS,
    SentinelHubStatistical,
)

# --- CONFIGURE YOUR CREDENTIALS ---
CLIENT_ID = "e80708f0-e305-4a37-865d-166b8f82a272"
CLIENT_SECRET = "iqJ3avC45E7R8RRXmht6IBI00imF3pW2"

config = SHConfig()
if CLIENT_ID and CLIENT_SECRET:
    config.sh_client_id = CLIENT_ID
    config.sh_client_secret = CLIENT_SECRET

# --- EVALSCRIPTS FOR IMAGES (VISUALIZATION) ---
evalscript_ndvi_viz = """
//VERSION=3
function setup() { return { input: [{ bands: ["B04", "B08"], units: "DN" }], output: { bands: 3, sampleType: "UINT8" }};}
function evaluatePixel(sample) {
    let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
    if (ndvi < 0) return [0.7, 0.4, 0.2]; else if (ndvi < 0.2) return [1, 1, 0];
    else if (ndvi < 0.5) return [0.2, 0.8, 0.2]; else return [0, 0.5, 0];
}"""
evalscript_ndwi_viz = """
//VERSION=3
function setup() { return { input: [{ bands: ["B03", "B08"], units: "DN" }], output: { bands: 3, sampleType: "UINT8" }};}
function evaluatePixel(sample) {
    let ndwi = (sample.B03 - sample.B08) / (sample.B03 + sample.B08);
    if (ndwi < 0) return [0.5, 0.5, 0.5]; else if (ndwi < 0.2) return [1, 1, 0.5];
    else if (ndwi < 0.5) return [0, 0.5, 1]; else return [0, 0, 0.8];
}"""

# --- EVALSCRIPTS FOR STATISTICS (ANALYSIS) ---
evalscript_ndvi_stats = """
//VERSION=3
function setup() { return { input: [{ bands: ["B04", "B08"], units: "DN" }], output: { id: "default", bands: 1, sampleType: "FLOAT32" }};}
function evaluatePixel(sample) { return [(sample.B08 - sample.B04) / (sample.B08 + sample.B04)]; }"""
evalscript_ndwi_stats = """
//VERSION=3
function setup() { return { input: [{ bands: ["B03", "B08"], units: "DN" }], output: { id: "default", bands: 1, sampleType: "FLOAT32" }};}
function evaluatePixel(sample) { return [(sample.B03 - sample.B08) / (sample.B03 + sample.B08)]; }"""

def _get_bbox(lon, lat, size_km=1.0):
    bbox_size_deg = size_km / 111.32
    return BBox(bbox=(lon - bbox_size_deg / 2, lat - bbox_size_deg / 2, lon + bbox_size_deg / 2, lat + bbox_size_deg / 2), crs=CRS.WGS84)

def get_image(lon, lat, evalscript):
    bbox = _get_bbox(lon, lat)
    request = SentinelHubRequest(
        evalscript=evalscript,
        input_data=[SentinelHubRequest.input_data(data_collection=DataCollection.SENTINEL2_L2A, time_interval=("2023-01-01", "2024-01-01"), mosaicking_order="leastCC")],
        responses=[SentinelHubRequest.output_response("default", MimeType.PNG)],
        bbox=bbox, size=bbox_to_dimensions(bbox, resolution=10), config=config
    )
    image_data = request.get_data()[0]
    return f"data:image/png;base64,{base64.b64encode(image_data).decode()}"

def get_statistics(lon, lat, evalscript):
    bbox = _get_bbox(lon, lat)
    request = SentinelHubStatistical(
        aggregation=SentinelHubStatistical.aggregation(evalscript=evalscript, time_interval=("2023-01-01", "2024-01-01"), aggregation_interval="P1D", size=bbox_to_dimensions(bbox, resolution=60)),
        input_data=[SentinelHubStatistical.input_data(DataCollection.SENTINEL2_L2A.with_bounds(bbox))], config=config
    )
    stats = request.get_data()[0]
    for interval in stats['data']:
        if interval['outputs']['default']['B0']['statistics']['mean'] is not None:
            return interval['outputs']['default']['B0']['statistics']['mean']
    return None

def get_ndvi_image(lon: float, lat: float): return get_image(lon, lat, evalscript_ndvi_viz)
def get_ndwi_image(lon: float, lat: float): return get_image(lon, lat, evalscript_ndwi_viz)
def get_ndvi_statistics(lon: float, lat: float): return get_statistics(lon, lat, evalscript_ndvi_stats)
def get_ndwi_statistics(lon: float, lat: float): return get_statistics(lon, lat, evalscript_ndwi_stats)