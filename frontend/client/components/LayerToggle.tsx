import { useAtlasStore } from "@/store";

export default function LayerToggle() {
  const { filters, toggleFilter } = useAtlasStore();
  return (
    <div className="rounded-xl border bg-white p-3">
      <div className="text-sm font-medium">Layers</div>
      <div className="mt-2 space-y-1 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.claimTypes.IFR}
            onChange={() => toggleFilter(["claimTypes", "IFR"])}
          />
          IFR Claims
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.claimTypes.CR}
            onChange={() => toggleFilter(["claimTypes", "CR"])}
          />
          CR Claims
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.claimTypes.CFR}
            onChange={() => toggleFilter(["claimTypes", "CFR"])}
          />
          CFR Claims
        </label>
        <label className="mt-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.showAssets.NDVI}
            onChange={() => toggleFilter(["showAssets", "NDVI"])}
          />
          NDVI
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.showAssets.NDWI}
            onChange={() => toggleFilter(["showAssets", "NDWI"])}
          />
          NDWI
        </label>
      </div>
    </div>
  );
}
