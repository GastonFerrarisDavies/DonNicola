'use strict';
const {
  Model
} = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  class Venta extends Model {
    static associate(models) {
      Venta.belongsTo(models.Cliente, { foreignKey: 'clienteId', as: 'Cliente' });
      Venta.belongsTo(models.Sucursal, { foreignKey: 'sucursalId', as: 'Sucursal' });
      Venta.hasMany(models.VentaDetalle, { foreignKey: 'ventaId', as: 'VentaDetalle' });
    }
  }
  Venta.init({
    fecha: DataTypes.DATE,
    total: DataTypes.DECIMAL(10, 2),
    sucursalId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Sucursales',
        key: 'id'
      }
    },
    clienteId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Clientes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Venta',
    tableName: 'Ventas', // Especificar explícitamente el nombre de la tabla
  });
  return Venta;
};