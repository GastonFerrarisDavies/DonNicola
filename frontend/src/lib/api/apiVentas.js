// frontend/src/lib/api/apiProduct.js

import { getClienteById } from './apiCliente';
import { apiFetch } from './apiUtils';

export async function getAllVentas() {
    return apiFetch('/ventas');
}

export const createVenta = async (ventaData) => {
    try {
        apiFetch("/ventas", {
            method: 'POST',
            body: JSON.stringify(ventaData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al registrar la venta');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en la API de venta:', error);
        throw error;
    }
};

// Ejemplo de cómo llamar a esta función desde un componente de React/JS:
const ventaParaEnviar = {
    clienteId: 1, // Ejemplo
    sucursalId: 1, // Ejemplo
    ventaDetalle: [
        { productoId: 1, cantidad: 2, loteId: 1, precioUnitario: 10.50 },
        { productoId: 2, cantidad: 1, loteId: 2, precioUnitario: 25.00 }
    ]
};

export async function getProductById(id) {
    return apiFetch(`/productos/${id}`);
}

export async function updateProduct(id, productData) {
    // Preparar los datos del producto
    const productPayload = {
        nombre: productData.nombre,
        tipo: productData.tipo,
        descripcion: productData.descripcion,
        precio: parseFloat(productData.precio),
        imagen: productData.imagen instanceof File ? null : productData.imagen // Por ahora no manejamos archivos
    };

    return apiFetch(`/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productPayload),
    });
}

export async function deleteProduct(id) {
    return apiFetch(`/productos/${id}`, {
        method: 'DELETE',
    });
}


