import LayerToggle from "@/components/LayerToggle";
import DashboardWidget from "@/components/DashboardWidget";
import { useAtlasStore } from "@/store";

export default function Sidebar() {
  const { claims, setSelectedClaim, filters, toggleFilter } = useAtlasStore();

  const list = (claims?.features ?? []).filter(
    (f: any) =>
      filters.claimTypes[f.properties.type] &&
      filters.status[f.properties.status],
  );

  return (
    <aside className="w-full max-w-xs shrink-0 bg-white p-4 shadow-lg h-screen overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.status.Approved}
              onChange={() => toggleFilter(["status", "Approved"])}
            />{" "}
            Approved
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.status.Pending}
              onChange={() => toggleFilter(["status", "Pending"])}
            />{" "}
            Pending
          </label>
        </div>
        <div className="mt-3">
          <LayerToggle />
        </div>
      </div>
      <DashboardWidget />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Claims</h3>
        <ul className="mt-2 space-y-2">
          {list.map((f: any) => (
            <li
              key={f.properties.claim_id}
              className="cursor-pointer rounded-lg border p-2 hover:bg-muted"
              onClick={() => setSelectedClaim(f)}
            >
              <div className="text-sm font-medium">
                {f.properties.claim_id} • {f.properties.type}
              </div>
              <div className="text-xs text-muted-foreground">
                {f.properties.claimant?.name ?? "Unknown"} •{" "}
                {f.properties.status}
              </div>
            </li>
          ))}
          {!list.length && (
            <li className="text-sm text-muted-foreground">
              No claims match filters
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}