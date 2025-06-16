'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venta extends Model {
    static associate(models) {
      Venta.belongsTo(models.Cliente, { foreignKey: 'clienteId' });
      Venta.hasMany(models.DetalleVenta, { foreignKey: 'ventaId' });
    }
  }
  Venta.init({
    fecha: DataTypes.DATE,
    total: DataTypes.DECIMAL,
    clienteId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cliente',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Venta',
  });
  return Venta;
};