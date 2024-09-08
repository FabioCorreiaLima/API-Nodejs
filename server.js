require('dotenv').config();
const express = require('express');
const connectMongoDB = require('./config/db.mongo.config');
const sequelize = require('./config/db.mysql.config');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

connectMongoDB();  // Conectar MongoDB
sequelize.sync();  // Sincronizar Sequelize com MySQL

app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/api', itemRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
