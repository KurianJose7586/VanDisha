// Key Changes:
// - Added a new DssRecommendations component.
// - The main Sidebar component now includes this new section.

import { useStore } from '@/client/store';
import { LayerToggle } from './LayerToggle';
import { LoadingSpinner } from './LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

// A new component to display the DSS recommendations
function DssRecommendations() {
  const { recommendations, isLoadingRecommendations, selectedClaimId } = useStore();

  if (!selectedClaimId) {
    return (
      <div className="p-4 text-center text-sm text-gray-500 border-t">
        Click a claim on the map to see AI-powered recommendations.
      </div>
    );
  }

  if (isLoadingRecommendations) {
    return (
      <div className="p-4 flex flex-col items-center justify-center border-t">
        <LoadingSpinner />
        <p className="text-sm mt-2 text-gray-500">Generating Recommendations...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t">
      <h3 className="font-bold text-lg mb-2 text-gray-800">
        AI Recommendations for Claim #{selectedClaimId}
      </h3>
      <div className="space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <Card key={index} className="bg-white shadow-sm">
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-semibold text-blue-600">{rec.scheme}</CardTitle>
                {rec.priority && (
                  <CardDescription className={`text-xs font-medium ${
                    rec.priority === 'High' ? 'text-red-500' : 
                    rec.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    Priority: {rec.priority}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-3 text-xs text-gray-600">
                <p>{rec.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recommendations available.</p>
        )}
      </div>
    </div>
  );
}


export function Sidebar() {
  const { claims, isLoading } = useStore();
  const totalClaims = claims.features.length;

  return (
    <aside className="w-96 bg-gray-50 flex flex-col shadow-lg z-10">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">VanDisha FRA Atlas</h1>
        <p className="text-sm text-gray-500">Decision Support System</p>
      </div>

      <div className="p-4">
        <h2 className="font-semibold mb-2 text-gray-700">Map Layers</h2>
        <LayerToggle />
      </div>

      <div className="p-4 border-t">
        <h2 className="font-semibold mb-2 text-gray-700">Claim Summary</h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading claims...</p>
        ) : (
          <p className="text-sm text-gray-700">
            Displaying <span className="font-bold text-blue-600">{totalClaims}</span> claims.
          </p>
        )}
      </div>

      {/* --- NEW DSS SECTION --- */}
      <div className="flex-1 overflow-y-auto">
        <DssRecommendations />
      </div>
    </aside>
  );
}