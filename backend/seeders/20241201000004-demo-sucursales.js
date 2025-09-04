'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Sucursales', [
      {
        nombre: 'Sucursal Centro',
        direccion: 'Av. Principal 123, Córdoba',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Sucursal Norte',
        direccion: 'Calle Secundaria 456, Córdoba',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Sucursales', {
      nombre: ['Sucursal Centro', 'Sucursal Norte']
    }, {});
  }
};


