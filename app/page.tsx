"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  X,
  Leaf,
  Trees,
  Download,
  Info,
} from "lucide-react"

export default function FRAAtlasDemo() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)

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
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const renderFilePreview = () => {
    if (!uploadedFile || !filePreviewUrl) {
      return <p className="text-green-700 dark:text-green-300 text-sm text-center">Uploaded Document Preview</p>
    }

    const fileType = uploadedFile.type

    if (fileType.startsWith("image/")) {
      return (
        <div className="relative w-full h-full">
          <img
            src={filePreviewUrl || "/placeholder.svg"}
            alt="Document preview"
            className="w-full h-full object-contain rounded"
          />
          <Button
            onClick={handleDeleteFile}
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )
    } else if (fileType === "application/pdf") {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center space-y-2">
          <Button
            onClick={handleDeleteFile}
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
          <FileText className="h-12 w-12 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-800 dark:text-green-200">PDF Document</p>
          <p className="text-xs text-green-600 dark:text-green-400 text-center px-2">{uploadedFile.name}</p>
          <p className="text-xs text-green-600 dark:text-green-400">
            {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
      )
    } else {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center space-y-2">
          <Button
            onClick={handleDeleteFile}
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
          <FileText className="h-12 w-12 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-800 dark:text-green-200">Document</p>
          <p className="text-xs text-green-600 dark:text-green-400 text-center px-2 truncate max-w-full">
            {uploadedFile.name}
          </p>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="max-w-2xl bg-white dark:bg-green-950 border-green-200 dark:border-green-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-green-800 dark:text-green-100 text-xl">
              <Trees className="h-6 w-6" />
              Welcome to VanDisha - Forest Rights Atlas
            </DialogTitle>
            <DialogDescription className="text-green-700 dark:text-green-300">
              Ministry of Tribal Affairs - Digital Forest Rights Management System
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <Info className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-green-800 dark:text-green-100">How to Use This System:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-green-700 dark:text-green-300">
                  <li>
                    <strong>Upload a FRA Claim:</strong> Click the upload button in the left panel to select your Forest
                    Rights Act document
                    <div className="mt-1 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-700 border-green-300 hover:bg-green-100 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-800 bg-transparent"
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = "/sample-fra-claim-document.jpg"
                          link.download = "Sample_FRA_Claim.pdf"
                          link.click()
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download Sample FRA Claim
                      </Button>
                    </div>
                  </li>
                  <li>
                    <strong>Wait for Map Loading:</strong> The interactive forest map will load in the center panel
                  </li>
                  <li>
                    <strong>Select Claim Zone:</strong> Click on your land area on the map to highlight the claim zone
                  </li>
                  <li>
                    <strong>AI Analysis:</strong> Watch as our AI-powered backend automatically extracts information
                    from your document and displays it on the right panel
                  </li>
                  <li>
                    <strong>Targeted Schemes:</strong> Review the recommended government schemes and forest conservation
                    programs tailored to your specific land rights
                  </li>
                </ol>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg">
              <TreePine className="h-4 w-4" />
              <span>
                This system helps streamline Forest Rights Act (FRA) claim processing and connects you with relevant
                conservation programs.
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleCloseWelcome} className="bg-green-700 hover:bg-green-800 text-white">
              Get Started
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-green-800 shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Trees className="h-8 w-8 text-green-100" />
            <div>
              <h1 className="text-2xl font-bold text-white">VanDisha</h1>
              <p className="text-green-100 text-sm">Ministry of Tribal Affairs</p>
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-4 gap-4 grid grid-cols-1 lg:grid-cols-10"
      >
        <motion.div variants={cardVariants} className="lg:col-span-2 space-y-4">
          <Card className="shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
            <CardHeader className="bg-green-100 dark:bg-green-900/50">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                <Upload className="h-5 w-5" />
                Upload Forest Rights Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-green-800 dark:text-green-200 font-medium">
                  Select Land Rights Certificate or Survey Map
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="cursor-pointer border-green-300 focus:border-green-500"
                />
              </div>
              {uploadedFile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 p-2 rounded"
                >
                  <Leaf className="h-4 w-4" />
                  <span className="capitalize">{uploadedFile.name.split(".").pop()?.toUpperCase() || "FILE"}</span>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
            <CardHeader className="bg-green-100 dark:bg-green-900/50">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                <FileText className="h-5 w-5" />
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center border-2 border-dashed border-green-300 dark:border-green-700 overflow-hidden">
                {renderFilePreview()}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} className="lg:col-span-5">
          <Card className="shadow-lg h-full border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
            <CardHeader className="bg-green-100 dark:bg-green-900/50">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                <MapPin className="h-5 w-5" />
                Forest Area & Land Rights Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center border border-green-300 dark:border-green-700">
                <div className="text-center space-y-2">
                  <TreePine className="h-12 w-12 mx-auto text-green-600 dark:text-green-400" />
                  <p className="text-green-700 dark:text-green-300">Forest Area Map Loading...</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Interactive forest boundaries and land rights will be displayed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} className="lg:col-span-3 space-y-4">
          <Card className="shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
            <CardHeader className="bg-green-100 dark:bg-green-900/50">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                <Users className="h-5 w-5" />
                Extracted Land Rights Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Rights Holder Name</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Ramesh Kumar</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Forest Division</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Madhya Pradesh Central Division</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TreePine className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Land Use Type</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Community Forest Rights</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">GPS Coordinates</p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-mono">22.9734° N, 78.6569° E</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-green-200 dark:border-green-800 bg-white/90 dark:bg-green-950/90">
            <CardHeader className="bg-green-100 dark:bg-green-900/50">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                <Lightbulb className="h-5 w-5" />
                Forest Department Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-green-50 dark:bg-green-950/40 rounded-lg border border-green-200 dark:border-green-700"
                >
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Community Forest Rights Recognition
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    92% match - Eligible for CFR title under FRA 2006
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-700"
                >
                  <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                    Sustainable Livelihood Program
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    85% match - NTFP collection and processing support
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-lg border border-teal-200 dark:border-teal-700"
                >
                  <p className="text-sm font-medium text-teal-900 dark:text-teal-100">Forest Conservation Scheme</p>
                  <p className="text-xs text-teal-700 dark:text-teal-300 mt-1">
                    78% match - Biodiversity protection incentives available
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
