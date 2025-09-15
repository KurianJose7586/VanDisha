import { create } from "zustand";
import {
  getClaims,
  getDssRecommendations,
  getClaimStats,
  getAssets,
} from "@/client/lib/api";

export interface ClaimFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    id: number;
    district: string;
    village: string;
    name: string;
    area: number;
    status: "Approved" | "Pending" | "Rejected";
  };
}

interface AtlasState {
  claims: ClaimFeature[];
  filteredClaims: ClaimFeature[];
  assets: any[]; // Replace 'any' with a proper type for your assets
  stats: any; // Replace 'any' with a proper type for your stats
  recommendations: any[]; // Replace 'any' with a proper type
  loading: boolean;
  filters: {
    district?: string;
    village?: string;
  };
  fetchClaims: () => Promise<void>;
  fetchAssets: (lat: number, lon: number) => Promise<void>;
  fetchDssRecommendations: (claimId: number) => Promise<void>;
  fetchClaimStats: () => Promise<void>;
  setFilters: (filters: { district?: string; village?: string }) => void;
}

// --- THIS IS THE FIX ---
// We are changing "export default create" to "export const useAtlasStore = create"
export const useAtlasStore = create<AtlasState>((set, get) => ({
  claims: [],
  filteredClaims: [],
  assets: [],
  stats: {},
  recommendations: [],
  loading: false,
  filters: {},
  fetchClaims: async () => {
    set({ loading: true });
    try {
      const claims = await getClaims(get().filters);
      set({ claims, filteredClaims: claims, loading: false });
    } catch (error) {
      console.error("Failed to fetch claims", error);
      set({ loading: false });
    }
  },
  fetchAssets: async (lat, lon) => {
    set({ loading: true });
    try {
      const assets = await getAssets(lat, lon);
      set({ assets, loading: false });
    } catch (error) {
      console.error("Failed to fetch assets", error);
      set({ loading: false });
    }
  },
  fetchDssRecommendations: async (claimId) => {
    set({ loading: true });
    try {
      const recommendations = await getDssRecommendations(claimId);
      set({ recommendations, loading: false });
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
      set({ loading: false });
    }
  },
  fetchClaimStats: async () => {
    set({ loading: true });
    try {
      const stats = await getClaimStats();
      set({ stats, loading: false });
    } catch (error) {
      console.error("Failed to fetch stats", error);
      set({ loading: false });
    }
  },
  setFilters: (filters) => {
    set({ filters });
    get().fetchClaims();
  },
}));