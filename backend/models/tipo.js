'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tipo extends Model {
  }
  Producto.init({
    nombre: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Tipo',
  });
  return Tipo;
};