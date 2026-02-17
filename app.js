const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors'); // Movido arriba para mejor práctica
const { connectDB } = require('./config/db'); // IMPORTANTE: Ahora con llaves { }
const usuariosRoutes = require('./routes/usuarios');
const adminRoutes = require('./routes/admins');
const menu = require('./routes/menu');

const app = express();

// Middlewares base
app.use(cors()); // Se recomienda activar CORS antes de las rutas
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Conectar a la base de datos AppNutri
connectDB()
  .then(() => console.log('¡Conexión exitosa a MongoDB Cluster0!'))
  .catch((error) => {
    console.error('Error crítico al conectar a la base de datos:', error.message);
    // No cerramos el proceso aquí para permitir que Render intente reconectar si es necesario
  });

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Nutrición - NutriApp',
      version: '1.0.0',
      description: 'Documentación de la API para gestionar pacientes, cálculos y dietas',
    },
    servers: [
      {
        url: 'https://apinutri-mo1e.onrender.com',
      },
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Definición de Rutas
app.use('/usuarios', usuariosRoutes); // [cite: 1-13, 87]
app.use('/admins', adminRoutes);
app.use('/menu', menu);

// Middleware para manejar errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor!', mensaje: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`Documentación Swagger en: http://localhost:${PORT}/api-docs`);
});