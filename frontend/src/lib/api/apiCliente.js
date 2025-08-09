// frontend/src/lib/api/apiCliente.js

// La URL base de tu API de backend.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';


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

export async function getAllClientes() {
    return apiFetch('/clientes');
}


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


export async function getClienteById(id) {
    return apiFetch(`/clientes/${id}`);
}


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


export async function deleteCliente(id) {
    return apiFetch(`/clientes/${id}`, {
        method: 'DELETE',
    });
} 