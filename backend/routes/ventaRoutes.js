const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Ventas
// Lectura - Acceso para usuarios autenticados
router.get('/:id', authMiddleware.verifyToken, ventaController.getVentaById);

// Operaciones de escritura - Solo administradores
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, ventaController.getAllVentas);
router.post('/completa', authMiddleware.verifyToken, authMiddleware.isAdmin, ventaController.createVentaCompleta);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, ventaController.updateVenta);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, ventaController.deleteVenta);

module.exports = router;