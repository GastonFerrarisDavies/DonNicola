const db = require('../models');

exports.getAllClientes = async (req, res) => {
    try {
        const clientes = await db.Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los clientes', error: error.message});
    }
};

exports.getClienteById = async (req, res) => {
    try {
        const cliente = await db.Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el cliente', error: error.message});
    }
};

exports.createCliente = async (req, res) => {
    try {
        const cliente = await db.Cliente.create(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({message: 'Error al crear el cliente', error: error.message});
    }
};

exports.updateCliente = async (req, res) => {
    try {
        const cliente = await db.Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        await cliente.update(req.body);
        res.json(cliente);
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar el cliente', error: error.message});
    }
};

exports.deleteCliente = async (req, res) => {
    try {
        const cliente = await db.Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        await cliente.destroy();
        res.json({message: 'Cliente eliminado correctamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar el cliente', error: error.message});
    }
}; 