const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Almacen = require('./Almacen');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigoBarras: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  peso: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  almacenId: {
    type: DataTypes.INTEGER,
    allowNull: true,  // Cambiar a true para permitir null
    references: {
      model: Almacen,
      key: 'id'
    }
  },
}, {
  timestamps: true,
});

Item.belongsTo(Almacen, { foreignKey: 'almacenId', as: 'almacen' });
Almacen.hasMany(Item, { foreignKey: 'almacenId' });

// Hook para eliminar almacén si queda vacío
Item.addHook('afterDestroy', async (item, options) => {
  if (item.almacenId) {
    const itemCount = await Item.count({ where: { almacenId: item.almacenId } });
    if (itemCount === 0) {
      await Almacen.destroy({ where: { id: item.almacenId } });
    }
  }
});

module.exports = Item;