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

exports.createVenta = async (req, res) => {
    const { clienteId, sucursalId, ventaDetalle } = req.body;

    // Iniciar una transacción de Sequelize
    const t = await db.sequelize.transaction();

    try {
        // 1. Calcular el total de la venta
        let totalVenta = 0;
        // Mapear los detalles para calcular el subtotal y el total de la venta
        const detallesConSubtotal = ventaDetalle.map(detalle => {
            const subtotal = detalle.cantidad * detalle.precioUnitario;
            totalVenta += subtotal;
            return {
                ...detalle,
                subtotal,
            };
        });

        // 2. Persistir la venta
        const nuevaVenta = await db.Venta.create({
            clienteId,
            sucursalId,
            fecha: new Date(),
            total: totalVenta
        }, { transaction: t });

        // 3. Preparar los datos para VentaDetalle con el ID de la venta
        const detallesParaCrear = detallesConSubtotal.map(detalle => ({
            ...detalle,
            ventaId: nuevaVenta.id, // Asignar el ID de la venta creada
        }));

        // 4. Persistir los detalles de la venta
        await db.VentaDetalle.bulkCreate(detallesParaCrear, { transaction: t });

        // 5. Actualizar el stock de cada producto en su respectivo lote
        for (const detalle of detallesConSubtotal) {
            await db.Lote.decrement('cantidad', {
                by: detalle.cantidad,
                where: { id: detalle.loteId },
                transaction: t
            });
        }

        // Si todo va bien, confirmar la transacción
        await t.commit();

        res.status(201).json({
            message: 'Venta registrada y stock actualizado exitosamente',
            venta: nuevaVenta
        });

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: 'Error al crear la venta completa', 
            error: error.message
        });
        // Si hay un error en cualquier paso, revertir la transacción
        await t.rollback();
        console.error('Error al registrar la venta:', error);
        res.status(500).json({
            message: 'Error interno del servidor al registrar la venta.',
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