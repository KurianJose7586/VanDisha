import UploadBox from "@/components/UploadBox";

export default function UploadPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Upload Claim
        </h1>
        <p className="mt-2 text-slate-600">
          Upload a claim PDF to ingest and refresh the map data. Supported: PDF.
        </p>
        <div className="mt-6">
          <UploadBox />
        </div>
      </div>
    </div>
  );
}
