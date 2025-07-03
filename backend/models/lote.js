'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
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
    modelName: 'Lote',
  });
  return Lote;
};