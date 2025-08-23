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
        console.log('🔐 Token encontrado:', authToken ? 'SÍ' : 'NO');
        if (authToken) {
            console.log('🔑 Token:', authToken.substring(0, 20) + '...');
        }
    }
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    // Agregar el token de autorización si está disponible
    if (authToken) {
        defaultHeaders['Authorization'] = `Bearer ${authToken}`;
        console.log('📤 Enviando header Authorization:', `Bearer ${authToken.substring(0, 20)}...`);
    } else {
        console.log('⚠️ No se envió header Authorization - Token no encontrado');
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    console.log('🌐 Haciendo petición a:', url);
    console.log('📋 Configuración:', config);

    try {
        const response = await fetch(url, config);

        console.log('📥 Respuesta recibida:', response.status, response.statusText);

        if (!response.ok) {
            // Intenta parsear el error del backend si es JSON
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
            console.error('❌ Error en la petición:', errorData);
            throw new Error(errorData.message || `Error en la petición: ${response.status} ${response.statusText}`);
        }

        // Si la respuesta es 204 No Content, no intentes parsear JSON
        if (response.status === 204) {
            return null;
        }

        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        return data;
    } catch (error) {
        console.error(`❌ Error en apiFetch para ${url}:`, error);
        throw error; // Re-lanza el error para que el componente lo maneje
    }
}
