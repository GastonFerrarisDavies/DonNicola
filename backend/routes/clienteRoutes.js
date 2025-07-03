const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Clientes
router.get('/', clienteController.getAllClientes);
router.get('/:id', clienteController.getClienteById);
router.post('/', authMiddleware.verifyToken, clienteController.createCliente);
router.put('/:id', authMiddleware.verifyToken, clienteController.updateCliente);
router.delete('/:id', authMiddleware.verifyToken, clienteController.deleteCliente);

module.exports = router; 