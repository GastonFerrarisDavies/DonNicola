const db = require('../models'); // Importa tus modelos
const jwt = require('jsonwebtoken'); // Para generar JWTs
const bcrypt = require('bcryptjs'); // Para comparar contraseñas

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar el usuario por email
        const user = await db.Usuario.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // 2. Comparar la contraseña proporcionada con la hasheada en la DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // 3. Generar un JSON Web Token (JWT)
        // El payload del token debe contener información que identifique al usuario (ej. id, email, rol)
        const payload = {
            id: user.id,
            email: user.email,
            rol: user.rol // Incluye el rol para autorización en el frontend/middleware
        };

        // Firma el token con tu secreto y una fecha de expiración
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora

        // 4. Enviar el token y la información del usuario (sin la contraseña)
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
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.', error: error.message });
    }
};

// Puedes añadir una función de registro (register) aquí también si lo deseas
exports.register = async (req, res) => {
    const { email, password, rol } = req.body; // Asegúrate de que 'rol' se envía o se asigna por defecto

    try {
        // Validación básica
        if (!email || !password || !rol) {
            return res.status(400).json({ message: 'Email, contraseña y rol son obligatorios.' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await db.Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        // Crear el nuevo usuario (el hook beforeCreate se encargará del hasheo)
        const newUser = await db.Usuario.create({ email, password, rol });

        // Opcional: Generar un token de inmediato para el nuevo usuario
        const payload = { id: newUser.id, email: newUser.email, rol: newUser.rol };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

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