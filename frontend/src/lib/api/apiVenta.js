import { apiFetch } from './apiUtils';

// Obtener todas las ventas
export const getAllVentas = async () => {
    return await apiFetch('/ventas');
};

// Obtener una venta por ID
export const getVentaById = async (id) => {
    return await apiFetch(`/ventas/${id}`);
};

// Crear una venta simple
export const createVenta = async (ventaData) => {
    return await apiFetch('/ventas', {
        method: 'POST',
        body: JSON.stringify(ventaData),
    });
};

// Crear una venta completa con detalles y actualización de stock
export const createVentaCompleta = async (ventaData) => {
    return await apiFetch('/ventas/completa', {
        method: 'POST',
        body: JSON.stringify(ventaData),
    });
};

// Actualizar una venta
export const updateVenta = async (id, ventaData) => {
    return await apiFetch(`/ventas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(ventaData),
    });
};

// Eliminar una venta
export const deleteVenta = async (id) => {
    return await apiFetch(`/ventas/${id}`, {
        method: 'DELETE',
    });
};
