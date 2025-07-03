const db = require('../models');

exports.getAllVentas = async (req, res) => {
    try {
        const ventas = await db.Venta.findAll({
            include: [
                { model: db.Cliente, as: 'Cliente' },
                { model: db.VentaDetalle, as: 'DetalleVenta' }
            ]
        });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener las ventas', error: error.message});
    }
};

exports.getVentaById = async (req, res) => {
    try {
        const venta = await db.Venta.findByPk(req.params.id, {
            include: [
                { model: db.Cliente, as: 'Cliente' },
                { model: db.VentaDetalle, as: 'DetalleVenta' }
            ]
        });
        if (!venta) {
            return res.status(404).json({message: 'Venta no encontrada'});
        }
        res.json(venta);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener la venta', error: error.message});
    }
};

exports.createVenta = async (req, res) => {
    try {
        const venta = await db.Venta.create(req.body);
        res.status(201).json(venta);
    } catch (error) {
        res.status(500).json({message: 'Error al crear la venta', error: error.message});
    }
};

exports.updateVenta = async (req, res) => {
    try {
        const venta = await db.Venta.findByPk(req.params.id);
        if (!venta) {
            return res.status(404).json({message: 'Venta no encontrada'});
        }
        await venta.update(req.body);
        res.json(venta);
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar la venta', error: error.message});
    }
};

exports.deleteVenta = async (req, res) => {
    try {
        const venta = await db.Venta.findByPk(req.params.id);
        if (!venta) {
            return res.status(404).json({message: 'Venta no encontrada'});
        }
        await venta.destroy();
        res.json({message: 'Venta eliminada correctamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar la venta', error: error.message});
    }
}; 