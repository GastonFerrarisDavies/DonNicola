// frontend/src/components/TokenRefreshNotification.js
'use client';

import { useState, useEffect } from 'react';

export default function TokenRefreshNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleTokenRefreshed = (event) => {
      setMessage('Sesión renovada automáticamente');
      setShowNotification(true);
      
      // Ocultar la notificación después de 3 segundos
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    };

    const handleTokenRefreshError = (event) => {
      setMessage('Error al renovar la sesión');
      setShowNotification(true);
      
      // Ocultar la notificación después de 5 segundos
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    };

    window.addEventListener('tokenRefreshed', handleTokenRefreshed);
    window.addEventListener('tokenRefreshError', handleTokenRefreshError);

    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
      window.removeEventListener('tokenRefreshError', handleTokenRefreshError);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}
