'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.hasMany(models.InventarioSucursal, { foreignKey: 'productoId' });
      Producto.hasMany(models.VentaDetalle, { foreignKey: 'productoId' });
    }
  }
  Producto.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    fecha: DataTypes.DATE,
    fechaCaducidad: DataTypes.DATE,
    tipo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Producto',
  });
  return Producto;
};