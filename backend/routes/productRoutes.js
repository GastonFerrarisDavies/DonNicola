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
router.get('/:id', authMiddleware.verifyToken, productController.getProductById);

router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, productController.createProduct);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, productController.deleteProduct);

module.exports = router;