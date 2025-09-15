"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Brain, X } from "lucide-react"
import { DssRecommendations } from "./dss-recommendations"

// Mock claim data remains the same...
const mockClaims = [
  { id: 1, type: "IFR", x: 30, y: 40, village: "Khandwa", district: "Madhya Pradesh" },
  { id: 2, type: "CR", x: 60, y: 30, village: "Bastar", district: "Chhattisgarh" },
  { id: 3, type: "CFR", x: 45, y: 60, village: "Gadchiroli", district: "Maharashtra" },
  { id: 4, type: "IFR", x: 70, y: 50, village: "Koraput", district: "Odisha" },
  { id: 5, type: "CR", x: 25, y: 70, village: "Wayanad", district: "Kerala" },
]

export function InteractiveMap() {
  const [selectedClaim, setSelectedClaim] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showDss, setShowDss] = useState(false)

  const handleClaimClick = (claimId: number) => {
    setSelectedClaim(claimId)
    setIsAnalyzing(true)
    setShowDss(true)

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  const getClaimColor = (type: string) => {
    switch (type) {
      case "IFR":
        return "bg-blue-500 border-blue-600"
      case "CR":
        return "bg-green-500 border-green-600"
      case "CFR":
        return "bg-orange-500 border-orange-600"
      default:
        return "bg-gray-500 border-gray-600"
    }
  }

  return (
    <div className="h-full flex">
      {/* Map Area */}
      <div className="flex-1 relative bg-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200">
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
              {Array.from({ length: 400 }).map((_, i) => (
                <div key={i} className="border border-slate-300/50" />
              ))}
            </div>
          </div>
          {mockClaims.map((claim) => (
            <div
              key={claim.id}
              className={`absolute w-16 h-12 ${getClaimColor(claim.type)} opacity-70 hover:opacity-90 cursor-pointer transition-all duration-200 rounded-sm ${
                selectedClaim === claim.id ? "ring-4 ring-emerald-500 ring-opacity-50 opacity-100" : ""
              }`}
              style={{
                left: `${claim.x}%`,
                top: `${claim.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => handleClaimClick(claim.id)}
              title={`${claim.type} - ${claim.village}, ${claim.district}`}
            />
          ))}
        </div>
        <div className="absolute bottom-6 left-6 bg-white border border-slate-200 p-4 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-2 text-sm text-slate-800">Claim Types</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-blue-500 rounded-sm"></div>
              <span className="text-slate-700">Individual (IFR)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-green-500 rounded-sm"></div>
              <span className="text-slate-700">Community (CR)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-orange-500 rounded-sm"></div>
              <span className="text-slate-700">Community Forest (CFR)</span>
            </div>
          </div>
        </div>

        {selectedClaim && (
          <div className="absolute top-4 right-4">
            <Button onClick={() => setShowDss(!showDss)} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
              {showDss ? <X className="w-4 h-4 mr-2" /> : <Brain className="w-4 h-4 mr-2" />}
              {showDss ? "Hide Insights" : "Show AI Insights"}
            </Button>
          </div>
        )}
      </div>

      {/* AI Decision Support Panel */}
      {showDss && selectedClaim && (
        <div className="w-96 bg-white border-l border-slate-200 p-6 overflow-y-auto">
          {isAnalyzing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
                <p className="mt-4 text-slate-500">AI is analyzing the claim...</p>
              </div>
            </div>
          ) : (
            <DssRecommendations onClose={() => setShowDss(false)} />
          )}
        </div>
      )}
    </div>
  )
}