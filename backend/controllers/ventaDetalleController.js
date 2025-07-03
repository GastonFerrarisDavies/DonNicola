const db = require('../models');

exports.getAllVentaDetalles = async (req, res) => {
    try {
        const ventaDetalles = await db.VentaDetalle.findAll({
            include: [
                { model: db.Venta, as: 'Venta' },
                { model: db.Producto, as: 'Producto' }
            ]
        });
        res.json(ventaDetalles);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los detalles de venta', error: error.message});
    }
};

exports.getVentaDetalleById = async (req, res) => {
    try {
        const ventaDetalle = await db.VentaDetalle.findByPk(req.params.id, {
            include: [
                { model: db.Venta, as: 'Venta' },
                { model: db.Producto, as: 'Producto' }
            ]
        });
        if (!ventaDetalle) {
            return res.status(404).json({message: 'Detalle de venta no encontrado'});
        }
        res.json(ventaDetalle);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el detalle de venta', error: error.message});
    }
};

exports.createVentaDetalle = async (req, res) => {
    try {
        const ventaDetalle = await db.VentaDetalle.create(req.body);
        res.status(201).json(ventaDetalle);
    } catch (error) {
        res.status(500).json({message: 'Error al crear el detalle de venta', error: error.message});
    }
};

exports.updateVentaDetalle = async (req, res) => {
    try {
        const ventaDetalle = await db.VentaDetalle.findByPk(req.params.id);
        if (!ventaDetalle) {
            return res.status(404).json({message: 'Detalle de venta no encontrado'});
        }
        await ventaDetalle.update(req.body);
        res.json(ventaDetalle);
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar el detalle de venta', error: error.message});
    }
};

exports.deleteVentaDetalle = async (req, res) => {
    try {
        const ventaDetalle = await db.VentaDetalle.findByPk(req.params.id);
        if (!ventaDetalle) {
            return res.status(404).json({message: 'Detalle de venta no encontrado'});
        }
        await ventaDetalle.destroy();
        res.json({message: 'Detalle de venta eliminado correctamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar el detalle de venta', error: error.message});
    }
}; 