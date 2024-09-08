// config/db.mysql.config.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  dialect: 'mysql',
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('Conectado ao MySQL com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

module.exports = sequelize;
