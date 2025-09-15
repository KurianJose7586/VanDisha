"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2, BarChart3, Users, TreePine, MapPin, Filter, Layers, ChevronDown, Search, Map } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  collapsed: boolean
}

export function DashboardSidebar({ collapsed }: DashboardSidebarProps) {
  const [ndviLoading, setNdviLoading] = useState(false)
  const [ndwiLoading, setNdwiLoading] = useState(false)
  const [ndviEnabled, setNdviEnabled] = useState(false)
  const [ndwiEnabled, setNdwiEnabled] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const handleNdviToggle = (checked: boolean) => {
    setNdviEnabled(checked)
    if (checked) {
      setNdviLoading(true)
      setTimeout(() => setNdviLoading(false), 2000)
    }
  }

  const handleNdwiToggle = (checked: boolean) => {
    setNdwiEnabled(checked)
    if (checked) {
      setNdwiLoading(true)
      setTimeout(() => setNdviLoading(false), 2000)
    }
  }

  return (
    <aside
      className={cn(
        "bg-white border-r border-slate-200 overflow-y-auto transition-all duration-300 shadow-sm",
        collapsed ? "w-16" : "w-80",
      )}
    >
      <div className={cn("p-6", collapsed && "p-3")}>
        {!collapsed ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-800">Progress</h2>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                  <CardContent className="p-3">
                    <div className="text-xl font-bold text-emerald-700">2,847</div>
                    <div className="text-xs text-emerald-600">Total Claims</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-3">
                    <div className="text-xl font-bold text-blue-700">89%</div>
                    <div className="text-xs text-blue-600">Processed</div>
                  </CardContent>
                </Card>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full justify-between p-2 h-8 text-slate-600 hover:bg-slate-50"
              >
                <span className="text-xs font-medium">View Breakdown</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", showBreakdown && "rotate-180")} />
              </Button>

              {showBreakdown && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">IFR</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">1,245</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">CR</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">892</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TreePine className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">CFR</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">710</span>
                  </div>
                </div>
              )}
            </div>

            <Accordion type="multiple" defaultValue={["filters", "layers"]} className="space-y-3">
              <AccordionItem value="filters" className="border border-slate-200 rounded-xl bg-white shadow-sm">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-600" />
                    <span className="font-semibold text-slate-800">Advanced Filters</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="district" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Search className="w-3 h-3" />
                        District
                      </Label>
                      <Input
                        id="district"
                        placeholder="Enter district name"
                        className="mt-1 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="village" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Map className="w-3 h-3" />
                        Village
                      </Label>
                      <Input
                        id="village"
                        placeholder="Enter village name"
                        className="mt-1 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                      Apply Filters
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="layers" className="border border-slate-200 rounded-xl bg-white shadow-sm">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-600" />
                    <span className="font-semibold text-slate-800">Map Layers</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TreePine className="w-4 h-4 text-green-600" />
                        <Label htmlFor="ndvi" className="text-sm font-medium text-slate-700">
                          NDVI (Vegetation)
                        </Label>
                        {ndviLoading && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
                      </div>
                      <Switch id="ndvi" checked={ndviEnabled} onCheckedChange={handleNdviToggle} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <Label htmlFor="ndwi" className="text-sm font-medium text-slate-700">
                          NDWI (Water)
                        </Label>
                        {ndwiLoading && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
                      </div>
                      <Switch id="ndwi" checked={ndwiEnabled} onCheckedChange={handleNdwiToggle} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-emerald-600 mx-auto" />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
