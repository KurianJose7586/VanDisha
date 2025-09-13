export type GeoJSON = any;

export interface DSSRecommendation {
  scheme: string;
  reason: string;
  score: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "same-origin",
    cache: "no-store",
    headers: { ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
  }
  return res.json();
}

export const api = {
  ingest: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request("/api/ingest", { method: "POST", body: form });
  },
  getClaims: async (): Promise<GeoJSON> => {
    return request("/api/claims");
  },
  getAssets: async (): Promise<GeoJSON> => {
    return request("/api/assets");
  },
  getRecommendations: async (
    claimId: string,
  ): Promise<{ claim_id: string; recommendations: DSSRecommendation[] }> => {
    return request(`/api/dss/recommend/${encodeURIComponent(claimId)}`);
  },
};
