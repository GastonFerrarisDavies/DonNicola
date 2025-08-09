//frontend/src/lib/api/auth.js
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

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
      
      // Disparar evento personalizado para notificar cambios de autenticación
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('authChange', { 
          detail: { isAuthenticated: true, user: response.user } 
        }));
      }
    }

    return response;
  } catch (error) {
    throw new Error(error.message || 'Error al iniciar sesión');
  }
};

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

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  
  // Disparar evento personalizado para notificar cambios de autenticación
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('authChange', { 
      detail: { isAuthenticated: false, user: null } 
    }));
  }
  
  // Redirigir al login
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false; // SSR safety
  
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    // Verificar si el token es válido y no ha expirado
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Verificar si el token no ha expirado
    if (decodedToken.exp && decodedToken.exp > currentTime) {
      return true;
    } else {
      // Token expirado, limpiar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      return false;
    }
  } catch (error) {
    // Token inválido, limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    return false;
  }
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

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

