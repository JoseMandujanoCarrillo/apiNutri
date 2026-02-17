const { MongoClient, ServerApiVersion } = require('mongodb');

// URI corregida con tus credenciales para Cluster0
const uri = "mongodb+srv://Nutri:Nutri@cluster0.yj36aye.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    // Conectamos pero NO CERRAMOS la conexión al terminar
    await client.connect();
    
    // Verificamos conexión con la DB administrativa
    await client.db("admin").command({ ping: 1 });
    console.log("¡Conexión exitosa a MongoDB Cluster0!");
    
    // Retornamos la base de datos AppNutri para usarla en las rutas
    return client.db("AppNutri"); 
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1); // Si falla la conexión, detenemos el servidor
  }
}

// Exportamos el cliente y la función para que app.js la use
module.exports = { connectDB, client };