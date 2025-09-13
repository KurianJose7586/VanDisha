import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useAtlasStore } from "@/store";

export default function MapController() {
  const map = useMap();
  const { selectedClaim } = useAtlasStore();

  useEffect(() => {
    if (selectedClaim) {
      const feature = selectedClaim;
      if (feature.geometry.type === "Point") {
        map.flyTo(
          [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
          15, // Zoom level for points
        );
      } else if (feature.geometry.type.includes("Polygon")) {
        const bounds = L.geoJSON(feature.geometry).getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  }, [selectedClaim, map]);

  return null; // This component does not render anything
}