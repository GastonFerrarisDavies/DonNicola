// frontend/src/lib/api/apiCliente.js

import { apiFetch } from './apiUtils';

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