// Key Changes:
// - Added state for recommendations, loading status, and selected claim ID.
// - Added actions to fetch recommendations and update the selected claim.

import { create } from 'zustand';
import { getClaims, getDssRecommendations } from '@/client/lib/api';

// Keep your existing types if they are defined elsewhere
export interface Claim {
  type: 'Feature';
  properties: {
    id: number;
    claimant_name: string;
    type: string;
    status: string;
  };
  geometry: any;
}

export interface GeoJson {
  type: 'FeatureCollection';
  features: Claim[];
}

interface State {
  claims: GeoJson;
  isLoading: boolean;
  error: string | null;
  fetchClaims: () => Promise<void>;
  filters: {
    IFR: boolean;
    CFR: boolean;
    CR: boolean;
  };
  setFilter: (filter: 'IFR' | 'CFR' | 'CR', value: boolean) => void;
}

// New state and actions for the DSS
export interface DssState {
  recommendations: any[];
  isLoadingRecommendations: boolean;
  selectedClaimId: number | null;
  fetchRecommendations: (claimId: number) => Promise<void>;
  setSelectedClaimId: (claimId: number | null) => void;
}

export const useStore = create<State & DssState>((set) => ({
  claims: { type: 'FeatureCollection', features: [] },
  isLoading: true,
  error: null,
  filters: {
    IFR: true,
    CFR: true,
    CR: true,
  },

  fetchClaims: async () => {
    set({ isLoading: true, error: null });
    try {
      const claimsData = await getClaims();
      set({ claims: claimsData, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setFilter: (filter, value) => {
    set((state) => ({
      filters: { ...state.filters, [filter]: value },
    }));
  },

  // --- NEW DSS STATE AND ACTIONS ---
  recommendations: [],
  isLoadingRecommendations: false,
  selectedClaimId: null,

  setSelectedClaimId: (claimId) => {
    // If the same claim is clicked again, deselect it
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