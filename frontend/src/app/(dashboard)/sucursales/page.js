"use client"

import { useState, useEffect } from "react"
import { Building2, MapPin, Save, ArrowLeft, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { createSucursal, getAllSucursales, updateSucursal, deleteSucursal } from "@/lib/api/apiSucursal"

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState([])
  const [loading, setLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSucursal, setEditingSucursal] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: ""
  })

  // Cargar sucursales al montar el componente
  useEffect(() => {
    loadSucursales();
  }, []);

  const loadSucursales = async () => {
    try {
      setLoading(true);
      const data = await getAllSucursales();
      setSucursales(data);
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      if (editingSucursal) {
        await updateSucursal(editingSucursal.id, formData);
      } else {
        await createSucursal(formData);
      }
      
      // Recargar sucursales después de crear/actualizar
      await loadSucursales();
      
      setFormData({
        nombre: "",
        direccion: ""
      })
      setIsFormOpen(false)
      setEditingSucursal(null)
    } catch (error) {
      console.error("Error al guardar la sucursal:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (sucursal) => {
    setEditingSucursal(sucursal)
    setFormData({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta sucursal?")) {
      try {
        setLoading(true);
        await deleteSucursal(id);
        await loadSucursales(); // Recargar sucursales después de eliminar
      } catch (error) {
        console.error("Error al eliminar la sucursal:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      direccion: ""
    })
    setEditingSucursal(null)
    setIsFormOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Gestión de Sucursales</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sucursales</h2>
            <p className="text-gray-600">Administra las sucursales de Don Nicola</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Sucursal</span>
          </button>
        </div>

        {/* Formulario */}
        {isFormOpen && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingSucursal ? "Editar Sucursal" : "Nueva Sucursal"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Sucursal *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre de la sucursal"
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dirección completa"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSucursal ? "Actualizar" : "Guardar"} Sucursal</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Sucursales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Sucursales ({sucursales.length})
            </h3>
          </div>

          {loading && (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500">Cargando sucursales...</p>
            </div>
          )}

          {!loading && sucursales.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay sucursales</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza agregando tu primera sucursal.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Agregar Sucursal
                </button>
              </div>
            </div>
          ) : !loading ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sucursal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sucursales.map((sucursal) => (
                    <tr key={sucursal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {sucursal.nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {sucursal.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {sucursal.direccion}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(sucursal)}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                            title="Editar sucursal"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sucursal.id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                            title="Eliminar sucursal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
