import { useMemo } from "react";
import { useAtlasStore } from "@/store";

export default function DashboardWidget() {
  const { claims } = useAtlasStore();
  const { approved, pending } = useMemo(() => {
    let approved = 0;
    let pending = 0;
    if (claims?.features) {
      for (const f of claims.features) {
        if (f.properties?.status === "Approved") approved++;
        else if (f.properties?.status === "Pending") pending++;
      }
    }
    return { approved, pending };
  }, [claims]);

  const total = approved + pending;
  const approvedPct = total ? Math.round((approved / total) * 100) : 0;

  return (
    <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border">
      <div className="text-xs text-muted-foreground">Claim Status</div>
      <div className="mt-1 text-2xl font-semibold">
        {approved}/{total} Approved
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${approvedPct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>Approved</span>
        <span>Pending</span>
      </div>
    </div>
  );
}
