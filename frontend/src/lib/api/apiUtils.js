// frontend/src/lib/api/apiUtils.js

// La URL base de tu API de backend.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Función utilitaria para hacer peticiones a la API con autenticación automática
 * @param {string} endpoint - El endpoint de la API
 * @param {options} options - Opciones de la petición fetch
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

    try {
        const response = await fetch(url, config);

        // Si el token ha expirado (401), intentar renovarlo
        if (response.status === 401 && authToken && endpoint !== '/auth/refresh') {
            try {
                // Importar dinámicamente para evitar dependencias circulares
                const { refreshToken } = await import('./apiAuth');
                await refreshToken();
                
                // Obtener el nuevo token
                const newToken = localStorage.getItem('authToken');
                if (newToken) {
                    // Reintentar la petición original con el nuevo token
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    const retryResponse = await fetch(url, config);
                    
                    if (!retryResponse.ok) {
                        const errorData = await retryResponse.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
                        throw new Error(errorData.message || `Error en la petición: ${retryResponse.status} ${retryResponse.statusText}`);
                    }
                    
                    if (retryResponse.status === 204) {
                        return null;
                    }
                    
                    return await retryResponse.json();
                }
            } catch (refreshError) {
                console.error('Error al renovar token:', refreshError);
                // Si falla la renovación, redirigir al login
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
            }
        }

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
