const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://JoseCarrillo:CarrilloM27@miguelapi.8or9enx.mongodb.net/Nutribase?retryWrites=true&w=majority');
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;