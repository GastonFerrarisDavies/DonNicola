'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tipo extends Model {
  }
  Tipo.init({
    nombre: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Tipo',
  });
  return Tipo;
};