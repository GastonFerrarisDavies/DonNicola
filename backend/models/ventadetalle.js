'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VentaDetalle extends Model {
    static associate(models) {
      VentaDetalle.belongsTo(models.Venta, { foreignKey: 'ventaId' });
      VentaDetalle.belongsTo(models.Producto, { foreignKey: 'productoId' });
    }
  }
  VentaDetalle.init({
    cantidad: DataTypes.INTEGER,
    fechaCaducidad: DataTypes.DATE,
    fechaProduccion: DataTypes.DATE,
    ventaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Venta',
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
    modelName: 'VentaDetalle',
  });
  return VentaDetalle;
};