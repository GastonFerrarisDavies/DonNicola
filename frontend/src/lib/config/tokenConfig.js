// frontend/src/lib/config/tokenConfig.js

export const TOKEN_CONFIG = {
  // Tiempo antes de la expiración para renovar el token (en segundos)
  REFRESH_THRESHOLD: 300, // 5 minutos
  
  // Intervalo de verificación del token (en milisegundos)
  CHECK_INTERVAL: 60000, // 1 minuto
  
  // Tiempo de espera después de actividad del usuario para renovar (en milisegundos)
  ACTIVITY_DELAY: 1000, // 1 segundo
  
  // Tiempo de verificación de actividad (en milisegundos)
  ACTIVITY_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutos
  
  // Tiempo de expiración del token en el backend (en segundos)
  BACKEND_EXPIRY: 24 * 60 * 60, // 24 horas
  
  // Headers de autorización
  AUTH_HEADER: 'Authorization',
  AUTH_PREFIX: 'Bearer ',
  
  // Claves de localStorage
  TOKEN_KEY: 'authToken',
  USER_DATA_KEY: 'userData',
  
  // Endpoints de autenticación
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    LOGOUT: '/auth/logout'
  }
};

// Función para obtener el tiempo restante del token en formato legible
export const getTokenTimeRemaining = (decodedToken) => {
  if (!decodedToken || !decodedToken.exp) return null;
  
  const currentTime = Date.now() / 1000;
  const timeRemaining = decodedToken.exp - currentTime;
  
  if (timeRemaining <= 0) return 'Expirado';
  
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  
  return `${seconds}s`;
};

// Función para verificar si el token está próximo a expirar
export const isTokenExpiringSoon = (decodedToken, threshold = TOKEN_CONFIG.REFRESH_THRESHOLD) => {
  if (!decodedToken || !decodedToken.exp) return false;
  
  const currentTime = Date.now() / 1000;
  const timeUntilExpiry = decodedToken.exp - currentTime;
  
  return timeUntilExpiry <= threshold;
};
