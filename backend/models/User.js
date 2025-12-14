const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Almacen = require('./Almacen');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('admin', 'almacenista'),
    defaultValue: 'almacenista',
  },
  almacenId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Almacen,
      key: 'id'
    }
  },
  foto: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
}, {
  timestamps: true,
});

User.belongsTo(Almacen, { foreignKey: 'almacenId', as: 'almacen' });
Almacen.hasMany(User, { foreignKey: 'almacenId' });

module.exports = User;
