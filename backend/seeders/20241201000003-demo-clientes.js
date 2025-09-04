'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Clientes', [
      {
        nombre: 'Juan Pérez',
        localidad: 'Córdoba',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'María Gómez',
        localidad: 'Rosario',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Clientes', {
      nombre: ['Juan Pérez', 'María Gómez']
    }, {});
  }
};


