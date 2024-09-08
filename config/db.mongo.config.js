
const mongoose = require("mongoose");
require('dotenv').config({ path: './.env' }); // Carregar variáveis de ambiente

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Conectando ao MongoDB sem as opções obsoletas
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Encerrar o processo em caso de falha
    }
};

module.exports = connectDB;
