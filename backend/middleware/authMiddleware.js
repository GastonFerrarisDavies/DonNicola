const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

exports.verifyToken = (req, res, next) => {
    console.log('🔐 Middleware verifyToken ejecutándose...');
    console.log('📋 Headers recibidos:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('🎫 Token extraído:', token ? token.substring(0, 20) + '...' : 'NO ENCONTRADO');
    
    if (!token) {
        console.log('❌ No se proporcionó token de autenticación');
        return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
    }
    
    try {
        console.log('🔑 JWT_SECRET configurado:', JWT_SECRET ? 'SÍ' : 'NO');
        console.log('🔍 Intentando verificar token...');
        
        // Verifica el token usando la clave secreta con fallback
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ Token verificado exitosamente:', decoded);
        
        req.user = decoded; // Adjunta la información decodificada del usuario a la solicitud
        next(); // Pasa al siguiente middleware o controlador
    } catch (error) {
        console.log('❌ Error al verificar token:', error.message);
        // Si el token es inválido o ha expirado
        return res.status(401).json({ message: 'Token de autenticación inválido o expirado.' });
    }
};

exports.isAdmin = (req, res, next) => {
    console.log('👑 Middleware isAdmin ejecutándose...');
    console.log('👤 Usuario en req.user:', req.user);
    
    // Primero, asegúrate de que req.user exista (es decir, verifyToken ya se ejecutó)
    if (!req.user) {
        console.log('❌ No hay usuario autenticado');
        return res.status(401).json({ message: 'No autenticado. Token requerido.' });
    }
    
    console.log('🔍 Rol del usuario:', req.user.rol);
    
    // Verifica si el rol del usuario es 'admin' o 'administrador'
    if (req.user.rol === 'admin' || req.user.rol === 'administrador') { // Acepta ambos valores
        console.log('✅ Usuario es administrador, acceso permitido');
        next(); // Si es admin, pasa al siguiente
    } else {
        console.log('❌ Usuario no es administrador, acceso denegado');
        // Si no es admin, devuelve 403 Forbidden
        return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
};