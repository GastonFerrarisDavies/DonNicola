'use strict';
const {
  Model
} = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  class Lote extends Model {
    static associate(models) {
      Lote.belongsTo(models.Sucursal, { foreignKey: 'sucursalId' });
      Lote.belongsTo(models.Producto, { foreignKey: 'productoId' });
    }
  }
  Lote.init({
    cantidad: DataTypes.INTEGER,
    fechaCaducidad: DataTypes.DATE,
    fechaProduccion: DataTypes.DATE,
    sucursalId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Sucursales',
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
    modelName: 'Lote',
    tableName: 'Lotes', // Especificar explícitamente el nombre de la tabla
  });
  return Lote;
};