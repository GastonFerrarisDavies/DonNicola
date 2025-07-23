const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

//Ruta de prueba simple
router.get('/test', (req, res) => {
    res.json({message: 'Ruta de productos funcionando correctamente'});
});

//Rutas de Productos
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware.verifyToken, productController.createProduct); // Temporalmente sin autenticación para pruebas
router.put('/:id', authMiddleware.verifyToken, productController.updateProduct); // Temporalmente sin autenticación para pruebas
router.delete('/:id', authMiddleware.verifyToken, productController.deleteProduct); // Temporalmente sin autenticación para pruebas

module.exports = router;