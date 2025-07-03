const express = require('express');
const router = express.Router();
const objetivoController = require('../controllers/objetivoController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Objetivos
router.get('/', authMiddleware.verifyToken, objetivoController.getAllObjetivos);
router.get('/:id', authMiddleware.verifyToken, objetivoController.getObjetivoById);
router.post('/', authMiddleware.verifyToken, objetivoController.createObjetivo);
router.put('/:id', authMiddleware.verifyToken, objetivoController.updateObjetivo);
router.delete('/:id', authMiddleware.verifyToken, objetivoController.deleteObjetivo);

module.exports = router; 