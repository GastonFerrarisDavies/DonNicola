const db = require('../models');

exports.getAllSucursales = async (req, res) => {
    try {
        const sucursales = await db.Sucursal.findAll();
        res.json(sucursales);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener las sucursales', error: error.message});
    }
};

exports.getSucursalById = async (req, res) => {
    try {
        const sucursal = await db.Sucursal.findByPk(req.params.id);
        if (!sucursal) {
            return res.status(404).json({message: 'Sucursal no encontrada'});
        }
        res.json(sucursal);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener la sucursal', error: error.message});
    }
};

exports.createSucursal = async (req, res) => {
    try {
        const sucursal = await db.Sucursal.create(req.body);
        res.status(201).json(sucursal);
    } catch (error) {
        res.status(500).json({message: 'Error al crear la sucursal', error: error.message});
    }
};

exports.updateSucursal = async (req, res) => {
    try {
        const sucursal = await db.Sucursal.findByPk(req.params.id);
        if (!sucursal) {
            return res.status(404).json({message: 'Sucursal no encontrada'});
        }
        await sucursal.update(req.body);
        res.json(sucursal);
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar la sucursal', error: error.message});
    }
};

exports.deleteSucursal = async (req, res) => {
    try {
        const sucursal = await db.Sucursal.findByPk(req.params.id);
        if (!sucursal) {
            return res.status(404).json({message: 'Sucursal no encontrada'});
        }
        await sucursal.destroy();
        res.json({message: 'Sucursal eliminada correctamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar la sucursal', error: error.message});
    }
}; 