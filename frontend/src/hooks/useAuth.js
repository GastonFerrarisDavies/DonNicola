// frontend/src/hooks/useAuth.js
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated, getDecodedToken, login as loginUser, isAdminLocal } from '@/lib/api/apiAuth';

// Crear un contexto de autenticación
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Contiene la información del usuario decodificada del token
  const [loading, setLoading] = useState(true); // Indica si el estado de autenticación se está cargando

  const router = useRouter();

  useEffect(() => {
    // Al cargar la aplicación, intenta restaurar la sesión desde el token
    const token = getAuthToken();
    if (token && isAuthenticated()) {
      setUser(getDecodedToken());
    }
    setLoading(false); // La carga inicial ha terminado
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginUser(email, password);
      setUser(response.user); // Guarda la información del usuario
      
      // Usar setTimeout para asegurar que el estado se actualice antes de la redirección
      setTimeout(() => {
        router.push('/dashboard'); // Redirige al dashboard
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      removeAuthToken();
      setUser(null);
      
      // Re-lanzar el error con mensaje mejorado
      if (error.message) {
        throw error; // El error ya tiene un mensaje personalizado
      } else {
        throw new Error('Error inesperado al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/login'); // Redirige a la página de login
  };

  // El valor que se proveerá a los consumidores del contexto
  const authContextValue = {
    user,
    isAuthenticated: () => isAuthenticated(), // Usar la función importada
    isAdmin: () => isAdminLocal(), // Verificar si es admin localmente
    loading,
    login,
    logout,
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
