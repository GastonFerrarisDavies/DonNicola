'use client'
import { useState, useEffect } from "react"
import { getAllProducts } from "@/lib/api/apiProduct"
import Footer from "@/components/footer.js"
import { Drum, Drumstick, Pizza, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProductosPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getAllProducts()
        setProducts(data)
        setFilteredProducts(data)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Error al cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Filtrar por tipo
    if (selectedFilter !== 'todos') {
      filtered = filtered.filter(product => product.tipo === selectedFilter)
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedFilter, searchTerm])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const getProductIcon = (tipo) => {
    if (tipo === 'queso') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    } else if (tipo === 'embutido') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
    return null
  }

  const getTypeColor = (tipo) => {
    if (tipo === 'queso') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    } else if (tipo === 'embutido') {
      return 'bg-red-100 text-red-800 border-red-200'
    }
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tertiary">
      {/* Minimalist Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
            
            <Link 
              href="/" 
              className="flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-300"
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold">Don Nicola</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-quinary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nuestros Productos
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Descubre nuestra selección de quesos artesanales y embutidos.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 max-w-[80%] overflow-x-scroll">
              <button
                onClick={() => setSelectedFilter('todos')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedFilter === 'todos'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedFilter('queso')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedFilter === 'queso'
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Pizza></Pizza>
                Quesos
              </button>
              <button
                onClick={() => setSelectedFilter('embutido')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedFilter === 'embutido'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Drumstick></Drumstick>
                Embutidos
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No se encontraron productos</h2>
              <p className="text-gray-600 mb-8">
                Intenta ajustar los filtros o términos de búsqueda
              </p>
              <button
                onClick={() => {
                  setSelectedFilter('todos')
                  setSearchTerm('')
                }}
                className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                >
                  {/* Product Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl text-gray-400 group-hover:scale-110 transition-transform duration-300">
                      {product.tipo === 'queso' ? '🧀' : '🥓'}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(product.tipo)}`}>
                        {product.tipo === 'queso' ? 'Queso' : 'Embutido'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-quaternary group-hover:text-primary transition-colors duration-300">
                        {product.nombre}
                      </h3>
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(product.precio)}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {product.descripcion}
                    </p>

                    <div className="flex items-center justify-between">
                      
                      
                      <button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-quaternary to-quinary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿No encontrás lo que buscás?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contáctanos directamente para consultas especiales o pedidos personalizados
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="cursor-pointer bg-white hover:bg-gray-100 text-primary px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1">
              Contactar por WhatsApp
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
