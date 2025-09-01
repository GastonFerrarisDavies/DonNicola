const express = require('express');
const router = express.Router();
const loteController = require('../controllers/loteController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Lotes
// Lectura - Acceso para usuarios autenticados
router.get('/', authMiddleware.verifyToken, loteController.getAllLotes);
router.get('/:id', authMiddleware.verifyToken, loteController.getLoteById);

// Operaciones de escritura - Solo administradores
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, loteController.createLote);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, loteController.updateLote);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, loteController.deleteLote);

module.exports = router; 