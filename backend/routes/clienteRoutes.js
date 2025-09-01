const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Clientes
// Lectura - Acceso para usuarios autenticados
router.get('/', authMiddleware.verifyToken, clienteController.getAllClientes);
router.get('/:id', authMiddleware.verifyToken, clienteController.getClienteById);

// Operaciones de escritura - Solo administradores
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, clienteController.createCliente);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, clienteController.updateCliente);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, clienteController.deleteCliente);

module.exports = router; 