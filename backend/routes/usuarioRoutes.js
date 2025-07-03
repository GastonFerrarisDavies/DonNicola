const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Usuarios
router.get('/', authMiddleware.verifyToken, usuarioController.getAllUsuarios);
router.get('/:id', authMiddleware.verifyToken, usuarioController.getUsuarioById);
router.post('/', usuarioController.createUsuario);
router.put('/:id', authMiddleware.verifyToken, usuarioController.updateUsuario);
router.delete('/:id', authMiddleware.verifyToken, usuarioController.deleteUsuario);

module.exports = router; 