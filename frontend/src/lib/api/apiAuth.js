//frontend/src/lib/api/auth.js
import { jwtDecode } from 'jwt-decode';
import { apiFetch } from './apiUtils';

const AUTH_TOKEN_KEY = 'authToken';

// Guarda el token en localStorage
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

// Elimina el token de localStorage
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// Decodifica el token para obtener la información del usuario
export const getDecodedToken = () => {
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
};

export const login = async (email, password) => {
  try {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Guardar token en localStorage
    if (response.token) {
      setAuthToken(response.token);
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
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Guardar token en localStorage
    if (response.token) {
      setAuthToken(response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    throw new Error(error.message || 'Error al crear la cuenta');
  }
};

export const logout = () => {
  removeAuthToken();
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
  
  const decodedToken = getDecodedToken();
  if (decodedToken) {
    // Verificar si el token no ha expirado
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp > currentTime) {
      return true;
    } else {
      // Token expirado, limpiar localStorage
      removeAuthToken();
      localStorage.removeItem('userData');
      return false;
    }
  }
  return false;
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await apiFetch('/auth/forgot-password', {
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
    const response = await apiFetch('/auth/reset-password', {
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
    const userData = getCurrentUser();
    if (!userData || !userData.id) {
      throw new Error('Usuario no autenticado');
    }
    
    const response = await apiFetch(`/usuarios/${userData.id}`, {
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
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.id) {
      throw new Error('Usuario no autenticado');
    }
    
    const response = await apiFetch(`/usuarios/${currentUser.id}`, {
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
    await apiFetch('/auth/verify');
    return true;
  } catch (error) {
    // Si el token no es válido, limpiar localStorage
    logout();
    return false;
  }
};

export const verifyAdmin = async () => {
  try {
    const response = await apiFetch('/auth/verify-admin');
    return response.isAdmin;
  } catch (error) {
    return false;
  }
};

export const refreshToken = async () => {
  try {
    const response = await apiFetch('/auth/refresh', {
      method: 'POST',
    });

    if (response.token) {
      setAuthToken(response.token);
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
  verifyAdmin,
  refreshToken,
  useAuth,
};

