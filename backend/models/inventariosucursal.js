'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InventarioSucursal extends Model {
    static associate(models) {
      InventarioSucursal.belongsTo(models.Sucursal, { foreignKey: 'sucursal_id' });
      InventarioSucursal.belongsTo(models.Producto, { foreignKey: 'producto_id' });
    }
  }
  InventarioSucursal.init({
    cantidad: DataTypes.INTEGER,
    sucursalId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Sucursal',
        key: 'id'
      }
    },
    productoId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Producto',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'InventarioSucursal',
  });
  return InventarioSucursal;
};