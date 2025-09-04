// frontend/src/lib/api/apiUtils.js

// La URL base de tu API de backend.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Función utilitaria para hacer peticiones a la API con autenticación automática
 * @param {string} endpoint - El endpoint de la API
 * @param {Object} options - Opciones de la petición fetch
 * @returns {Promise} - La respuesta de la API
 */
export async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Obtener el token de autenticación si está disponible
    let authToken = null;
    if (typeof window !== 'undefined') {
        authToken = localStorage.getItem('authToken');
    }
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    // Agregar el token de autorización si está disponible
    if (authToken) {
        defaultHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    // Solo loguear en desarrollo para evitar spam en consola
    if (process.env.NODE_ENV === 'development') {
        console.log('🌐 Haciendo petición a:', url);
    }

    try {
        const response = await fetch(url, config);

        // Solo loguear en desarrollo para evitar spam en consola
        if (process.env.NODE_ENV === 'development') {
            console.log('📥 Respuesta recibida:', response.status, response.statusText);
        }

        if (!response.ok) {
            // Intenta parsear el error del backend si es JSON
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
            console.error('❌ Error en la petición:', errorData);
            
            // Manejar errores específicos por código de estado
            if (response.status === 400) {
                throw new Error(errorData.message || 'Datos inválidos enviados al servidor.');
            } else if (response.status === 401) {
                throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
            } else if (response.status === 403) {
                throw new Error('Acceso denegado. No tienes permisos para realizar esta acción.');
            } else if (response.status === 404) {
                throw new Error('Recurso no encontrado.');
            } else if (response.status === 409) {
                throw new Error(errorData.message || 'Conflicto con el recurso existente.');
            } else if (response.status >= 500) {
                throw new Error('Error interno del servidor. Intenta nuevamente más tarde.');
            } else {
                throw new Error(errorData.message || `Error en la petición: ${response.status} ${response.statusText}`);
            }
        }

        // Si la respuesta es 204 No Content, no intentes parsear JSON
        if (response.status === 204) {
            return null;
        }

        const data = await response.json();
        // Solo loguear en desarrollo para evitar spam en consola
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Datos recibidos:', data);
        }
        return data;
    } catch (error) {
        console.error(`❌ Error en apiFetch para ${url}:`, error);
        throw error; // Re-lanza el error para que el componente lo maneje
    }
}
