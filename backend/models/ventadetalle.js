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
    subtotal: DataTypes.DECIMAL(10, 2),
    ventaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Ventas',
        key: 'id'
      }
    },
    productoId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Productos',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'VentaDetalle',
    tableName: 'VentaDetalles', // Especificar explícitamente el nombre de la tabla
  });
  return VentaDetalle;
};