import { GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAtlasStore, type ClaimFeature } from "@/store";
import MapPopup from "@/components/MapPopup";
import { useMemo } from "react";

const crIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function FRAClaimLayer() {
  const { claims, setSelectedClaim, filters } = useAtlasStore();

  const filtered = useMemo(() => {
    if (!claims?.features)
      return { type: "FeatureCollection", features: [] } as any;
    return {
      type: "FeatureCollection",
      features: claims.features.filter(
        (f: any) =>
          filters.claimTypes[f.properties.type] &&
          filters.status[f.properties.status],
      ),
    };
  }, [claims, filters]);

  return (
    <>
      <GeoJSON
        data={filtered as any}
        style={(feature: any) => {
          if (feature.properties.type === "IFR") {
            const approved = feature.properties.status === "Approved";
            return {
              color: approved ? "#16a34a" : "#dc2626",
              weight: 2,
              fillOpacity: 0.25,
            };
          }
          return { color: "#4b5563" };
        }}
        onEachFeature={(feature, layer) => {
          const f = feature as any as ClaimFeature;
          if (
            f.geometry.type === "Polygon" ||
            f.geometry.type === "MultiPolygon"
          ) {
            layer.on("click", () => setSelectedClaim(f));
            const html = `<div><strong>${f.properties.claim_id} • ${f.properties.type}</strong><br/><span>Status: ${f.properties.status}</span></div>`;
            layer.bindPopup(html);
          }
        }}
      />
      {filtered.features
        .filter((f: any) => f.geometry.type === "Point")
        .map((f: any) => (
          <Marker
            key={f.properties.claim_id}
            position={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
            icon={crIcon}
            eventHandlers={{ click: () => setSelectedClaim(f as any) }}
          >
            <Popup>
              <MapPopup feature={f as any} />
            </Popup>
          </Marker>
        ))}
    </>
  );
}
