import { useStore } from '@/client/store';
import { LayerToggle } from './LayerToggle';
import { LoadingSpinner } from './LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

function AdvancedFilters() {
  const { advFilters, setAdvFilter, fetchClaims } = useStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdvFilter(name as 'district' | 'village', value);
  };

  const handleApplyFilters = () => {
    fetchClaims();
  };
  
  const handleClearFilters = () => {
    setAdvFilter('district', '');
    setAdvFilter('village', '');
    setTimeout(fetchClaims, 100); 
  };

  return (
    <div className="p-4 border-t space-y-3">
       <h2 className="font-semibold text-gray-700">Advanced Filters</h2>
       <div>
         <label className="text-xs font-medium text-gray-600">District</label>
         <Input
           name="district"
           value={advFilters.district}
           onChange={handleFilterChange}
           placeholder="e.g., Dindori"
           className="h-8"
         />
       </div>
       <div>
         <label className="text-xs font-medium text-gray-600">Village</label>
         <Input
           name="village"
           value={advFilters.village}
           onChange={handleFilterChange}
           placeholder="e.g., Ghusal"
           className="h-8"
         />
       </div>
       <div className="flex space-x-2">
         <Button onClick={handleApplyFilters} className="w-full">Apply Filters</Button>
         <Button onClick={handleClearFilters} variant="outline" className="w-full">Clear</Button>
       </div>
    </div>
  );
}

function ProgressTracker() {
  const { stats, isLoading } = useStore();

  if (isLoading && stats.total_claims === 0) {
    return <div className="p-4 border-t"><p className="text-sm text-gray-500">Loading statistics...</p></div>;
  }

  return (
    <div className="p-4 border-t">
      <h2 className="font-semibold mb-3 text-gray-700">Progress Tracking</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Claims Digitized:</span>
          <span className="font-bold text-lg text-blue-600">{stats.total_claims}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Individual (IFR):</span>
          <span className="font-semibold text-gray-800">{stats.by_type['IFR'] || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Community (CR):</span>
          <span className="font-semibold text-gray-800">{stats.by_type['CR'] || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Community Forest (CFR):</span>
          <span className="font-semibold text-gray-800">{stats.by_type['CFR'] || 0}</span>
        </div>
      </div>
    </div>
  );
}

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

      <AdvancedFilters />

      <ProgressTracker />

      <div className="flex-1 overflow-y-auto">
        <DssRecommendations />
      </div>
    </aside>
  );
}