const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

//Ruta de prueba simple
router.get('/test', (req, res) => {
    res.json({message: 'Ruta de productos funcionando correctamente'});
});

//Rutas de Productos
// Lectura - Acceso para usuarios autenticados
router.get('/', authMiddleware.verifyToken, productController.getAllProducts);
router.get('/:id', authMiddleware.verifyToken, productController.getProductById);

// Operaciones de escritura - Solo administradores
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, productController.createProduct);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, productController.deleteProduct);

module.exports = router;