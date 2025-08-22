// frontend/src/lib/api/apiProduct.js

import { apiFetch } from './apiUtils';

export async function getAllProducts() {
    return apiFetch('/productos');
}

export async function createProduct(productData) {
    // Preparar los datos del producto
    const productPayload = {
        nombre: productData.nombre,
        tipo: productData.tipo,
        descripcion: productData.descripcion,
        precio: parseFloat(productData.precio),
        imagen: productData.imagen instanceof File ? null : productData.imagen // Por ahora no manejamos archivos
    };

    return apiFetch('/productos', {
        method: 'POST',
        body: JSON.stringify(productPayload),
    });
}

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


