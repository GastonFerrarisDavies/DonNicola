'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Objetivo, { foreignKey: 'usuarioId' });
    }
    async validPassword(password) {
      return await bcrypt.compare(password, this.password);
    } 
  }
  Usuario.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  return Usuario;
};