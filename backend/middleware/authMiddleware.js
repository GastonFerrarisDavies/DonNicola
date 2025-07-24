const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
    }
    try {
        // Verifica el token usando la clave secreta del entorno
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adjunta la información decodificada del usuario a la solicitud
        next(); // Pasa al siguiente middleware o controlador
    } catch (error) {
        // Si el token es inválido o ha expirado
        return res.status(401).json({ message: 'Token de autenticación inválido o expirado.' });
    }
};

exports.isAdmin = (req, res, next) => {
    // Primero, asegúrate de que req.user exista (es decir, verifyToken ya se ejecutó)
    if (!req.user) {
        return res.status(401).json({ message: 'No autenticado. Token requerido.' });
    }
    // Verifica si el rol del usuario es 'administrador'
    if (req.user.rol === 'administrador') { // Asegúrate de que el campo sea 'rol' y el valor 'administrador'
        next(); // Si es admin, pasa al siguiente
    } else {
        // Si no es admin, devuelve 403 Forbidden
        return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
};