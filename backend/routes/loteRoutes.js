const express = require('express');
const router = express.Router();
const loteController = require('../controllers/loteController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Lotes
router.get('/', authMiddleware.verifyToken, loteController.getAllLotes);
router.get('/:id', authMiddleware.verifyToken, loteController.getLoteById);
router.post('/', authMiddleware.verifyToken, loteController.createLote);
router.put('/:id', authMiddleware.verifyToken, loteController.updateLote);
router.delete('/:id', authMiddleware.verifyToken, loteController.deleteLote);

module.exports = router; 