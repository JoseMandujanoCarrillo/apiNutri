const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Usuario = require('../models/Usuario');

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

/**
 * @swagger
 * /login-unificado:
 * post:
 * summary: Autenticación global para Nutriólogos y Pacientes
 * tags:
 * - Autenticación
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * correo:
 * type: string
 * contrasena:
 * type: string
 * responses:
 * 200:
 * description: Autenticación exitosa
 * 401:
 * description: Credenciales incorrectas
 */
router.post('/login-unificado', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // 1. Buscamos primero en la colección de Administradores (Nutriólogos)
    let user = await Admin.findOne({ correo });
    let role = 'admin';

    // 2. Si no es admin, buscamos en la colección de Usuarios (Pacientes)
    if (!user) {
      user = await Usuario.findOne({ correo });
      role = 'usuario';
    }

    // 3. Si no existe en ninguna, devolvemos 404
    if (!user) {
      return res.status(404).json({ mensaje: 'Cuenta no encontrada' });
    }

    // 4. Validación de contraseña (Recuerda usar bcrypt en producción)
    if (user.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // 5. Generación de Token incluyendo el Rol
    const token = jwt.sign(
      { id: user._id, role: role }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    // 6. Respuesta con el rol para la redirección en Flutter
    res.json({
      token,
      role,
      id: user._id,
      nombre: user.nombre
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;