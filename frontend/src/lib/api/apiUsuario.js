// frontend/src/lib/api/apiUsuario.js

import { apiFetch } from './apiUtils';

export async function getAllUsers() {
    return apiFetch('/usuarios');
}

export async function createUser(userData) {
    // Preparar los datos del usuario
    const userPayload = {
        nombre: userData.nombre,
        email: userData.email,
        password: userData.password,
        rol: userData.rol,
        telefono: userData.telefono || null,
        activo: userData.activo !== undefined ? userData.activo : true
    };

    return apiFetch('/usuarios', {
        method: 'POST',
        body: JSON.stringify(userPayload),
    });
}

export async function getUserById(id) {
    return apiFetch(`/usuarios/${id}`);
}

export async function updateUser(id, userData) {
    // Preparar los datos del usuario
    const userPayload = {
        nombre: userData.nombre,
        email: userData.email,
        rol: userData.rol,
        telefono: userData.telefono || null,
        activo: userData.activo !== undefined ? userData.activo : true
    };

    // Solo incluir password si se está actualizando
    if (userData.password) {
        userPayload.password = userData.password;
    }

    return apiFetch(`/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userPayload),
    });
}

export async function deleteUser(id) {
    return apiFetch(`/usuarios/${id}`, {
        method: 'DELETE',
    });
}
