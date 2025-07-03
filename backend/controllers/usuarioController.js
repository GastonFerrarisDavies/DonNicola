const db = require('../models');

exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await db.Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los usuarios', error: error.message});
    }
};

exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await db.Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el usuario', error: error.message});
    }
};

exports.createUsuario = async (req, res) => {
    try {
        const usuario = await db.Usuario.create(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({message: 'Error al crear el usuario', error: error.message});
    }
};

exports.updateUsuario = async (req, res) => {
    try {
        const usuario = await db.Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        await usuario.update(req.body);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar el usuario', error: error.message});
    }
};

exports.deleteUsuario = async (req, res) => {
    try {
        const usuario = await db.Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        await usuario.destroy();
        res.json({message: 'Usuario eliminado correctamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar el usuario', error: error.message});
    }
}; 