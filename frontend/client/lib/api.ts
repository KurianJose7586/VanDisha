const BASE_URL = 'http://127.0.0.1:8000'; // Your FastAPI server address

export const getClaims = async (filters: { district?: string; village?: string } = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.district) queryParams.append('district', filters.district);
  if (filters.village) queryParams.append('village', filters.village);

  const response = await fetch(`${BASE_URL}/api/claims?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch claims');
  }
  return response.json();
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/api/ingest`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Upload failed');
  }
  return response.json();
};

export const getDssRecommendations = async (claimId: number) => {
  const response = await fetch(`${BASE_URL}/api/dss/${claimId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch DSS recommendations');
  }
  return response.json();
};

export const getClaimStats = async () => {
    const response = await fetch(`${BASE_URL}/api/claims/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch claim stats');
    }
    return response.json();
};

export const getAssets = async (lat: number, lon: number) => {
  const response = await fetch(`${BASE_URL}/api/assets?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error('Failed to fetch assets');
  }
  return response.json();
};