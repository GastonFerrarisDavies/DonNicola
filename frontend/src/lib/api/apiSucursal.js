// frontend/src/lib/api/apiSucursal.js

import { apiFetch } from './apiUtils';

/**
 * Obtiene todas las sucursales
 * @returns {Promise<Array>} Lista de sucursales
 */
export async function getAllSucursales() {
    return await apiFetch('/sucursales');
}

/**
 * Obtiene una sucursal por ID
 * @param {number} id - ID de la sucursal
 * @returns {Promise<Object>} Sucursal encontrada
 */
export async function getSucursalById(id) {
    return await apiFetch(`/sucursales/${id}`);
}

/**
 * Crea una nueva sucursal
 * @param {Object} sucursalData - Datos de la sucursal
 * @param {string} sucursalData.nombre - Nombre de la sucursal
 * @param {string} sucursalData.direccion - Dirección de la sucursal
 * @returns {Promise<Object>} Sucursal creada
 */
export async function createSucursal(sucursalData) {
    return await apiFetch('/sucursales', {
        method: 'POST',
        body: JSON.stringify(sucursalData),
    });
}

/**
 * Actualiza una sucursal existente
 * @param {number} id - ID de la sucursal
 * @param {Object} sucursalData - Datos actualizados de la sucursal
 * @param {string} sucursalData.nombre - Nombre de la sucursal
 * @param {string} sucursalData.direccion - Dirección de la sucursal
 * @returns {Promise<Object>} Sucursal actualizada
 */
export async function updateSucursal(id, sucursalData) {
    return await apiFetch(`/sucursales/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sucursalData),
    });
}

/**
 * Elimina una sucursal
 * @param {number} id - ID de la sucursal
 * @returns {Promise<Object>} Respuesta de eliminación
 */
export async function deleteSucursal(id) {
    return await apiFetch(`/sucursales/${id}`, {
        method: 'DELETE',
    });
}
