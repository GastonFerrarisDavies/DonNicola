// frontend/src/lib/api/apiLote.js

import { apiFetch } from './apiUtils';

export async function getAllLotes() {
    return apiFetch('/lotes');
}

export async function getLoteById(id) {
    return apiFetch(`/lotes/${id}`);
}

export async function createLote(loteData) {
    return apiFetch('/lotes', {
        method: 'POST',
        body: JSON.stringify(loteData),
    });
}

export async function createMultipleLotes(lotesData) {
    return apiFetch('/lotes/multiple', {
        method: 'POST',
        body: JSON.stringify(lotesData),
    });
}

export async function updateLote(id, loteData) {
    return apiFetch(`/lotes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(loteData),
    });
}

export async function deleteLote(id) {
    return apiFetch(`/lotes/${id}`, {
        method: 'DELETE',
    });
}
