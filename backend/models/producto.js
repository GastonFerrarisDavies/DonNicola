'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.hasMany(models.Lote, { foreignKey: 'productoId' });
      Producto.hasMany(models.VentaDetalle, { foreignKey: 'productoId' });
    }
  }
  Producto.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    precio: DataTypes.DECIMAL(10, 2),
    tipo: DataTypes.INTEGER,
    imagen: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Producto',
    tableName: 'Productos', // Especificar explícitamente el nombre de la tabla
  });
  return Producto;
};