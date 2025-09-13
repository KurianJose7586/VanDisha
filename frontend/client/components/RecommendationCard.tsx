import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAtlasStore } from "@/store";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function RecommendationCard() {
  const { selectedClaim, recommendations, loading, fetchRecommendations } =
    useAtlasStore();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (selectedClaim?.properties?.claim_id)
      fetchRecommendations(selectedClaim.properties.claim_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClaim?.properties?.claim_id]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="absolute bottom-4 left-4 z-[500] max-w-sm rounded-2xl bg-white p-3 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">DSS Recommendations</div>
            <button
              className="text-xs text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              Hide
            </button>
          </div>
          {!selectedClaim && (
            <div className="mt-1 text-xs text-muted-foreground">
              Select a claim to see recommendations.
            </div>
          )}
          {selectedClaim && (
            <div className="mt-2 rounded-md border p-2">
              <div className="text-xs font-medium">
                Claim {selectedClaim.properties.claim_id}
              </div>
              {loading.dss ? (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <LoadingSpinner /> Loading...
                </div>
              ) : (
                <ul className="mt-2 space-y-2 text-xs">
                  {recommendations?.map((r, i) => (
                    <li key={i} className="rounded-lg bg-muted p-2">
                      <div className="font-medium">{r.scheme}</div>
                      <div className="text-muted-foreground">{r.reason}</div>
                    </li>
                  ))}
                  {!recommendations?.length && (
                    <li className="text-muted-foreground">
                      No recommendations available
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
