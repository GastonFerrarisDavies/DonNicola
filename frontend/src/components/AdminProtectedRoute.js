'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { verifyAdmin } from '@/lib/api/apiAuth';

export default function AdminProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Si aún está cargando, no hacer nada
      if (loading) return;

      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Si no hay usuario, esperar un poco más
      if (!user) {
        return;
      }

      // Verificar con el backend si el usuario es admin
      try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
          router.push('/access-denied');
          return;
        }
      } catch (error) {
        console.error('Error verificando admin status:', error);
        router.push('/access-denied');
        return;
      }

      setIsVerifying(false);
    };

    checkAdminStatus();
  }, [user, isAuthenticated, loading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar el contenido
  if (!isAuthenticated) {
    return null;
  }

  // Si es admin, mostrar el contenido protegido
  return children;
}
