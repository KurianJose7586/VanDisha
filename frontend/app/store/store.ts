import { create } from 'zustand';
import { getClaims, getDssRecommendations, getClaimStats, getAssets } from '@/lib/api';

// --- TYPES ---
export interface Claim {
  type: 'Feature';
  properties: { id: number; claimant_name: string; type: string; status: string; };
  geometry: any;
}

export interface GeoJson {
  type: 'FeatureCollection';
  features: Claim[];
}

interface ClaimStats {
    total_claims: number;
    by_type: { [key: string]: number };
}

interface AppState {
  claims: GeoJson;
  isLoadingClaims: boolean;
  fetchClaims: () => Promise<void>;

  stats: ClaimStats;
  isLoadingStats: boolean;
  fetchStats: () => Promise<void>;

  recommendations: any[];
  isLoadingRecommendations: boolean;
  selectedClaimId: number | null;
  fetchRecommendations: (claimId: number) => Promise<void>;
  setSelectedClaimId: (claimId: number | null) => void;

  // Add other state slices as needed
}

export const useAppStore = create<AppState>((set, get) => ({
  claims: { type: 'FeatureCollection', features: [] },
  isLoadingClaims: false,

  stats: { total_claims: 0, by_type: {} },
  isLoadingStats: false,

  recommendations: [],
  isLoadingRecommendations: false,
  selectedClaimId: null,

  fetchClaims: async () => {
    set({ isLoadingClaims: true });
    try {
      const claimsData = await getClaims(); // Add filtering logic later
      set({ claims: claimsData, isLoadingClaims: false });
    } catch (error) {
      console.error("Failed to fetch claims:", error);
      set({ isLoadingClaims: false });
    }
  },

  fetchStats: async () => {
    set({ isLoadingStats: true });
    try {
      const statsData = await getClaimStats();
      set({ stats: statsData, isLoadingStats: false });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      set({ isLoadingStats: false });
    }
  },

  setSelectedClaimId: (claimId) => {
    set((state) => ({
      selectedClaimId: state.selectedClaimId === claimId ? null : claimId,
      recommendations: state.selectedClaimId === claimId ? [] : state.recommendations,
    }));
  },

  fetchRecommendations: async (claimId) => {
    set({ isLoadingRecommendations: true, recommendations: [] });
    try {
      const result = await getDssRecommendations(claimId);
      set({ recommendations: result.recommendations, isLoadingRecommendations: false });
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      set({ recommendations: [{scheme: "Error", description: "Could not fetch recommendations."}], isLoadingRecommendations: false });
    }
  },
}));