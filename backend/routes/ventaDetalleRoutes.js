const express = require('express');
const router = express.Router();
const ventaDetalleController = require('../controllers/ventaDetalleController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Detalles de Venta
router.get('/', authMiddleware.verifyToken, ventaDetalleController.getAllVentaDetalles);
router.get('/:id', authMiddleware.verifyToken, ventaDetalleController.getVentaDetalleById);
router.post('/', authMiddleware.verifyToken, ventaDetalleController.createVentaDetalle);
router.put('/:id', authMiddleware.verifyToken, ventaDetalleController.updateVentaDetalle);
router.delete('/:id', authMiddleware.verifyToken, ventaDetalleController.deleteVentaDetalle);

module.exports = router; 