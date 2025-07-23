// frontend/src/lib/api/apiCliente.js

// La URL base de tu API de backend.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Realiza una petición fetch genérica a la API.
 * @param {string} endpoint - La ruta específica de la API (ej. '/clientes').
 * @param {object} options - Opciones para la petición fetch (method, headers, body, etc.).
 * @returns {Promise<any>} - La respuesta parseada como JSON.
 * @throws {Error} - Si la respuesta no es exitosa.
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = {
        'Content-Type': 'application/json',
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
// Funciones Específicas para Clientes
// ======================================================

/**
 * Obtiene todos los clientes del backend.
 * @returns {Promise<Array>} - Un array de objetos cliente.
 */
export async function getAllClientes() {
    return apiFetch('/clientes');
}

/**
 * Crea un nuevo cliente en el backend.
 * @param {object} clienteData - Los datos del cliente a crear.
 * @returns {Promise<object>} - El objeto del cliente creado.
 */
export async function createCliente(clienteData) {
    // Preparar los datos del cliente
    const clientePayload = {
        nombre: clienteData.nombre,
        localidad: clienteData.localidad
    };

    return apiFetch('/clientes', {
        method: 'POST',
        body: JSON.stringify(clientePayload),
    });
}

/**
 * Obtiene un cliente por su ID.
 * @param {number} id - El ID del cliente.
 * @returns {Promise<object>} - El objeto del cliente.
 */
export async function getClienteById(id) {
    return apiFetch(`/clientes/${id}`);
}

/**
 * Actualiza un cliente existente en el backend.
 * @param {number} id - El ID del cliente a actualizar.
 * @param {object} clienteData - Los nuevos datos del cliente.
 * @returns {Promise<object>} - El objeto del cliente actualizado.
 */
export async function updateCliente(id, clienteData) {
    // Preparar los datos del cliente
    const clientePayload = {
        nombre: clienteData.nombre,
        localidad: clienteData.localidad
    };

    return apiFetch(`/clientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(clientePayload),
    });
}

/**
 * Elimina un cliente del backend.
 * @param {number} id - El ID del cliente a eliminar.
 * @returns {Promise<object>} - Confirmación de eliminación.
 */
export async function deleteCliente(id) {
    return apiFetch(`/clientes/${id}`, {
        method: 'DELETE',
    });
} 