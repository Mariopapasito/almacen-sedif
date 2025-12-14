const { Sequelize } = require('sequelize');

// Configuración de Sequelize para MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'almacen_sedif',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Desactiva logs de SQL en consola
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a MySQL');
  } catch (error) {
    console.error('Error de conexión a MySQL:', error);
  }
};

module.exports = { sequelize, connectDB };
