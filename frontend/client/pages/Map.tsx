import { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useAtlasStore } from "@/store";
import Sidebar from "@/components/Sidebar";
import RecommendationCard from "@/components/RecommendationCard";
import FRAClaimLayer from "@/components/FRAClaimLayer";
import AssetLayer from "@/components/AssetLayer";
import MapController from "@/components/MapController"; // Import the new component

export default function MapPage() {
  const { fetchClaims, fetchAssets } = useAtlasStore();

  useEffect(() => {
    fetchClaims();
    fetchAssets();
  }, [fetchClaims, fetchAssets]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <Sidebar />
      <div className="relative flex-1">
        <MapContainer
          center={[24.0, 82.0]} // Centered on India
          zoom={5}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FRAClaimLayer />
          <AssetLayer />
          <RecommendationCard />
          <MapController /> {/* Add the controller here */}
        </MapContainer>
      </div>
    </div>
  );
}