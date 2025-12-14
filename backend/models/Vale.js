const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Almacen = require('./Almacen');
const User = require('./User');

const Vale = sequelize.define('Vale', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  items: {
    // Array de objetos { nombre, cantidad, codigoBarras? }
    type: DataTypes.JSON,
    allowNull: false,
  },
  entregadoPorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  recibidoPor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  almacenId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Almacen,
      key: 'id'
    }
  },
}, {
  timestamps: true,
});

Vale.belongsTo(Almacen, { foreignKey: 'almacenId', as: 'almacen', onDelete: 'SET NULL' });
Almacen.hasMany(Vale, { foreignKey: 'almacenId', onDelete: 'SET NULL' });

Vale.belongsTo(User, { foreignKey: 'entregadoPorId', as: 'entregadoPor' });
User.hasMany(Vale, { foreignKey: 'entregadoPorId' });

module.exports = Vale;
