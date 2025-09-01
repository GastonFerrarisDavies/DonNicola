'use strict';
const {
  Model
} = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  class Objetivo extends Model {
    static associate(models) {
      Objetivo.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    }
  }
  Objetivo.init({
    descripcion: DataTypes.TEXT,
    fechaInicio: DataTypes.DATE,
    fechaFin: DataTypes.DATE,
    nombre: DataTypes.STRING,
    usuarioId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Objetivo',
    tableName: 'Objetivos', // Especificar explícitamente el nombre de la tabla
  });
  return Objetivo;
};