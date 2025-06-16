'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Objetivo extends Model {
    static associate(models) {
      Objetivo.hasMany(models.Usuario, { foreignKey: 'usuarioId' });
    }
  }
  Objetivo.init({
    descripcion: DataTypes.TEXT,
    fechaInicio: DataTypes.DATE,
    fechaFin: DataTypes.DATE,
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Objetivo',
  });
  return Objetivo;
};