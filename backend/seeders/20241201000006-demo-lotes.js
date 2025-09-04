'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener IDs de productos por nombre
    const [productos] = await queryInterface.sequelize.query(`
      SELECT id, nombre FROM Productos WHERE nombre IN ('Muzzarella', 'Jamón');
    `);

    const productoPorNombre = Object.fromEntries(productos.map(p => [p.nombre, p.id]));

    // Obtener IDs de sucursales por nombre
    const [sucursales] = await queryInterface.sequelize.query(`
      SELECT id, nombre FROM Sucursales WHERE nombre IN ('Sucursal Centro', 'Sucursal Norte');
    `);

    const sucursalPorNombre = Object.fromEntries(sucursales.map(s => [s.nombre, s.id]));

    const ahora = new Date();
    const enSeisMeses = new Date();
    enSeisMeses.setMonth(enSeisMeses.getMonth() + 6);

    const registros = [
      // Sucursal Centro
      {
        cantidad: 10,
        fechaProduccion: ahora,
        fechaCaducidad: enSeisMeses,
        sucursalId: sucursalPorNombre['Sucursal Centro'],
        productoId: productoPorNombre['Muzzarella'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cantidad: 20,
        fechaProduccion: ahora,
        fechaCaducidad: enSeisMeses,
        sucursalId: sucursalPorNombre['Sucursal Centro'],
        productoId: productoPorNombre['Jamón'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Sucursal Norte
      {
        cantidad: 10,
        fechaProduccion: ahora,
        fechaCaducidad: enSeisMeses,
        sucursalId: sucursalPorNombre['Sucursal Norte'],
        productoId: productoPorNombre['Muzzarella'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cantidad: 20,
        fechaProduccion: ahora,
        fechaCaducidad: enSeisMeses,
        sucursalId: sucursalPorNombre['Sucursal Norte'],
        productoId: productoPorNombre['Jamón'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Lotes', registros, {});
  },

  async down(queryInterface, Sequelize) {
    // Reobtener IDs para limpiar
    const [productos] = await queryInterface.sequelize.query(`
      SELECT id FROM Productos WHERE nombre IN ('Muzzarella', 'Jamón');
    `);
    const [sucursales] = await queryInterface.sequelize.query(`
      SELECT id FROM Sucursales WHERE nombre IN ('Sucursal Centro', 'Sucursal Norte');
    `);

    const productoIds = productos.map(p => p.id);
    const sucursalIds = sucursales.map(s => s.id);

    await queryInterface.bulkDelete('Lotes', {
      productoId: { [Sequelize.Op.in]: productoIds },
      sucursalId: { [Sequelize.Op.in]: sucursalIds },
      cantidad: { [Sequelize.Op.in]: [10, 20] }
    }, {});
  }
};


