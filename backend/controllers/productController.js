const db = require('../models');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await db.Producto.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los productos', error: error.message});
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await db.Producto.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({message: 'Producto no encontrado'});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el producto', error: error.message});
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await db.Producto.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({message: 'Error al crear el producto', error: error.message});
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const product = await db.Producto.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({message: 'Producto no encontrado'});
        }
        await product.update(req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar el producto', error: error.message});
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await db.Producto.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({message: 'Producto no encontrado'});
        }
        await product.destroy();
        res.json({message: 'Producto eliminado correctamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar el producto', error: error.message});
    }
}
