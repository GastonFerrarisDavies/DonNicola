'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sucursal extends Model {
    static associate(models) {
      Sucursal.hasMany(models.InventarioSucursal, { foreignKey: 'sucursalId'})
      models.InventarioSucursal.belongsTo(Sucursal, { foreignKey: 'sucursalId'})
    }
  }
  Sucursal.init({
    nombre: DataTypes.STRING,
    direccion: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Sucursal',
  });
  return Sucursal;
};