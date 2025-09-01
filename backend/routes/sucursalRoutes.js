const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Sucursales
// Lectura - Acceso para usuarios autenticados
router.get('/', authMiddleware.verifyToken, sucursalController.getAllSucursales);
router.get('/:id', authMiddleware.verifyToken, sucursalController.getSucursalById);

// Operaciones de escritura - Solo administradores
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, sucursalController.createSucursal);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, sucursalController.updateSucursal);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, sucursalController.deleteSucursal);

module.exports = router; 