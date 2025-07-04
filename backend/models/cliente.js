'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {

    static associate(models) {
      Cliente.hasMany(models.Venta, { foreignKey: 'clienteId' });
    }
  }
  Cliente.init({
    nombre: DataTypes.STRING,
    localidad: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Cliente',
  });
  return Cliente;
};