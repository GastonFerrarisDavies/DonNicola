const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Usuarios - Solo administradores
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, usuarioController.getAllUsuarios);
router.get('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, usuarioController.getUsuarioById);
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, usuarioController.createUsuario);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, usuarioController.updateUsuario);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, usuarioController.deleteUsuario);

module.exports = router; 