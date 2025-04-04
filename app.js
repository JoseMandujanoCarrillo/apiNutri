const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const usuariosRoutes = require('./routes/usuarios');
const connectDB = require('./config/db'); // Importar la conexión a la base de datos
const adminRoutes = require('./routes/admins');
const cors = require('cors');
const menu = require('./routes/menu');
const app = express();

// Conectar a la base de datos
connectDB()
  .then(() => console.log('Conexión a la base de datos establecida correctamente'))
  .catch((error) => console.error('Error al conectar a la base de datos:', error.message));

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuarios',
      version: '1.0.0',
      description: 'Documentación de la API para gestionar usuarios',
    },
    servers: [
      {
        url: 'https://apinutri-6zku.onrender.com',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use('/usuarios', usuariosRoutes);
app.use('/admins', adminRoutes);
app.use('/menu', menu);
app.use(cors());
// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en  http://localhost:${PORT}`);
  console.log(`Servidor corriendo con swagger en  http://localhost:${PORT}/api-docs`);
});