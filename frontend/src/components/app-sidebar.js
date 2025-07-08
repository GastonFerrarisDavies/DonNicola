"use client"

import { Package, Users, Target, ShoppingCart, UserCheck, Archive, BarChart3, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Gestión",
    items: [
      {
        title: "Lotes",
        url: "#lotes",
        icon: Archive,
      },
      {
        title: "Productos",
        url: "#productos",
        icon: Package,
      },
      {
        title: "Usuarios",
        url: "#usuarios",
        icon: Users,
      },
      {
        title: "Clientes",
        url: "#clientes",
        icon: UserCheck,
      },
    ],
  },
  {
    title: "Operaciones",
    items: [
      {
        title: "Ventas",
        url: "#ventas",
        icon: ShoppingCart,
      },
      {
        title: "Objetivos",
        url: "#objetivos",
        icon: Target,
      },
    ],
  },
  {
    title: "Análisis",
    items: [
      {
        title: "Reportes",
        url: "#reportes",
        icon: BarChart3,
      },
      {
        title: "Configuración",
        url: "#configuracion",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">DonNicola</span>
            <span className="truncate text-xs text-sidebar-foreground/70">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
