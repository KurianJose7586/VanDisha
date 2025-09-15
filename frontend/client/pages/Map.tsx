// Key Changes:
// - Fetches all claims when the component mounts.
// - Defines a handleClaimClick function to trigger DSS recommendation fetching.
// - Passes the click handler to the FRAClaimLayer component.

import { useEffect } from 'react';
import MapCanvas from '@/client/components/MapCanvas';

import { Sidebar } from '@/client/components/Sidebar';
import { useAtlasStore  } from '@/client/store';

export default function MapPage() {
  const { fetchClaims, setSelectedClaimId, fetchRecommendations, selectedClaimId } = useAtlasStore ();

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);
  
  const handleClaimClick = (claimId: number) => {
    // If the same claim is clicked, deselect it. Otherwise, fetch new recommendations.
    if (selectedClaimId === claimId) {
      setSelectedClaimId(null);
    } else {
      setSelectedClaimId(claimId);
      fetchRecommendations(claimId);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1">
        <MapCanvas onClaimClick={handleClaimClick} />
      </main>
    </div>
  );
}