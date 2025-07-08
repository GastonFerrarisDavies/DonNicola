import { DashboardContent } from "@/components/dashboard-content"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardContent />
      </SidebarInset>
    </SidebarProvider>
  )
}
