"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DashboardCards } from "./dashboard-cards"
import { StatsOverview } from "./stats-overview"

export function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-quaternary/20 px-4 bg-background2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold text-quaternary">Panel de Control</h1>
          <div className="text-sm text-quaternary/70">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6 bg-background1">
        <StatsOverview />
        <DashboardCards />
      </main>
    </div>
  )
}
