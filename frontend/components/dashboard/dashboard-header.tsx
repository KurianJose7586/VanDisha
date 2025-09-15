"use client"

import { Button } from "@/components/ui/button"
import { Plus, Menu, Home, X, HelpCircle } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  onShowWelcome: () => void
}

export function DashboardHeader({
  sidebarCollapsed,
  setSidebarCollapsed,
  onShowWelcome,
}: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hover:bg-slate-100"
        >
          {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>

        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          VanDisha FRA Atlas
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onShowWelcome}
          className="hover:bg-slate-100 bg-white border-slate-300"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>

        <Link href="/">
          <Button variant="outline" size="sm" className="hover:bg-slate-100 bg-white border-slate-300">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>

        <Link href="/ingest">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border-0">
            <Plus className="w-4 h-4 mr-2" />
            Ingest New Claim
          </Button>
        </Link>
      </div>
    </header>
  )
}