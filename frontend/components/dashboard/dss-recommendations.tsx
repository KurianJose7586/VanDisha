"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Brain, Sparkles, Zap, Target, TrendingUp, MapPin, FileText, AlertCircle } from "lucide-react"

interface DssRecommendationsProps {
  onClose: () => void
}

export function DssRecommendations({ onClose }: DssRecommendationsProps) {
  return (
    <aside className="w-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-l border-purple-200 overflow-y-auto shadow-xl rounded-lg">
      <div className="p-6 border-b border-purple-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-6 h-6" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg">AI Decision Support</h2>
              <p className="text-purple-100 text-xs">Powered by Advanced Analytics</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-white/20 text-white rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50 shadow-lg transition-all hover:shadow-xl hover:border-purple-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-purple-800">Claim Analysis</CardTitle>
                <p className="text-xs text-purple-600">Real-time AI Assessment</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">Verification Status</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-300">94% Confidence</Badge>
            </div>

            <div className="space-y-2 text-slate-600">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Land Area: 2.4 hectares</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Documentation: Complete</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>Satellite Match: 98%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-lg transition-all hover:shadow-xl hover:border-blue-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-blue-800">Smart Recommendations</CardTitle>
                <p className="text-xs text-blue-600">AI-Generated Insights</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors">
              <p className="text-sm font-medium text-emerald-800">Priority Action</p>
              <p className="text-xs text-emerald-700 mt-1">Approve for MGNREGA work allocation</p>
            </div>

            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
              <p className="text-sm font-medium text-blue-800">Development Scheme</p>
              <p className="text-xs text-blue-700 mt-1">Eligible for sustainable agriculture program</p>
            </div>

            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
              <p className="text-sm font-medium text-purple-800">Conservation</p>
              <p className="text-xs text-purple-700 mt-1">Recommend biodiversity monitoring setup</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-lg transition-all hover:shadow-xl hover:border-amber-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-amber-800">Risk Assessment</CardTitle>
                <p className="text-xs text-amber-600">Automated Monitoring</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Overall Risk Level</span>
                <Badge className="bg-green-100 text-green-800 border-green-300">Low Risk</Badge>
              </div>
              <p className="text-xs text-green-700 mt-2">No conflicts detected with existing claims</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}