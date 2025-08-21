// frontend/src/components/UserActivityTracker.js
'use client';

import { useEffect, useRef } from 'react';
import { refreshTokenIfNeeded } from '@/lib/api/apiAuth';
import { TOKEN_CONFIG } from '@/lib/config/tokenConfig';

export default function UserActivityTracker() {
  const lastActivityRef = useRef(Date.now());
  const activityTimeoutRef = useRef(null);

  useEffect(() => {
    // Eventos que indican actividad del usuario
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus',
      'visibilitychange'
    ];

    const handleUserActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      
      // Limpiar timeout anterior
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      
      // Verificar si el token necesita renovación después de la actividad
      activityTimeoutRef.current = setTimeout(async () => {
        try {
          await refreshTokenIfNeeded();
        } catch (error) {
          console.error('Error al renovar token después de actividad:', error);
        }
      }, TOKEN_CONFIG.ACTIVITY_DELAY);
    };

    // Agregar listeners para todos los eventos de actividad
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Verificar actividad cada 5 minutos
    const activityCheckInterval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      // Si ha habido actividad reciente, verificar si el token necesita renovación
      if (timeSinceLastActivity < TOKEN_CONFIG.ACTIVITY_CHECK_INTERVAL) {
        refreshTokenIfNeeded();
      }
    }, TOKEN_CONFIG.ACTIVITY_CHECK_INTERVAL);

    // Cleanup function
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      
      clearInterval(activityCheckInterval);
    };
  }, []);

  // Este componente no renderiza nada visible
  return null;
}
