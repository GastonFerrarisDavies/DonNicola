// frontend/src/hooks/useAutoTokenRefresh.js
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { shouldRefreshToken, refreshToken } from '@/lib/api/apiAuth';
import { TOKEN_CONFIG } from '@/lib/config/tokenConfig';

export function useAutoTokenRefresh() {
  const { isAuthenticated, user } = useAuth();
  const refreshTimeoutRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  // Función para programar la próxima renovación del token
  const scheduleNextRefresh = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      // Verificar si el token necesita renovación
      if (shouldRefreshToken()) {
        console.log('Renovando token automáticamente...');
        await refreshToken();
      } else {
        // Calcular cuándo renovar el token (5 minutos antes de que expire)
        const token = localStorage.getItem(TOKEN_CONFIG.TOKEN_KEY);
        if (token) {
          try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const timeUntilExpiry = decodedToken.exp * 1000 - Date.now();
            const refreshTime = timeUntilExpiry - (TOKEN_CONFIG.REFRESH_THRESHOLD * 1000);

            if (refreshTime > 0) {
              // Programar renovación
              refreshTimeoutRef.current = setTimeout(async () => {
                try {
                  await refreshToken();
                  // Programar la siguiente renovación
                  scheduleNextRefresh();
                } catch (error) {
                  console.error('Error en renovación automática:', error);
                }
              }, refreshTime);
            }
          } catch (error) {
            console.error('Error al decodificar token para programar renovación:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error al programar renovación del token:', error);
    }
  }, [isAuthenticated, user]);

  // Función para limpiar todos los timeouts e intervalos
  const cleanup = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Programar la primera renovación
      scheduleNextRefresh();

      // Configurar un intervalo de verificación cada minuto como respaldo
      refreshIntervalRef.current = setInterval(() => {
        if (shouldRefreshToken()) {
          scheduleNextRefresh();
        }
      }, TOKEN_CONFIG.CHECK_INTERVAL);

      // Verificar cuando la página se vuelve visible
      const handleVisibilityChange = () => {
        if (!document.hidden && isAuthenticated) {
          scheduleNextRefresh();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        cleanup();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      cleanup();
    }
  }, [isAuthenticated, user, scheduleNextRefresh, cleanup]);

  // Retornar función para renovar manualmente si es necesario
  return {
    refreshNow: scheduleNextRefresh,
    cleanup
  };
}
