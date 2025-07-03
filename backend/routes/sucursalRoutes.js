const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Sucursales
router.get('/', sucursalController.getAllSucursales);
router.get('/:id', sucursalController.getSucursalById);
router.post('/', authMiddleware.verifyToken, sucursalController.createSucursal);
router.put('/:id', authMiddleware.verifyToken, sucursalController.updateSucursal);
router.delete('/:id', authMiddleware.verifyToken, sucursalController.deleteSucursal);

module.exports = router; 