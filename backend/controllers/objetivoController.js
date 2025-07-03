const db = require('../models');

exports.getAllObjetivos = async (req, res) => {
    try {
        const objetivos = await db.Objetivo.findAll({
            include: [
                { model: db.Usuario, as: 'Usuario' }
            ]
        });
        res.json(objetivos);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los objetivos', error: error.message});
    }
};

exports.getObjetivoById = async (req, res) => {
    try {
        const objetivo = await db.Objetivo.findByPk(req.params.id, {
            include: [
                { model: db.Usuario, as: 'Usuario' }
            ]
        });
        if (!objetivo) {
            return res.status(404).json({message: 'Objetivo no encontrado'});
        }
        res.json(objetivo);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el objetivo', error: error.message});
    }
};

exports.createObjetivo = async (req, res) => {
    try {
        const objetivo = await db.Objetivo.create(req.body);
        res.status(201).json(objetivo);
    } catch (error) {
        res.status(500).json({message: 'Error al crear el objetivo', error: error.message});
    }
};

exports.updateObjetivo = async (req, res) => {
    try {
        const objetivo = await db.Objetivo.findByPk(req.params.id);
        if (!objetivo) {
            return res.status(404).json({message: 'Objetivo no encontrado'});
        }
        await objetivo.update(req.body);
        res.json(objetivo);
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar el objetivo', error: error.message});
    }
};

exports.deleteObjetivo = async (req, res) => {
    try {
        const objetivo = await db.Objetivo.findByPk(req.params.id);
        if (!objetivo) {
            return res.status(404).json({message: 'Objetivo no encontrado'});
        }
        await objetivo.destroy();
        res.json({message: 'Objetivo eliminado correctamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar el objetivo', error: error.message});
    }
}; 