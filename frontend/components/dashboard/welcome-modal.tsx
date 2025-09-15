"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TreePine, Info, Download, X } from "lucide-react"

interface WelcomeModalProps {
  open: boolean
  onClose: () => void
}

export function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-white">
        <div className="relative">
          <button onClick={onClose} className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 z-10">
            <X className="w-5 h-5 text-slate-500" />
          </button>

          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <TreePine className="w-8 h-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-slate-800">Welcome to VanDisha - Forest Rights Atlas</h1>
            </div>
            <p className="text-slate-600">Ministry of Tribal Affairs - Digital Forest Rights Management System</p>
          </DialogHeader>

          <div className="px-6 pb-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-emerald-800 mb-3">How to Use This System:</h3>
                  <div className="space-y-3 text-sm text-emerald-700">
                    <div>
                      <span className="font-semibold">1. Upload a FRA Claim:</span> Click the upload button to select
                      your document.
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="my-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Sample FRA Claim
                    </Button>

                    <div>
                      <span className="font-semibold">2. Wait for Map Loading:</span> The map will load in the center
                      panel.
                    </div>

                    <div>
                      <span className="font-semibold">3. Select Claim Zone:</span> Click on your land area on the map.
                    </div>

                    <div>
                      <span className="font-semibold">4. AI Analysis:</span> Watch as our AI extracts information.
                    </div>

                    <div>
                      <span className="font-semibold">5. Targeted Schemes:</span> Review the recommended schemes.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <TreePine className="w-5 h-5" />
                <span className="text-sm font-medium">This system helps streamline FRA claim processing.</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
