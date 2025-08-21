// frontend/src/hooks/useAuth.js
'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuthToken, 
  setAuthToken, 
  removeAuthToken, 
  isAuthenticated, 
  getDecodedToken,
  setupAutoTokenRefresh,
  refreshTokenIfNeeded,
  refreshToken
} from '@/lib/api/apiAuth';
import { login } from '@/lib/api/apiAuth';

// Crear un contexto de autenticación
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Contiene la información del usuario decodificada del token
  const [loading, setLoading] = useState(true); // Indica si el estado de autenticación se está cargando
  const [token, setTokenState] = useState(null); // Estado del token

  const router = useRouter();

  // Función para actualizar el token y el usuario
  const updateAuthState = useCallback((newToken, userData) => {
    if (newToken) {
      setTokenState(newToken);
      setAuthToken(newToken);
      if (userData) {
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    }
  }, []);

  // Función para renovar el token manualmente
  const refreshAuthToken = useCallback(async () => {
    try {
      const response = await refreshToken();
      if (response.token) {
        updateAuthState(response.token, response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al renovar token manualmente:', error);
      return false;
    }
  }, [updateAuthState]);

  useEffect(() => {
    // Al cargar la aplicación, intenta restaurar la sesión desde el token
    const token = getAuthToken();
    if (token && isAuthenticated()) {
      const userData = getDecodedToken();
      setTokenState(token);
      setUser(userData);
      
      // Configurar la renovación automática del token
      const cleanupAutoRefresh = setupAutoTokenRefresh();
      
      // Verificar si el token necesita renovación inmediatamente
      refreshTokenIfNeeded();
      
      // Cleanup function para limpiar los listeners cuando el componente se desmonte
      return cleanupAutoRefresh;
    }
    setLoading(false); // La carga inicial ha terminado
  }, []);

  // Escuchar eventos de renovación de token
  useEffect(() => {
    const handleTokenRefreshed = (event) => {
      const { token: newToken, user: userData } = event.detail;
      updateAuthState(newToken, userData);
    };

    window.addEventListener('tokenRefreshed', handleTokenRefreshed);
    
    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
    };
  }, [updateAuthState]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { token, user: userData } = await loginUser(email, password);
      updateAuthState(token, userData);
      router.push('/dashboard'); // Redirige al dashboard
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      removeAuthToken();
      setUser(null);
      setTokenState(null);
      throw error; // Re-lanza el error para que el componente de login lo maneje
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setTokenState(null);
    router.push('/login'); // Redirige a la página de login
  };

  // El valor que se proveerá a los consumidores del contexto
  const authContextValue = {
    user,
    token,
    isAuthenticated: isAuthenticated(), // Calcula el estado de autenticación
    loading,
    login,
    logout,
    refreshToken: refreshAuthToken, // Función para renovar manualmente
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
