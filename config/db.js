const mongoose = require('mongoose');

// URI apuntando específicamente a la base de datos appNutri
const uri = "mongodb+srv://eenfse:admin1987@cluster0.yj36aye.mongodb.net/appNutri?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      // Estas opciones evitan el "Buffering Timeout" al fallar rápido si no hay red
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });

    console.log('¡Conexión exitosa a MongoDB: Cluster0 -> appNutri!');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error.message);
    // En lugar de buffering, detenemos el proceso para que Render reinicie limpio
    process.exit(1); 
  }
};

module.exports = { connectDB };