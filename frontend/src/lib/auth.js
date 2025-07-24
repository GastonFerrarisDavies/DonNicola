// frontend/src/lib/auth.js
import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalar 'jwt-decode' (npm install jwt-decode)

const AUTH_TOKEN_KEY = 'authToken';

// Guarda el token en localStorage
export function setAuthToken(token) {
  if (typeof window !== 'undefined') { // Asegura que se ejecuta en el navegador
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

// Obtiene el token de localStorage
export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
}

// Elimina el token de localStorage
export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

// Decodifica el token para obtener la información del usuario
export function getDecodedToken() {
  const token = getAuthToken();
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      removeAuthToken(); // Token inválido, lo eliminamos
      return null;
    }
  }
  return null;
}

// Verifica si el usuario está autenticado y si el token es válido/no ha expirado
export function isAuthenticated() {
  const decodedToken = getDecodedToken();
  if (decodedToken) {
    // Compara la fecha de expiración (exp) con la fecha actual
    const currentTime = Date.now() / 1000; // Convertir a segundos
    return decodedToken.exp > currentTime;
  }
  return false;
}