import { lazy, Suspense } from "react";
import LoadingSpinner from "@/client/components/LoadingSpinner";
import FRAClaimLayer from "@/client/components/FRAClaimLayer";
import AssetLayer from "@/client/components/AssetLayer";

const LeafletMap = lazy(async () => {
  const mod = await import("react-leaflet");
  return {
    default: () => (
      <mod.MapContainer
        center={[28.624, 77.203]}
        zoom={14}
        className="h-full w-full"
      >
        <mod.TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FRAClaimLayer />
      </mod.MapContainer>
    ),
  };
});

export default function MapCanvas() {
  return (
    <Suspense
      fallback={
        <div className="grid h-full w-full place-items-center">
          <LoadingSpinner className="h-6 w-6" />
        </div>
      }
    >
      <LeafletMap />
    </Suspense>
  );
}
