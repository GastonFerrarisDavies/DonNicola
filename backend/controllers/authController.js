const db = require('../models'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/jwt'); 

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validar que se proporcionen email y password
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'El correo electrónico y la contraseña son requeridos.' 
            });
        }

        const user = await db.Usuario.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ 
                message: 'Credenciales inválidas.' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Credenciales inválidas.' 
            });
        }

        const payload = {
            id: user.id,
            email: user.email,
            rol: user.rol 
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30m' }); 

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                email: user.email,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor al iniciar sesión. Por favor, intenta nuevamente más tarde.', 
            error: error.message 
        });
    }
};

exports.register = async (req, res) => {
    const { email, password, rol } = req.body; 

    try {
        if (!email || !password || !rol) {
            return res.status(400).json({ message: 'Email, contraseña y rol son obligatorios.' });
        }

        const existingUser = await db.Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        const newUser = await db.Usuario.create({ email, password, rol });

        const payload = { id: newUser.id, email: newUser.email, rol: newUser.rol };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: { id: newUser.id, email: newUser.email, rol: newUser.rol }
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
        }
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await db.Usuario.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios.', error: error.message });
    }
};