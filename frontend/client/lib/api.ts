// Key Changes:
// - Set BASE_URL to point to your live Python backend.
// - Added getDssRecommendations function to call the new DSS endpoint.

const BASE_URL = 'http://127.0.0.1:8000'; // Your FastAPI server address

export const getClaims = async () => {
  const response = await fetch(`${BASE_URL}/api/claims`);
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