const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const Admin = require('./models/Admin');
const Usuario = require('./models/Usuario'); // Asegúrate de tener este modelo
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// RUTA QUE BUSCA TU APP DE FLUTTER
app.post('/login-unificado', async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    // 1. Buscar en Administradores
    let user = await Admin.findOne({ correo });
    let role = 'admin';

    // 2. Si no es admin, buscar en Usuarios (Pacientes)
    if (!user) {
      user = await Usuario.findOne({ correo });
      role = 'patient';
    }

    if (!user || user.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user._id, role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, role, nombre: user.nombre });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
});