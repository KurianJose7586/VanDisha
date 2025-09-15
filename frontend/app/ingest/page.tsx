import { DataIngestionForm } from "@/components/ingest/data-ingestion-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function IngestPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Map
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Data Ingestion</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-balance">Upload Forest Rights Claims</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Upload your forest rights documents or shapefiles to digitize and analyze claims using our AI-powered
              system.
            </p>
          </div>

          <DataIngestionForm />
        </div>
      </main>
    </div>
  )
}
