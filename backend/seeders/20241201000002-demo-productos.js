'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Productos', [
      {
        nombre: 'Muzzarella',
        descripcion: 'El queso más duro del condao',
        precio: 1200.00,
        tipo: 1,
        imagen: 'harina-000.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Jamón',
        descripcion: 'El embutido más duro del condao',
        precio: 4500.00,
        tipo: 2,
        imagen: 'aceite-oliva.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Productos', {
      nombre: ['Muzzarella', 'Jamón']
    }, {});
  }
};


