'use client';

import { useState, useEffect } from 'react';
import { getAllLotes, createLote, deleteLote } from '../../../lib/api/apiLote';
import { getAllProducts } from '../../../lib/api/apiProduct';
import { getAllSucursales } from '../../../lib/api/apiSucursal';

export default function LotesPage() {
    const [lotes, setLotes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loteToDelete, setLoteToDelete] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        sucursalId: '',
        fechaProduccion: '',
        fechaCaducidad: '',
        productoId: '',
        cantidad: 1
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [lotesData, productosData, sucursalesData] = await Promise.all([
                getAllLotes(),
                getAllProducts(),
                getAllSucursales()
            ]);
            setLotes(lotesData);
            setProductos(productosData);
            setSucursales(sucursalesData);
        } catch (error) {
            console.error('Error cargando datos:', error);
            alert('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.sucursalId) {
            errors.sucursalId = 'Debe seleccionar una sucursal';
        }
        
        if (!formData.fechaProduccion) {
            errors.fechaProduccion = 'Debe seleccionar una fecha de producción';
        }
        
        if (!formData.fechaCaducidad) {
            errors.fechaCaducidad = 'Debe seleccionar una fecha de vencimiento';
        } else if (formData.fechaProduccion && formData.fechaCaducidad) {
            const fechaProd = new Date(formData.fechaProduccion);
            const fechaVenc = new Date(formData.fechaCaducidad);
            if (fechaVenc <= fechaProd) {
                errors.fechaCaducidad = 'La fecha de vencimiento debe ser posterior a la fecha de producción';
            }
        }

        if (!formData.productoId) {
            errors.productoId = 'Debe seleccionar un producto';
        }
        
        if (!formData.cantidad || formData.cantidad < 1) {
            errors.cantidad = 'La cantidad debe ser mayor a 0';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error del campo
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleProductoChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpiar error del campo
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            // Crear un solo lote
            const loteData = {
                sucursalId: parseInt(formData.sucursalId),
                productoId: parseInt(formData.productoId),
                cantidad: parseInt(formData.cantidad),
                fechaProduccion: formData.fechaProduccion,
                fechaCaducidad: formData.fechaCaducidad
            };

            await createLote(loteData);
            
            // Limpiar formulario y recargar datos
            setFormData({
                sucursalId: '',
                fechaProduccion: '',
                fechaCaducidad: '',
                productoId: '',
                cantidad: 1
            });
            setFormErrors({});
            setShowForm(false);
            setSuccessMessage('Lote creado exitosamente');
            loadData();
            
            // Limpiar mensaje después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error creando lotes:', error);
            setSuccessMessage('Error al crear el lote');
            
            // Limpiar mensaje de error después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        }
    };

    const confirmDelete = (lote) => {
        setLoteToDelete(lote);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!loteToDelete) return;
        
        try {
            await deleteLote(loteToDelete.id);
            setShowDeleteModal(false);
            setLoteToDelete(null);
            loadData();
            setSuccessMessage('Lote eliminado exitosamente');
            
            // Limpiar mensaje después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error eliminando lote:', error);
            setSuccessMessage('Error al eliminar el lote');
            
            // Limpiar mensaje de error después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const getProductoNombre = (productoId) => {
        const producto = productos.find(p => p.id === productoId);
        return producto ? producto.nombre : 'N/A';
    };

    const getSucursalNombre = (sucursalId) => {
        const sucursal = sucursales.find(s => s.id === sucursalId);
        return sucursal ? sucursal.nombre : 'N/A';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Lotes</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    {showForm ? 'Cancelar' : 'Crear Lote'}
                </button>
            </div>
            
            {/* Mensaje de éxito/error general */}
            {successMessage && !showForm && (
                <div className={`mb-6 p-4 rounded-md ${
                    successMessage.includes('Error') 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {successMessage.includes('Error') ? (
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario de creación */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Crear Lote</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sucursal *
                                </label>
                                <select
                                    name="sucursalId"
                                    value={formData.sucursalId}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formErrors.sucursalId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">Seleccionar sucursal</option>
                                    {sucursales.map(sucursal => (
                                        <option key={sucursal.id} value={sucursal.id}>
                                            {sucursal.nombre}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.sucursalId && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.sucursalId}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de Producción *
                                </label>
                                <input
                                    type="date"
                                    name="fechaProduccion"
                                    value={formData.fechaProduccion}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formErrors.fechaProduccion ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {formErrors.fechaProduccion && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.fechaProduccion}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de Vencimiento *
                                </label>
                                <input
                                    type="date"
                                    name="fechaCaducidad"
                                    value={formData.fechaCaducidad}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formErrors.fechaCaducidad ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {formErrors.fechaCaducidad && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.fechaCaducidad}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Producto *
                                </label>
                                <select
                                    name="productoId"
                                    value={formData.productoId}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formErrors.productoId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">Seleccionar producto</option>
                                    {productos.map(prod => (
                                        <option key={prod.id} value={prod.id}>
                                            {prod.nombre}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.productoId && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.productoId}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cantidad *
                                </label>
                                <input
                                    type="number"
                                    name="cantidad"
                                    value={formData.cantidad}
                                    onChange={handleInputChange}
                                    min="1"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formErrors.cantidad ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Cantidad"
                                    required
                                />
                                {formErrors.cantidad && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.cantidad}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setFormErrors({});
                                    setFormData({
                                        sucursalId: '',
                                        fechaProduccion: '',
                                        fechaCaducidad: '',
                                        productoId: '',
                                        cantidad: 1
                                    });
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Crear Lote
                            </button>
                        </div>
                        
                        {/* Mensaje de éxito/error */}
                        {successMessage && (
                            <div className={`mt-4 p-3 rounded-md text-sm ${
                                successMessage.includes('Error') 
                                    ? 'bg-red-50 text-red-700 border border-red-200' 
                                    : 'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                                {successMessage}
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* Lista de lotes */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Lotes Existentes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sucursal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Producción
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Vencimiento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {lotes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No hay lotes registrados
                                    </td>
                                </tr>
                            ) : (
                                lotes.map((lote) => (
                                    <tr key={lote.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {getProductoNombre(lote.productoId)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {getSucursalNombre(lote.sucursalId)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {lote.cantidad}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatDate(lote.fechaProduccion)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatDate(lote.fechaCaducidad)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => confirmDelete(lote)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Confirmar Eliminación
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                ¿Está seguro de que desea eliminar el lote de {getProductoNombre(loteToDelete?.productoId)} 
                                con cantidad {loteToDelete?.cantidad}?
                            </p>
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
