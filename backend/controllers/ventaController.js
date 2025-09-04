const db = require('../models');

exports.getAllVentas = async (req, res) => {
    try {
        const ventas = await db.Venta.findAll({
            include: [
                { 
                    model: db.Cliente, 
                    as: 'Cliente',
                    attributes: ['id', 'nombre', 'localidad']
                },
                { 
                    model: db.Sucursal, 
                    as: 'Sucursal',
                    attributes: ['id', 'nombre', 'direccion']
                },
                { 
                    model: db.VentaDetalle, 
                    as: 'VentaDetalle',
                    include: [
                        {
                            model: db.Producto,
                            as: 'Producto',
                            attributes: ['id', 'nombre', 'descripcion', 'precio']
                        }
                    ]
                }
            ],
            order: [['fecha', 'DESC']]
        });
        res.json(ventas);
    } catch (error) {
        console.error('Error en getAllVentas:', error);
        res.status(500).json({message: 'Error al obtener las ventas', error: error.message});
    }
};

exports.getVentaById = async (req, res) => {
    try {
        const venta = await db.Venta.findByPk(req.params.id, {
            include: [
                { 
                    model: db.Cliente, 
                    as: 'Cliente',
                    attributes: ['id', 'nombre', 'localidad']
                },
                { 
                    model: db.Sucursal, 
                    as: 'Sucursal',
                    attributes: ['id', 'nombre', 'direccion']
                },
                { 
                    model: db.VentaDetalle, 
                    as: 'VentaDetalle',
                    include: [
                        {
                            model: db.Producto,
                            as: 'Producto',
                            attributes: ['id', 'nombre', 'descripcion', 'precio']
                        }
                    ]
                }
            ]
        });
        if (!venta) {
            return res.status(404).json({message: 'Venta no encontrada'});
        }
        res.json(venta);
    } catch (error) {
        console.error('Error en getVentaById:', error);
        res.status(500).json({message: 'Error al obtener la venta', error: error.message});
    }
};

exports.createVentaCompleta = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
        const { 
            clienteId, 
            sucursalId, 
            fecha, 
            productos, 
            total 
        } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!clienteId || !sucursalId || !fecha || !productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ 
                message: 'Todos los campos son requeridos y productos debe ser un array no vacío' 
            });
        }

        // Crear la venta principal
        const venta = await db.Venta.create({
            clienteId,
            sucursalId,
            fecha: new Date(fecha),
            total
        }, { transaction });

        // Crear los detalles de venta y actualizar stock
        for (const producto of productos) {
            const { loteId, productoId, cantidad, precioUnitario, subtotal } = producto;

            // Verificar que el lote tenga suficiente stock
            const lote = await db.Lote.findByPk(loteId, { transaction });
            if (!lote) {
                await transaction.rollback();
                return res.status(404).json({ 
                    message: `Lote ${loteId} no encontrado` 
                });
            }

            if (lote.cantidad < cantidad) {
                await transaction.rollback();
                return res.status(400).json({ 
                    message: `Stock insuficiente en lote ${loteId}. Disponible: ${lote.cantidad}, Solicitado: ${cantidad}` 
                });
            }

            // Verificar que el lote pertenezca a la sucursal seleccionada
            if (lote.sucursalId !== parseInt(sucursalId)) {
                await transaction.rollback();
                return res.status(400).json({ 
                    message: `El lote ${loteId} no pertenece a la sucursal seleccionada` 
                });
            }

            // Crear el detalle de venta
            await db.VentaDetalle.create({
                ventaId: venta.id,
                productoId,
                cantidad,
                subtotal
            }, { transaction });

            // Actualizar el stock del lote
            await lote.update({
                cantidad: lote.cantidad - cantidad
            }, { transaction });
        }

        await transaction.commit();

        // Obtener la venta completa con detalles para la respuesta
        const ventaCompleta = await db.Venta.findByPk(venta.id, {
            include: [
                { 
                    model: db.Cliente, 
                    as: 'Cliente',
                    attributes: ['id', 'nombre', 'localidad']
                },
                { 
                    model: db.Sucursal, 
                    as: 'Sucursal',
                    attributes: ['id', 'nombre', 'direccion']
                },
                { 
                    model: db.VentaDetalle, 
                    as: 'VentaDetalle',
                    include: [
                        {
                            model: db.Producto,
                            as: 'Producto',
                            attributes: ['id', 'nombre', 'descripcion', 'precio']
                        }
                    ]
                }
            ]
        });

        res.status(201).json({
            message: 'Venta creada exitosamente',
            venta: ventaCompleta
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error en createVentaCompleta:', error);
        res.status(500).json({
            message: 'Error al crear la venta completa', 
            error: error.message
        });
    }
};

exports.updateVenta = async (req, res) => {
    try {
        const venta = await db.Venta.findByPk(req.params.id);
        if (!venta) {
            return res.status(404).json({message: 'Venta no encontrada'});
        }
        
        const { clienteId, sucursalId, fecha, total } = req.body;
        await venta.update({
            clienteId,
            sucursalId,
            fecha: new Date(fecha),
            total
        });
        
        res.json({message: 'Venta actualizada correctamente', venta});
    } catch (error) {
        console.error('Error en updateVenta:', error);
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