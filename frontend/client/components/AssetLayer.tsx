import { GeoJSON } from "react-leaflet";
import { useAtlasStore } from "@/store";
import { useMemo } from "react";

export default function AssetLayer() {
  const { assets, filters } = useAtlasStore();

  const filtered = useMemo(() => {
    if (!assets?.features)
      return { type: "FeatureCollection", features: [] } as any;
    return {
      type: "FeatureCollection",
      features: assets.features.filter((f: any) => {
        const layer = f.properties?.layer;
        return (
          (layer === "NDVI" && filters.showAssets.NDVI) ||
          (layer === "NDWI" && filters.showAssets.NDWI)
        );
      }),
    };
  }, [assets, filters]);

  return (
    <GeoJSON
      data={filtered as any}
      style={(feature: any) => {
        const layer = feature.properties?.layer;
        if (layer === "NDVI")
          return {
            color: "#86efac",
            fillColor: "#bbf7d0",
            weight: 1,
            fillOpacity: 0.25,
          };
        if (layer === "NDWI")
          return {
            color: "#60a5fa",
            fillColor: "#93c5fd",
            weight: 1,
            fillOpacity: 0.25,
          };
        return { color: "#94a3b8" };
      }}
    />
  );
}
