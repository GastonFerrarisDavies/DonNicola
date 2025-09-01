const express = require('express');
const router = express.Router();
const ventaDetalleController = require('../controllers/ventaDetalleController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Detalles de Venta
// Lectura - Acceso para usuarios autenticados
router.get('/', authMiddleware.verifyToken, ventaDetalleController.getAllVentaDetalles);
router.get('/:id', authMiddleware.verifyToken, ventaDetalleController.getVentaDetalleById);

// Operaciones de escritura - Solo administradores
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, ventaDetalleController.createVentaDetalle);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, ventaDetalleController.updateVentaDetalle);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, ventaDetalleController.deleteVentaDetalle);

module.exports = router; 