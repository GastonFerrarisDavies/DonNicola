'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getAllClientes } from '@/lib/api/apiCliente';
import { getAllSucursales } from '@/lib/api/apiSucursal';
import { getAllProducts } from '@/lib/api/apiProduct';
import { getLotesBySucursal } from '@/lib/api/apiLote';
import { createVentaCompleta, getAllVentas } from '@/lib/api/apiVenta';

export default function VentasPage() {
    const [clientes, setClientes] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [productos, setProductos] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [viewMode, setViewMode] = useState('create'); // 'create' o 'list'

    // Estado del formulario
    const [formData, setFormData] = useState({
        clienteId: '',
        sucursalId: '',
        fecha: new Date().toISOString().split('T')[0],
        productos: []
    });

    // Estado para el producto que se está agregando
    const [nuevoProducto, setNuevoProducto] = useState({
        productoId: '',
        loteId: '',
        cantidad: 1,
        precioUnitario: 0
    });

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const [clientesData, sucursalesData, productosData, ventasData] = await Promise.all([
                    getAllClientes(),
                    getAllSucursales(),
                    getAllProducts(),
                ]);
                setClientes(clientesData);
                setSucursales(sucursalesData);
                setProductos(productosData);
            } catch (error) {
                console.error('Error cargando datos:', error);
                setMessage('Error cargando los datos necesarios');
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    // Filtrar lotes por producto seleccionado (ya están filtrados por sucursal)
    const lotesDisponibles = nuevoProducto.productoId
        ? lotes.filter(lote => 
            lote.productoId === parseInt(nuevoProducto.productoId)
          )
        : [];


    // Calcular total de la venta
    const totalVenta = formData.productos.reduce((total, item) => {
        return total + (item.cantidad * item.precioUnitario);
    }, 0);

    // Manejar cambios en el formulario principal
    const handleFormChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Si cambia la sucursal, cargar lotes de esa sucursal y limpiar productos agregados
        if (name === 'sucursalId') {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                productos: []
            }));
            
            if (value) {
                try {
                    const lotesSucursal = await getLotesBySucursal(value);
                    setLotes(lotesSucursal);
                } catch (error) {
                    console.error('Error cargando lotes de la sucursal:', error);
                    setMessage('Error cargando los lotes de la sucursal');
                }
            } else {
                setLotes([]);
            }
        }
    };

    // Manejar cambios en el nuevo producto
    const handleNuevoProductoChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto(prev => ({
            ...prev,
            [name]: value
        }));

        // Si cambia el producto, actualizar precio unitario
        if (name === 'productoId') {
            const producto = productos.find(p => p.id === parseInt(value));
            setNuevoProducto(prev => ({
                ...prev,
                [name]: value,
                precioUnitario: producto ? producto.precio : 0
            }));
        }

        // Si cambia el lote, limpiar cantidad
        if (name === 'loteId') {
            setNuevoProducto(prev => ({
                ...prev,
                [name]: value,
                cantidad: 1
            }));
        }
    };

    // Agregar producto a la venta
    const agregarProducto = () => {
        if (!nuevoProducto.productoId || !nuevoProducto.loteId || !nuevoProducto.cantidad) {
            setMessage('Por favor complete todos los campos del producto');
            return;
        }

        const loteSeleccionado = lotes.find(l => l.id === parseInt(nuevoProducto.loteId));
        if (nuevoProducto.cantidad > loteSeleccionado.cantidad) {
            setMessage(`Cantidad excede el stock disponible (${loteSeleccionado.cantidad})`);
            return;
        }

        const producto = productos.find(p => p.id === parseInt(nuevoProducto.productoId));
        const subtotal = nuevoProducto.cantidad * nuevoProducto.precioUnitario;

        const productoParaAgregar = {
            ...nuevoProducto,
            productoId: parseInt(nuevoProducto.productoId),
            loteId: parseInt(nuevoProducto.loteId),
            cantidad: parseInt(nuevoProducto.cantidad),
            precioUnitario: parseFloat(nuevoProducto.precioUnitario),
            subtotal,
            nombreProducto: producto.nombre,
            nombreLote: `Lote #${loteSeleccionado.id}`
        };

        setFormData(prev => ({
            ...prev,
            productos: [...prev.productos, productoParaAgregar]
        }));

        // Limpiar formulario de nuevo producto
        setNuevoProducto({
            productoId: '',
            loteId: '',
            cantidad: 1,
            precioUnitario: 0
        });

        setMessage('');
    };

    // Remover producto de la venta
    const removerProducto = (index) => {
        setFormData(prev => ({
            ...prev,
            productos: prev.productos.filter((_, i) => i !== index)
        }));
    };

    // Crear la venta
    const crearVenta = async () => {
        if (!formData.clienteId || !formData.sucursalId || formData.productos.length === 0) {
            setMessage('Por favor complete todos los campos requeridos');
            return;
        }

        try {
            setLoading(true);
            setMessage('');

            const ventaData = {
                clienteId: parseInt(formData.clienteId),
                sucursalId: parseInt(formData.sucursalId),
                fecha: formData.fecha,
                total: totalVenta,
                productos: formData.productos.map(p => ({
                    loteId: p.loteId,
                    productoId: p.productoId,
                    cantidad: p.cantidad,
                    precioUnitario: p.precioUnitario,
                    subtotal: p.subtotal
                }))
            };

            const resultado = await createVentaCompleta(ventaData);
            setMessage('Venta creada exitosamente');
            
            // Limpiar formulario
            setFormData({
                clienteId: '',
                sucursalId: '',
                fecha: new Date().toISOString().split('T')[0],
                productos: []
            });

            // Recargar ventas
            const ventasActualizadas = await getAllVentas();
            setVentas(ventasActualizadas);

        } catch (error) {
            console.error('Error creando venta:', error);
            setMessage(error.message || 'Error al crear la venta');
        } finally {
            setLoading(false);
        }
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES');
    };

    if (loading && clientes.length === 0) {
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
                                <h1 className="text-xl font-bold text-gray-900">Gestión de Ventas</h1>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando...</p>
                    </div>
                </div>
            </div>
        );
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
                            <h1 className="text-xl font-bold text-gray-900">Gestión de Ventas</h1>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Header con botones de navegación */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ventas</h2>
                            <p className="text-gray-600">Administra las ventas y transacciones de Don Nicola</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setViewMode('create')}
                                className={`px-4 py-2 rounded-md cursor-pointer${
                                    viewMode === 'create' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Crear Venta
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-md ${
                                    viewMode === 'list' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Ver Ventas
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-4 p-4 rounded-lg ${
                            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    {/* Vista de crear venta */}
                    {viewMode === 'create' && (
                        <>
                            {/* Información básica de la venta */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cliente *
                                    </label>
                                    <select
                                        name="clienteId"
                                        value={formData.clienteId}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Seleccionar cliente</option>

                                        {clientes.map(cliente => (
                                            <option key={cliente.id} value={cliente.id}>
                                                {cliente.nombre} - {cliente.localidad}
                                            </option>   
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sucursal *
                                    </label>
                                    <select
                                        name="sucursalId"
                                        value={formData.sucursalId}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Seleccionar sucursal</option>
                                        {sucursales.map(sucursal => (
                                            <option key={sucursal.id} value={sucursal.id}>
                                                {sucursal.nombre} - {sucursal.direccion}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha *
                                    </label>
                                    <input
                                        type="date"
                                        name="fecha"
                                        value={formData.fecha}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Agregar productos */}
                            {formData.sucursalId && (
                                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Productos</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Producto
                                            </label>
                                            <select
                                                name="productoId"
                                                value={nuevoProducto.productoId}
                                                onChange={handleNuevoProductoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Seleccionar producto</option>
                                                {productos.map(producto => (
                                                    <option key={producto.id} value={producto.id}>
                                                        {producto.nombre} - ${producto.precio}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Lote
                                            </label>
                                            <select
                                                name="loteId"
                                                value={nuevoProducto.loteId}
                                                onChange={handleNuevoProductoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Seleccionar lote</option>
                                                {lotesDisponibles.map(lote => (
                                                    <option key={lote.id} value={lote.id}>
                                                        Lote #{lote.id} - Stock: {lote.cantidad}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cantidad
                                            </label>
                                            <input
                                                type="number"
                                                name="cantidad"
                                                value={nuevoProducto.cantidad}
                                                onChange={handleNuevoProductoChange}
                                                min="1"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Precio Unitario
                                            </label>
                                            <input
                                                type="number"
                                                name="precioUnitario"
                                                value={nuevoProducto.precioUnitario}
                                                onChange={handleNuevoProductoChange}
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={agregarProducto}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Agregar Producto
                                    </button>
                                </div>
                            )}

                            {/* Lista de productos agregados */}
                            {formData.productos.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Productos de la Venta</h2>
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Producto
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Lote
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Cantidad
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Precio Unit.
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Subtotal
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {formData.productos.map((producto, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {producto.nombreProducto}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {producto.nombreLote}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {producto.cantidad}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            ${producto.precioUnitario}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            ${producto.subtotal}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <button
                                                                onClick={() => removerProducto(index)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Total y botón de crear venta */}
                            {formData.productos.length > 0 && (
                                <div className="flex justify-between items-center bg-blue-50 p-6 rounded-lg">
                                    <div className="text-xl font-semibold text-gray-800">
                                        Total de la Venta: <span className="text-blue-600">${totalVenta.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={crearVenta}
                                        disabled={loading}
                                        className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Creando Venta...' : 'Crear Venta'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Vista de lista de ventas */}
                    {viewMode === 'list' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ventas Realizadas</h2>
                            {ventas.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No hay ventas registradas
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cliente
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Sucursal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Productos
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {ventas.map((venta) => (
                                                <tr key={venta.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        #{venta.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatearFecha(venta.fecha)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {venta.Cliente?.nombre} - {venta.Cliente?.localidad}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {venta.Sucursal?.nombre}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                                        ${parseFloat(venta.total).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {venta.VentaDetalle?.length || 0} productos
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
