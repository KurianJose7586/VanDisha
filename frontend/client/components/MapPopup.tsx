import { useEffect } from "react";
import { useAtlasStore, type ClaimFeature } from "@/store";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MapPopup({ feature }: { feature: ClaimFeature }) {
  const { loading, recommendations, fetchRecommendations, selectedClaim } =
    useAtlasStore();
  useEffect(() => {
    if (feature?.properties?.claim_id) {
      fetchRecommendations(feature.properties.claim_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature?.properties?.claim_id]);

  return (
    <div className="min-w-64">
      <div className="font-semibold">
        {feature.properties.claim_id} • {feature.properties.type}
      </div>
      <div className="text-xs text-muted-foreground">
        {feature.properties.claimant?.name}
        {feature.properties.claimant?.village
          ? ` • ${feature.properties.claimant?.village}`
          : ""}
      </div>
      <div className="mt-2 rounded-md bg-muted p-2 text-xs">
        Status:{" "}
        <span
          className={
            feature.properties.status === "Approved"
              ? "text-emerald-600"
              : "text-red-600"
          }
        >
          {feature.properties.status}
        </span>
      </div>
      <div className="mt-3">
        <div className="text-xs font-medium">DSS Summary</div>
        {loading.dss ? (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <LoadingSpinner /> Loading...
          </div>
        ) : (
          <ul className="mt-1 space-y-1 text-xs">
            {recommendations?.slice(0, 2).map((r, i) => (
              <li key={i} className="rounded bg-white p-2 shadow-sm">
                <div className="font-medium">{r.scheme}</div>
                <div className="text-muted-foreground">{r.reason}</div>
              </li>
            ))}
            {!recommendations?.length && (
              <li className="text-muted-foreground">No recommendations</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
