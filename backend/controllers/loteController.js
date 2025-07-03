const db = require('../models');

exports.getAllLotes = async (req, res) => {
    try {
        const lotes = await db.Lote.findAll({
            include: [
                { model: db.Sucursal, as: 'Sucursal' },
                { model: db.Producto, as: 'Producto' }
            ]
        });
        res.json(lotes);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los lotes', error: error.message});
    }
};

exports.getLoteById = async (req, res) => {
    try {
        const lote = await db.Lote.findByPk(req.params.id, {
            include: [
                { model: db.Sucursal, as: 'Sucursal' },
                { model: db.Producto, as: 'Producto' }
            ]
        });
        if (!lote) {
            return res.status(404).json({message: 'Lote no encontrado'});
        }
        res.json(lote);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el lote', error: error.message});
    }
};

exports.createLote = async (req, res) => {
    try {
        const lote = await db.Lote.create(req.body);
        res.status(201).json(lote);
    } catch (error) {
        res.status(500).json({message: 'Error al crear el lote', error: error.message});
    }
};

exports.updateLote = async (req, res) => {
    try {
        const lote = await db.Lote.findByPk(req.params.id);
        if (!lote) {
            return res.status(404).json({message: 'Lote no encontrado'});
        }
        await lote.update(req.body);
        res.json(lote);
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar el lote', error: error.message});
    }
};

exports.deleteLote = async (req, res) => {
    try {
        const lote = await db.Lote.findByPk(req.params.id);
        if (!lote) {
            return res.status(404).json({message: 'Lote no encontrado'});
        }
        await lote.destroy();
        res.json({message: 'Lote eliminado correctamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar el lote', error: error.message});
    }
}; 