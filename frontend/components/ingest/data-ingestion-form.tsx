"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Map, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function DataIngestionForm() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Upload Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Upload PDF
            </TabsTrigger>
            <TabsTrigger value="shapefile" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Upload Shapefile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="mt-6">
            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                } ${uploadComplete ? "border-green-500 bg-green-50" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadComplete ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-700">Upload Complete!</h3>
                      <p className="text-sm text-green-600">Your PDF has been successfully processed.</p>
                    </div>
                  </div>
                ) : isUploading ? (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-primary mx-auto animate-pulse" />
                    <div>
                      <h3 className="text-lg font-semibold">Processing Document...</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Extracting data and analyzing claim boundaries
                      </p>
                      <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                      <p className="text-xs text-muted-foreground mt-2">{uploadProgress}% complete</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">Drop your PDF here</h3>
                      <p className="text-sm text-muted-foreground">or click to browse files</p>
                    </div>
                    <input type="file" accept=".pdf" onChange={handleInputChange} className="hidden" id="pdf-upload" />
                    <label htmlFor="pdf-upload">
                      <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                        <span>Choose PDF File</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {!isUploading && !uploadComplete && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Supported formats:</p>
                      <p className="text-muted-foreground">
                        PDF documents containing forest rights claim information, maps, or survey data.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="shapefile" className="mt-6">
            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                } ${uploadComplete ? "border-green-500 bg-green-50" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadComplete ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-700">Upload Complete!</h3>
                      <p className="text-sm text-green-600">Your shapefile has been successfully processed.</p>
                    </div>
                  </div>
                ) : isUploading ? (
                  <div className="space-y-4">
                    <Map className="w-12 h-12 text-primary mx-auto animate-pulse" />
                    <div>
                      <h3 className="text-lg font-semibold">Processing Shapefile...</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Importing geographic data and validating boundaries
                      </p>
                      <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                      <p className="text-xs text-muted-foreground mt-2">{uploadProgress}% complete</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Map className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">Drop your shapefile here</h3>
                      <p className="text-sm text-muted-foreground">Upload .shp, .shx, .dbf files together</p>
                    </div>
                    <input
                      type="file"
                      accept=".shp,.shx,.dbf,.prj"
                      multiple
                      onChange={handleInputChange}
                      className="hidden"
                      id="shapefile-upload"
                    />
                    <label htmlFor="shapefile-upload">
                      <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                        <span>Choose Shapefile</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {!isUploading && !uploadComplete && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Required files:</p>
                      <p className="text-muted-foreground">
                        Please upload all shapefile components: .shp (geometry), .shx (index), .dbf (attributes), and
                        optionally .prj (projection).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          {uploadComplete ? (
            <>
              <Button
                onClick={handleBackToDashboard}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                View in Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadComplete(false)
                  setUploadProgress(0)
                }}
                className="flex-1"
              >
                Upload Another
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="flex-1 bg-transparent"
                disabled={isUploading}
              >
                Back to Map
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isUploading}>
                {isUploading ? "Processing..." : "Upload and Digitize"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
