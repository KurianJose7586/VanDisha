"use client"

import type React from "react"
import dynamic from "next/dynamic"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Upload,
  FileText,
  MapPin,
  Users,
  Building,
  TreePine,
  Lightbulb,
  Loader,
  X,
  Leaf,
  Trees,
  Download,
  Info,
} from "lucide-react"
import RecommendationItem from "@/components/ui/recommendation-item"

const Map = dynamic(() => import("@/components/ui/map"), {
  ssr: false,
})

export default function FRAAtlasDemo() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [isMapLoading, setIsMapLoading] = useState(false)
  const [mapCenterCoords, setMapCenterCoords] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const hasVisited = localStorage.getItem("fra-atlas-visited")
    if (!hasVisited) {
      setShowWelcomeModal(true)
    } else {
      setShowWelcomeModal(false)
    }
  }, [])

  const handleCloseWelcome = () => {
    setShowWelcomeModal(false)
    localStorage.setItem("fra-atlas-visited", "true")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setFilePreviewUrl(url)
      setShowMap(true)
      setIsMapLoading(true)
      setTimeout(() => {
        setIsMapLoading(false)
      }, 2000)

      return () => {
        if (filePreviewUrl) {
          URL.revokeObjectURL(filePreviewUrl)
        }
      }
    }
  }

  const handleDeleteFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl)
    }
    setUploadedFile(null)
    setFilePreviewUrl(null)
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
    setShowMap(false)
  }

  const handleMapCoordinatesUpdate = useCallback((lat: number, lng: number) => {
    setMapCenterCoords({ lat, lng })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const renderFilePreview = () => {
    if (!uploadedFile || !filePreviewUrl) {
      return <p className="text-sm text-center text-green-700 dark:text-green-300">Uploaded Document Preview</p>
    }
    const { type, name, size } = uploadedFile
    if (type.startsWith("image/")) {
      return (
        <div className="relative w-full h-full">
          <img src={filePreviewUrl} alt="Document preview" className="object-contain w-full h-full rounded" />
          <Button onClick={handleDeleteFile} size="sm" variant="destructive" className="absolute top-2 right-2 w-6 h-6 p-0">
            <X className="w-3 h-3" />
          </Button>
        </div>
      )
    }
    return (
      <div className="relative flex flex-col items-center justify-center w-full h-full space-y-2">
        <Button onClick={handleDeleteFile} size="sm" variant="destructive" className="absolute top-2 right-2 w-6 h-6 p-0">
          <X className="w-3 h-3" />
        </Button>
        <FileText className="w-12 h-12 text-green-600 dark:text-green-400" />
        <p className="text-sm font-medium text-green-800 dark:text-green-200">{type === "application/pdf" ? "PDF Document" : "Document"}</p>
        <p className="px-2 text-xs text-center text-green-600 truncate max-w-full dark:text-green-400">{name}</p>
        {type === "application/pdf" && (
          <p className="text-xs text-green-600 dark:text-green-400">{(size / 1024 / 1024).toFixed(1)} MB</p>
        )}
      </div>
    )
  }

  const extractedData = useMemo(() => ({
    holderName: "Ramesh Kumar",
    claimType: "Individual Forest Rights",
    area: "3.5 hectares",
  }), []);

  const recommendations = useMemo(() => [
    {
      title: "Community Forest Rights Recognition",
      description: "92% match - Eligible for CFR title under FRA 2006",
      delay: 2000,
      className:
        "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100 [&_p:last-child]:text-green-700 [&_p:last-child]:dark:text-green-300",
    },
    {
      title: "Sustainable Livelihood Program",
      description: "85% match - NTFP collection and processing support",
      delay: 4000,
      className:
        "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 [&_p:last-child]:text-emerald-700 [&_p:last-child]:dark:text-emerald-300",
    },
    {
      title: "Forest Conservation Scheme",
      description: "78% match - Biodiversity protection incentives available",
      delay: 6000,
      className:
        "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-700 text-teal-900 dark:text-teal-100 [&_p:last-child]:text-teal-700 [&_p:last-child]:dark:text-teal-300",
    },
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="max-w-2xl bg-white border-green-200 dark:bg-green-950 dark:border-green-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl text-green-800 dark:text-green-100">
              <Trees className="w-6 h-6" />
              Welcome to VanDisha - Forest Rights Atlas
            </DialogTitle>
            <DialogDescription className="text-green-700 dark:text-green-300">
              Ministry of Tribal Affairs - Digital Forest Rights Management System
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/30">
              <Info className="flex-shrink-0 w-5 h-5 mt-0.5 text-green-600 dark:text-green-400" />
              <div className="space-y-2">
                <h3 className="font-semibold text-green-800 dark:text-green-100">How to Use This System:</h3>
                <ol className="space-y-2 text-sm text-green-700 list-decimal list-inside dark:text-green-300">
                  <li>
                    <strong>Upload a FRA Claim:</strong> Click the upload button to select your document.
                    <div className="mt-1 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = "/sample-fra-claim-document.jpg";
                          link.download = "Sample_FRA_Claim.jpg";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download Sample FRA Claim
                      </Button>
                    </div>
                  </li>
                  <li><strong>Wait for Map Loading:</strong> The map will load in the center panel.</li>
                  <li><strong>Select Claim Zone:</strong> Click on your land area on the map.</li>
                  <li><strong>AI Analysis:</strong> Watch as our AI extracts information.</li>
                  <li><strong>Targeted Schemes:</strong> Review the recommended schemes.</li>
                </ol>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 text-sm text-green-600 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 dark:text-green-400">
              <TreePine className="w-4 h-4" />
              <span>This system helps streamline FRA claim processing.</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleCloseWelcome} className="text-white bg-green-700 hover:bg-green-800">
              Get Started
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-green-800 border-b shadow-lg">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center gap-3">
            <Trees className="w-8 h-8 text-green-100" />
            <div>
              <h1 className="text-2xl font-bold text-white">VanDisha</h1>
              <p className="text-sm text-green-100">Ministry of Tribal Affairs</p>
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container grid grid-cols-1 gap-4 p-4 mx-auto lg:grid-cols-10">
        <motion.div variants={cardVariants} className="space-y-4 lg:col-span-2">
          {/* Document Upload Card */}
          <Card className="shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
            <CardHeader className="bg-green-100 dark:bg-green-900/50">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                <Upload className="w-5 h-5" />
                Upload Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="font-medium text-green-800 dark:text-green-200">
                  Select Certificate or Map
                </Label>
                <Input id="file-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="cursor-pointer border-green-300 focus:border-green-500" />
              </div>
              {uploadedFile && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 p-2 text-sm text-green-700 rounded bg-green-100 dark:bg-green-900/50 dark:text-green-300">
                  <Leaf className="w-4 h-4" />
                  <span className="capitalize">{uploadedFile.name.split(".").pop()?.toUpperCase() || "FILE"}</span>
                </motion.div>
              )}
            </CardContent>
          </Card>
          {/* Document Preview Card */}
          <Card className="shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
            <CardHeader className="bg-green-100 dark:bg-green-900/50">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                <FileText className="w-5 h-5" />
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] flex items-center justify-center overflow-hidden border-2 border-dashed rounded-lg bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700">
                {renderFilePreview()}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map Card */}
        <motion.div variants={cardVariants} className="lg:col-span-5">
          <Card className="h-full shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
            <CardHeader className="bg-green-100 dark:bg-green-900/50">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                <MapPin className="w-5 h-5" />
                Forest Area & Land Rights Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] rounded-lg">
                {!showMap ? (
                  <div className="flex items-center justify-center w-full h-full border-2 border-dashed rounded-lg bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700">
                    <div className="text-center space-y-2">
                      <TreePine className="w-12 h-12 mx-auto text-green-600 dark:text-green-400" />
                      <p className="text-green-700 dark:text-green-300">Upload a document to view the map</p>
                    </div>
                  </div>
                ) : isMapLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 bg-green-50 dark:bg-green-900/30">
                    <Loader className="w-12 h-12 text-green-600 animate-spin" />
                    <p className="text-green-700 dark:text-green-300">Analyzing document & loading map...</p>
                  </div>
                ) : (
                  <Map claimData={extractedData} onCoordinatesUpdate={handleMapCoordinatesUpdate} />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data & Recommendations Panel */}
        {showMap && !isMapLoading ? (
          <motion.div variants={cardVariants} className="space-y-4 lg:col-span-3">
            <Card className="shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
              <CardHeader className="bg-green-100 dark:bg-green-900/50">
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                  <Users className="w-5 h-5" />
                  Extracted Land Rights Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Rights Holder Name</p>
                      <p className="text-sm text-green-600 dark:text-green-400">{extractedData.holderName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Forest Division</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Madhya Pradesh Central Division</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TreePine className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Land Use Type</p>
                      <p className="text-sm text-green-600 dark:text-green-400">{extractedData.claimType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">GPS Coordinates</p>
                      <p className="font-mono text-sm text-green-600 dark:text-green-400">
                        {mapCenterCoords
                          ? `${mapCenterCoords.lat.toFixed(4)}° N, ${mapCenterCoords.lng.toFixed(4)}° E`
                          : "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
              <CardHeader className="bg-green-100 dark:bg-green-900/50">
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                  <Lightbulb className="w-5 h-5" />
                  Forest Department Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <RecommendationItem
                      key={index}
                      title={rec.title}
                      description={rec.description}
                      delay={rec.delay}
                      className={rec.className}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={cardVariants} className="space-y-4 lg:col-span-3">
            <Card className="shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
              <CardHeader className="bg-green-100 dark:bg-green-900/50">
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                  <Users className="w-5 h-5" />
                  Extracted Land Rights Data
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-48">
                <p className="text-sm text-center text-green-700 dark:text-green-300">Data will appear here after analysis.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
              <CardHeader className="bg-green-100 dark:bg-green-900/50">
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                  <Lightbulb className="w-5 h-5" />
                  Forest Department Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-48">
                <p className="text-sm text-center text-green-700 dark:text-green-300">Recommendations will appear here.</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}