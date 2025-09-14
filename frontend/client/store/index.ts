import { create } from 'zustand';
import { getClaims, getDssRecommendations, getClaimStats } from '@/client/lib/api';

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

interface State {
  claims: GeoJson;
  isLoading: boolean;
  error: string | null;
  fetchClaims: () => Promise<void>;
  filters: { IFR: boolean; CFR: boolean; CR: boolean };
  setFilter: (filter: 'IFR' | 'CFR' | 'CR', value: boolean) => void;
  advFilters: { district: string; village: string };
  setAdvFilter: (filterName: 'district' | 'village', value: string) => void;
  stats: ClaimStats;
  fetchStats: () => Promise<void>;
}

export interface DssState {
  recommendations: any[];
  isLoadingRecommendations: boolean;
  selectedClaimId: number | null;
  fetchRecommendations: (claimId: number) => Promise<void>;
  setSelectedClaimId: (claimId: number | null) => void;
}

// --- STORE ---
export const useStore = create<State & DssState>((set, get) => ({
  claims: { type: 'FeatureCollection', features: [] },
  isLoading: true,
  error: null,
  filters: { IFR: true, CFR: true, CR: true },
  advFilters: { district: '', village: '' },
  stats: { total_claims: 0, by_type: {} },
  recommendations: [],
  isLoadingRecommendations: false,
  selectedClaimId: null,

  setFilter: (filter, value) => set((state) => ({ filters: { ...state.filters, [filter]: value } })),
  
  setAdvFilter: (filterName, value) => {
    set((state) => ({ advFilters: { ...state.advFilters, [filterName]: value } }));
  },

  fetchStats: async () => {
    try {
      const statsData = await getClaimStats();
      set({ stats: statsData });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  },

  fetchClaims: async () => {
    set({ isLoading: true, error: null });
    const { advFilters } = get();
    try {
      const claimsData = await getClaims(advFilters);
      set({ claims: claimsData, isLoading: false });
      get().fetchStats(); // Refresh stats whenever claims are fetched
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
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