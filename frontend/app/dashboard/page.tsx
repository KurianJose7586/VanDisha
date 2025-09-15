"use client";

import { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { InteractiveMap } from "@/components/dashboard/interactive-map";
import { useAppStore } from "@/app/store/store";

export default function DashboardPage() {
  // Get the actions from your Zustand store
  const { fetchClaims, fetchStats } = useAppStore();

  // This hook runs once when the component is first mounted
  useEffect(() => {
    // Fetch the initial data from your backend API
    fetchClaims();
    fetchStats();
  }, [fetchClaims, fetchStats]);

  return (
    <div className="flex h-screen w-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <InteractiveMap />
        </main>
      </div>
    </div>
  );
}