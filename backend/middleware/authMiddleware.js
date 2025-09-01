const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token de autenticación inválido o expirado.' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autenticado. Token requerido.' });
    }
    
    
    if (req.user.rol === 'admin' || req.user.rol === 'administrador') { // Acepta ambos valores
        next(); // Si es admin, pasa al siguiente
    } else {
        return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
};