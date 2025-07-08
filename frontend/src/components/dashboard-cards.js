"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card"
import { Button } from "@/components/button"
import { Badge } from "@/components/badge"
import { Package, Users, Target, ShoppingCart, UserCheck, Archive, Plus, Eye, Edit } from "lucide-react"

const dashboardSections = [
  {
    id: "lotes",
    title: "Gestión de Lotes",
    description: "Administra y controla los lotes de productos",
    icon: Archive,
    color: "bg-blue-500",
    stats: { total: 45, pending: 12 },
    actions: ["Crear Lote", "Ver Todos", "Importar"],
  },
  {
    id: "productos",
    title: "Productos",
    description: "Catálogo completo de productos disponibles",
    icon: Package,
    color: "bg-green-500",
    stats: { total: 1247, pending: 23 },
    actions: ["Añadir Producto", "Gestionar Stock", "Categorías"],
  },
  {
    id: "usuarios",
    title: "Usuarios del Sistema",
    description: "Gestión de usuarios y permisos",
    icon: Users,
    color: "bg-purple-500",
    stats: { total: 28, pending: 3 },
    actions: ["Nuevo Usuario", "Roles", "Permisos"],
  },
  {
    id: "clientes",
    title: "Base de Clientes",
    description: "Información y gestión de clientes",
    icon: UserCheck,
    color: "bg-orange-500",
    stats: { total: 892, pending: 15 },
    actions: ["Añadir Cliente", "Segmentación", "Historial"],
  },
  {
    id: "ventas",
    title: "Registro de Ventas",
    description: "Seguimiento de todas las transacciones",
    icon: ShoppingCart,
    color: "bg-red-500",
    stats: { total: 156, pending: 8 },
    actions: ["Nueva Venta", "Facturas", "Reportes"],
  },
  {
    id: "objetivos",
    title: "Objetivos y Metas",
    description: "Definición y seguimiento de objetivos",
    icon: Target,
    color: "bg-yellow-500",
    stats: { total: 12, pending: 4 },
    actions: ["Nuevo Objetivo", "Progreso", "Análisis"],
  },
]

export function DashboardCards() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Módulos de Gestión</h2>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Acceso Rápido
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardSections.map((section) => (
          <Card
            key={section.id}
            className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
            onClick={() => setSelectedSection(section.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${section.color} text-white`}>
                  <section.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {section.stats.total}
                </Badge>
              </div>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <CardDescription className="text-sm">{section.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total registros:</span>
                <span className="font-medium">{section.stats.total}</span>
              </div>

              {section.stats.pending > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pendientes:</span>
                  <Badge variant="outline" className="text-xs">
                    {section.stats.pending}
                  </Badge>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <Plus className="mr-1 h-3 w-3" />
                  Crear
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSection && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const section = dashboardSections.find((s) => s.id === selectedSection)
                const IconComponent = section?.icon
                return IconComponent ? <IconComponent className="h-5 w-5" /> : null
              })()}
              Acciones Rápidas - {dashboardSections.find((s) => s.id === selectedSection)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3">
              {dashboardSections
                .find((s) => s.id === selectedSection)
                ?.actions.map((action) => (
                  <Button key={action} variant="outline" className="justify-start bg-transparent">
                    {action}
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
