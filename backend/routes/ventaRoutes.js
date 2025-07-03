const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Ventas
router.get('/', authMiddleware.verifyToken, ventaController.getAllVentas);
router.get('/:id', authMiddleware.verifyToken, ventaController.getVentaById);
router.post('/', authMiddleware.verifyToken, ventaController.createVenta);
router.put('/:id', authMiddleware.verifyToken, ventaController.updateVenta);
router.delete('/:id', authMiddleware.verifyToken, ventaController.deleteVenta);

module.exports = router; 