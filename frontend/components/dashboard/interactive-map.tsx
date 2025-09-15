"use client";

import { useState } from "react";
import Map, { Source, Layer, MapLayerMouseEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppStore } from "@/store/store";
import { FillLayer, LineLayer } from "mapbox-gl";

// Define the styles for the different claim types
const ifrLayerStyle: FillLayer = {
  id: "ifr-claims",
  type: "fill",
  paint: { "fill-color": "#3b82f6", "fill-opacity": 0.5 },
};
const crLayerStyle: FillLayer = {
  id: "cr-claims",
  type: "fill",
  paint: { "fill-color": "#16a34a", "fill-opacity": 0.5 },
};
const cfrLayerStyle: FillLayer = {
  id: "cfr-claims",
  type: "fill",
  paint: { "fill-color": "#f97316", "fill-opacity": 0.5 },
};

// Style for highlighting the hovered claim
const highlightLayerStyle: LineLayer = {
    id: 'highlight-layer',
    type: 'line',
    paint: {
        'line-color': '#facc15',
        'line-width': 3,
    }
}

export function InteractiveMap() {
  const { claims, isLoadingClaims, setSelectedClaimId, fetchRecommendations } = useAppStore();
  const [hoveredClaimId, setHoveredClaimId] = useState<number | null>(null);

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const features = event.features;
    if (features && features.length > 0) {
      const clickedClaimId = features[0].properties?.id;
      if (clickedClaimId) {
        setSelectedClaimId(clickedClaimId);
        fetchRecommendations(clickedClaimId);
      }
    }
  };
  
  const handleMouseMove = (event: MapLayerMouseEvent) => {
    const features = event.features;
    if (features && features.length > 0) {
        setHoveredClaimId(features[0].properties?.id);
    }
  };

  const handleMouseLeave = () => {
    setHoveredClaimId(null);
  };

  // Filter claims based on type for different layers
  const ifrClaims = { ...claims, features: claims.features.filter(f => f.properties.type === 'IFR') };
  const crClaims = { ...claims, features: claims.features.filter(f => f.properties.type === 'CR') };
  const cfrClaims = { ...claims, features: claims.features.filter(f => f.properties.type === 'CFR') };

  return (
    <div className="relative h-full w-full">
      {isLoadingClaims && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
          <p className="text-white">Loading Claims...</p>
        </div>
      )}
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 82.77,
          latitude: 22.35,
          zoom: 4,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        interactiveLayerIds={['ifr-claims', 'cr-claims', 'cfr-claims']}
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Source id="ifr-source" type="geojson" data={ifrClaims}>
          <Layer {...ifrLayerStyle} />
        </Source>
        <Source id="cr-source" type="geojson" data={crClaims}>
          <Layer {...crLayerStyle} />
        </Source>
        <Source id="cfr-source" type="geojson" data={cfrClaims}>
          <Layer {...cfrLayerStyle} />
        </Source>

        {/* Highlight layer for hovered claim */}
        {hoveredClaimId && (
            <Source id="highlight-source" type="geojson" data={{
                type: 'FeatureCollection',
                features: claims.features.filter(f => f.properties.id === hoveredClaimId)
            }}>
                <Layer {...highlightLayerStyle} />
            </Source>
        )}
      </Map>
    </div>
  );
}