//frontend/src/lib/api/auth.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Realiza una petición fetch genérica a la API.
 * @param {string} endpoint - La ruta específica de la API (ej. '/auth/login').
 * @param {object} options - Opciones para la petición fetch (method, headers, body, etc.).
 * @returns {Promise<any>} - La respuesta parseada como JSON.
 * @throws {Error} - Si la respuesta no es exitosa.
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Agregar token de autorización si existe
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
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
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en petición API:', error);
    throw error;
  }
};

/**
 * Inicia sesión de un usuario.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<object>} - Datos del usuario y token de acceso.
 */
export const login = async (email, password) => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Guardar token en localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    throw new Error(error.message || 'Error al iniciar sesión');
  }
};

/**
 * Registra un nuevo usuario.
 * @param {object} userData - Datos del usuario a registrar.
 * @param {string} userData.nombre - Nombre del usuario.
 * @param {string} userData.apellido - Apellido del usuario.
 * @param {string} userData.email - Email del usuario.
 * @param {string} userData.password - Contraseña del usuario.
 * @returns {Promise<object>} - Datos del usuario creado y token de acceso.
 */
export const register = async (userData) => {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Guardar token en localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    throw new Error(error.message || 'Error al crear la cuenta');
  }
};

/**
 * Cierra la sesión del usuario actual.
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  // Redirigir al login
  window.location.href = '/login';
};

/**
 * Verifica si el usuario está autenticado.
 * @returns {boolean} - True si el usuario está autenticado.
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * Obtiene los datos del usuario actual.
 * @returns {object|null} - Datos del usuario o null si no está autenticado.
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Obtiene el token de autenticación actual.
 * @returns {string|null} - Token de autenticación o null si no existe.
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Solicita el restablecimiento de contraseña.
 * @param {string} email - Email del usuario.
 * @returns {Promise<object>} - Respuesta del servidor.
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response;
  } catch (error) {
    throw new Error(error.message || 'Error al solicitar restablecimiento de contraseña');
  }
};

/**
 * Restablece la contraseña con un token.
 * @param {string} token - Token de restablecimiento.
 * @param {string} newPassword - Nueva contraseña.
 * @returns {Promise<object>} - Respuesta del servidor.
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });

    return response;
  } catch (error) {
    throw new Error(error.message || 'Error al restablecer la contraseña');
  }
};

/**
 * Cambia la contraseña del usuario autenticado.
 * @param {string} currentPassword - Contraseña actual.
 * @param {string} newPassword - Nueva contraseña.
 * @returns {Promise<object>} - Respuesta del servidor.
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return response;
  } catch (error) {
    throw new Error(error.message || 'Error al cambiar la contraseña');
  }
};

/**
 * Actualiza el perfil del usuario.
 * @param {object} userData - Datos del usuario a actualizar.
 * @returns {Promise<object>} - Datos del usuario actualizados.
 */
export const updateProfile = async (userData) => {
  try {
    const response = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    // Actualizar datos del usuario en localStorage
    if (response.user) {
      localStorage.setItem('userData', JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    throw new Error(error.message || 'Error al actualizar el perfil');
  }
};

/**
 * Verifica si el token actual es válido.
 * @returns {Promise<boolean>} - True si el token es válido.
 */
export const verifyToken = async () => {
  try {
    await apiRequest('/auth/verify');
    return true;
  } catch (error) {
    // Si el token no es válido, limpiar localStorage
    logout();
    return false;
  }
};

/**
 * Refresca el token de autenticación.
 * @returns {Promise<object>} - Nuevo token de acceso.
 */
export const refreshToken = async () => {
  try {
    const response = await apiRequest('/auth/refresh', {
      method: 'POST',
    });

    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }

    return response;
  } catch (error) {
    throw new Error(error.message || 'Error al refrescar el token');
  }
};

/**
 * Hook personalizado para manejar la autenticación.
 * @returns {object} - Funciones y estado de autenticación.
 */
export const useAuth = () => {
  const loginUser = async (email, password) => {
    try {
      const response = await login(email, password);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await register(userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const changeUserPassword = async (currentPassword, newPassword) => {
    try {
      const response = await changePassword(currentPassword, newPassword);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    login: loginUser,
    register: registerUser,
    logout,
    changePassword: changeUserPassword,
    isAuthenticated,
    getCurrentUser,
    getAuthToken,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    verifyToken,
    refreshToken,
  };
};

export default {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  getAuthToken,
  requestPasswordReset,
  resetPassword,
  changePassword,
  updateProfile,
  verifyToken,
  refreshToken,
  useAuth,
};

