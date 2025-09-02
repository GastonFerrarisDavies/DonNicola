"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Archive, Package, Users, UserCheck, Target, Building2, ShoppingCart } from "lucide-react"

const dashboardSecciones = [
  {
    id: "ventas",
    title: "Ventas",
    description: "Gestión de ventas y transacciones comerciales",
    icon: ShoppingCart,
    color: "bg-gradient-to-br from-green-500 to-green-600",
    stats: { total: 12, pending: 4 },
    actions: ["Nuevo Venta", "Progreso", "Análisis"],
  },
  {
    id: "lotes",
    title: "Gestión de Lotes",
    description: "Administra y controla los lotes de productos",
    icon: Archive,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    stats: { total: 45, pending: 12 },
    actions: ["Crear Lote", "Ver Todos", "Importar"],
    link: "lotes",
  },
  {
    id: "productos",
    title: "Productos",
    description: "Catálogo completo de productos disponibles",
    icon: Package,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    stats: { total: 1247, pending: 23 },
    actions: ["Añadir Producto", "Gestionar Stock", "Categorías"],
  },
  {
    id: "usuarios",
    title: "Usuarios del Sistema",
    description: "Gestión de usuarios y permisos del sistema",
    icon: Users,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    stats: { total: 28, pending: 3 },
    actions: ["Nuevo Usuario", "Roles", "Permisos"],
  },
  {
    id: "clientes",
    title: "Base de Clientes",
    description: "Información y gestión de la base de clientes",
    icon: UserCheck,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    stats: { total: 892, pending: 15 },
    actions: ["Añadir Cliente", "Segmentación", "Historial"],
  },
  {
    id: "objetivos",
    title: "Objetivos y Metas",
    description: "Definición y seguimiento de objetivos empresariales",
    icon: Target,
    color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    stats: { total: 12, pending: 4 },
    actions: ["Nuevo Objetivo", "Progreso", "Análisis"],
  },
  {
    id: "sucursales",
    title: "Sucursales",
    description: "Gestión y administración de sucursales",
    icon: Building2,
    color: "bg-gradient-to-br from-pink-500 to-pink-600",
    stats: { total: 2, pending: 1 },
    actions: ["Nueva Sucursal", "Gestionar", "Reportes"],
  }
]

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const updateDate = () => {
      const now = new Date()
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      setCurrentDate(now.toLocaleDateString("es-ES", options))
    }

    updateDate()
    const interval = setInterval(updateDate, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [])

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">Don Nicola</h1>
              <p className="text-sm text-gray-600">Panel de Administración</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{currentDate}</span>
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Ir a Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido al Dashboard</h2>
          <p className="text-gray-600">Aquí tienes un resumen de tu actividad y métricas importantes.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-semibold text-gray-900">2,543</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+12%</span>
              <span className="text-gray-600 text-sm ml-2">vs mes anterior</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-semibold text-gray-900">$45,231</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+8%</span>
              <span className="text-gray-600 text-sm ml-2">vs mes anterior</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ventas</p>
                <p className="text-2xl font-semibold text-gray-900">1,423</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-red-600 text-sm font-medium">-3%</span>
              <span className="text-gray-600 text-sm ml-2">vs mes anterior</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversión</p>
                <p className="text-2xl font-semibold text-gray-900">3.24%</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+0.5%</span>
              <span className="text-gray-600 text-sm ml-2">vs mes anterior</span>
            </div>
          </div>
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ventas</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-gray-500">Gráfico de ventas</p>
              </div>
            </div>
          </div>


          {/* Secciones (Cards del Dashboard) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dashboardSecciones.map((seccion) => (
              <Link href={`/${seccion.link || seccion.id}`} key={seccion.id} className="group">
                <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:scale-[1.02] hover:border-gray-300 group-hover:border-blue-200 overflow-hidden">
                  {/* Header con icono y badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${seccion.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <seccion.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">
                        {seccion.stats.total}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Total</span>
                    </div>
                  </div>

                  {/* Contenido principal */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {seccion.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {seccion.description}
                    </p>
                  </div>

                  {/* Estadísticas */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-gray-600 text-sm font-medium">Total registros:</span>
                      <span className="font-bold text-gray-900 text-lg">{seccion.stats.total.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                      <span className="text-yellow-700 text-sm font-medium">Pendientes:</span>
                      <span className="font-bold text-yellow-800 bg-yellow-200 rounded-full px-3 py-1 text-sm">
                        {seccion.stats.pending}
                      </span>
                    </div>
                  </div>

                                  {/* Indicador de hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse shadow-lg"></div>
                </div>
                
                {/* Efecto de gradiente sutil en hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Activity Feed */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Nueva venta registrada</p>
                  <p className="text-xs text-gray-500">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Usuario registrado</p>
                  <p className="text-xs text-gray-500">Hace 12 minutos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Producto actualizado</p>
                  <p className="text-xs text-gray-500">Hace 1 hora</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Error en el sistema</p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Últimas Transacciones</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#001</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Juan Pérez</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Plan Premium</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$299</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completado
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-15</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#002</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">María García</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Plan Básico</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$99</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-14</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#003</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Carlos López</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Plan Empresarial</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$599</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completado
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-13</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#004</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ana Martínez</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Plan Premium</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$299</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Cancelado
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-12</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div>
                <h4 className="text-lg font-semibold">Agregar Usuario</h4>
                <p className="text-blue-100 text-sm">Crear nuevo usuario en el sistema</p>
              </div>
            </div>
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <h4 className="text-lg font-semibold">Generar Reporte</h4>
                <p className="text-green-100 text-sm">Crear reporte de actividad</p>
              </div>
            </div>
          </button>

          <button className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <h4 className="text-lg font-semibold">Configuración</h4>
                <p className="text-purple-100 text-sm">Ajustar configuraciones del sistema</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
