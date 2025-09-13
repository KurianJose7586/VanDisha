import { useEffect, useState } from "react";
import WelcomeModal from "@/components/WelcomeModal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              FRA Atlas
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Geospatial intelligence for Forest Rights Act claims
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Upload claim PDFs, explore IFR/CR/CFR layers, overlay NDVI/NDWI
              assets, and get decision support recommendations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="" onClick={() => navigate("/upload")}>
                Upload Claim
              </Button>
              <Button variant="outline" onClick={() => navigate("/map")}>
                Open Map
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-emerald-600">IFR</div>
                <div className="text-muted-foreground">
                  Individual Forest Rights
                </div>
              </div>
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-teal-600">CR</div>
                <div className="text-muted-foreground">Community Rights</div>
              </div>
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">CFR</div>
                <div className="text-muted-foreground">
                  Community Forest Resource
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-200/60 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-teal-200/60 blur-2xl" />
            <div className="relative rounded-2xl border bg-white p-4 shadow-xl">
              <img
                src="/placeholder.svg"
                className="h-64 w-full rounded-lg object-cover"
                alt="map preview"
              />
            </div>
          </div>
        </div>
      </div>
      <WelcomeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
