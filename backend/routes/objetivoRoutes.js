const express = require('express');
const router = express.Router();
const objetivoController = require('../controllers/objetivoController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Objetivos
// Lectura - Acceso para usuarios autenticados
router.get('/', authMiddleware.verifyToken, objetivoController.getAllObjetivos);
router.get('/:id', authMiddleware.verifyToken, objetivoController.getObjetivoById);

// Operaciones de escritura - Solo administradores
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, objetivoController.createObjetivo);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, objetivoController.updateObjetivo);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, objetivoController.deleteObjetivo);

module.exports = router; 