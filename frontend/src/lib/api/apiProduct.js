// frontend/src/lib/api/apiProduct.js

// La URL base de tu API de backend.
// Esta variable se obtiene de NEXT_PUBLIC_API_URL en tu .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


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


export async function createLote(loteData) {
    return apiFetch('/lotes', {
        method: 'POST',
        body: JSON.stringify(loteData),
    });
}

export async function getAllLotes() {
    return apiFetch('/lotes');
}
