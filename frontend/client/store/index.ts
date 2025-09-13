import { create } from "zustand";
import { api, type DSSRecommendation } from "@/lib/api";

export type GeoJSON = any;
export type ClaimFeature = {
  type: "Feature";
  properties: {
    claim_id: string;
    type: "IFR" | "CR" | "CFR";
    status: "Approved" | "Pending";
    claimant?: {
      name: string;
      village?: string;
      district?: string;
      state?: string;
    };
  };
  geometry: any;
};

export interface AtlasState {
  claims: GeoJSON | null;
  assets: GeoJSON | null;
  selectedClaim: ClaimFeature | null;
  recommendations: DSSRecommendation[] | null;
  filters: {
    claimTypes: { IFR: boolean; CR: boolean; CFR: boolean };
    status: { Approved: boolean; Pending: boolean };
    showAssets: { NDVI: boolean; NDWI: boolean };
  };
  loading: { claims: boolean; assets: boolean; dss: boolean; ingest: boolean };
  error: { claims?: string; assets?: string; dss?: string; ingest?: string };

  fetchClaims: () => Promise<void>;
  fetchAssets: () => Promise<void>;
  setSelectedClaim: (feature: ClaimFeature | null) => void;
  fetchRecommendations: (claimId: string) => Promise<void>;
  toggleFilter: (
    path: ["claimTypes" | "status" | "showAssets", string],
  ) => void;
  uploadFile: (file: File) => Promise<void>;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  claims: null,
  assets: null,
  selectedClaim: null,
  recommendations: null,
  filters: {
    claimTypes: { IFR: true, CR: true, CFR: true },
    status: { Approved: true, Pending: true },
    showAssets: { NDVI: true, NDWI: true },
  },
  loading: { claims: false, assets: false, dss: false, ingest: false },
  error: {},

  fetchClaims: async () => {
    set((s) => ({
      loading: { ...s.loading, claims: true },
      error: { ...s.error, claims: undefined },
    }));
    try {
      const data = await api.getClaims();
      set({ claims: data });
    } catch (e: any) {
      set((s) => ({ error: { ...s.error, claims: e?.message ?? "Failed" } }));
    } finally {
      set((s) => ({ loading: { ...s.loading, claims: false } }));
    }
  },

  fetchAssets: async () => {
    set((s) => ({
      loading: { ...s.loading, assets: true },
      error: { ...s.error, assets: undefined },
    }));
    try {
      const data = await api.getAssets();
      set({ assets: data });
    } catch (e: any) {
      set((s) => ({ error: { ...s.error, assets: e?.message ?? "Failed" } }));
    } finally {
      set((s) => ({ loading: { ...s.loading, assets: false } }));
    }
  },

  setSelectedClaim: (feature) => set({ selectedClaim: feature }),

  fetchRecommendations: async (claimId: string) => {
    set((s) => ({
      loading: { ...s.loading, dss: true },
      error: { ...s.error, dss: undefined },
    }));
    try {
      const data = await api.getRecommendations(claimId);
      set({ recommendations: data.recommendations });
    } catch (e: any) {
      set((s) => ({ error: { ...s.error, dss: e?.message ?? "Failed" } }));
    } finally {
      set((s) => ({ loading: { ...s.loading, dss: false } }));
    }
  },

  toggleFilter: ([root, key]) => {
    set((s) => ({
      filters: {
        ...s.filters,
        [root]: {
          ...(s.filters as any)[root],
          [key]: !(s.filters as any)[root][key],
        },
      },
    }));
  },

  uploadFile: async (file) => {
    set((s) => ({
      loading: { ...s.loading, ingest: true },
      error: { ...s.error, ingest: undefined },
    }));
    try {
      await api.ingest(file);
      // After ingest, refresh claims
      await get().fetchClaims();
    } catch (e: any) {
      set((s) => ({ error: { ...s.error, ingest: e?.message ?? "Failed" } }));
    } finally {
      set((s) => ({ loading: { ...s.loading, ingest: false } }));
    }
  },
}));
