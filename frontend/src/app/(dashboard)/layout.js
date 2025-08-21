// frontend/src/app/(dashboard)/layout.js
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAutoTokenRefresh } from '@/hooks/useAutoTokenRefresh';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  // Activar la renovación automática del token
  useAutoTokenRefresh();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Se redirigirá automáticamente
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
