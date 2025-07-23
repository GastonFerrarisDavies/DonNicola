// frontend/src/lib/api.js

// La URL base de tu API de backend.
// Esta variable se obtiene de NEXT_PUBLIC_API_URL en tu .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Realiza una petición fetch genérica a la API.
 * @param {string} endpoint - La ruta específica de la API (ej. '/productos').
 * @param {object} options - Opciones para la petición fetch (method, headers, body, etc.).
 * @returns {Promise<any>} - La respuesta parseada como JSON.
 * @throws {Error} - Si la respuesta no es exitosa.
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = {
        'Content-Type': 'application/json',
        // Aquí podrías añadir el token de autorización si lo manejas globalmente
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Intenta parsear el error del backend si es JSON
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
            throw new Error(errorData.message || `Error en la petición: ${response.status} ${response.statusText}`);
        }

        // Si la respuesta es 204 No Content, no intentes parsear JSON
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en apiFetch para ${url}:`, error);
        throw error; // Re-lanza el error para que el componente lo maneje
    }
}

// ======================================================
// Funciones Específicas para cada Recurso de la API
// ======================================================

/**
 * Obtiene todos los productos del backend.
 * @returns {Promise<Array>} - Un array de objetos producto.
 */
export async function getAllProducts() {
    return apiFetch('/productos');
}

/**
 * Crea un nuevo producto en el backend.
 * @param {object} productData - Los datos del producto a crear.
 * @returns {Promise<object>} - El objeto del producto creado.
 */
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

/**
 * Obtiene un producto por su ID.
 * @param {number} id - El ID del producto.
 * @returns {Promise<object>} - El objeto del producto.
 */
export async function getProductById(id) {
    return apiFetch(`/productos/${id}`);
}

/**
 * Actualiza un producto existente en el backend.
 * @param {number} id - El ID del producto a actualizar.
 * @param {object} productData - Los nuevos datos del producto.
 * @returns {Promise<object>} - El objeto del producto actualizado.
 */
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

/**
 * Elimina un producto del backend.
 * @param {number} id - El ID del producto a eliminar.
 * @returns {Promise<object>} - Confirmación de eliminación.
 */
export async function deleteProduct(id) {
    return apiFetch(`/productos/${id}`, {
        method: 'DELETE',
    });
}

// Ejemplo: Funciones para Lotes
export async function createLote(loteData) {
    return apiFetch('/lotes', {
        method: 'POST',
        body: JSON.stringify(loteData),
    });
}

export async function getAllLotes() {
    return apiFetch('/lotes');
}
