"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { InteractiveMap } from "@/components/dashboard/interactive-map"
import { WelcomeModal } from "@/components/dashboard/welcome-modal"

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <DashboardHeader
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onShowWelcome={() => setShowWelcomeModal(true)}
      />
      <div className="flex-1 flex overflow-hidden">
        <DashboardSidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 relative">
          <InteractiveMap />
        </main>
      </div>
      <WelcomeModal open={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
    </div>
  )
}