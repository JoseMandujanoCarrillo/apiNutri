const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Asegúrate de que Admin esté exportado correctamente desde el modelo

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Obtener todos los administradores
 *     tags:
 *       - Administradores
 *     responses:
 *       200:
 *         description: Lista de administradores
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /admins/{id}:
 *   get:
 *     summary: Obtener un administrador por ID
 *     tags:
 *       - Administradores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del administrador
 *     responses:
 *       200:
 *         description: Administrador encontrado
 *       404:
 *         description: Administrador no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ mensaje: 'Administrador no encontrado' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /admins:
 *   post:
 *     summary: Crear un nuevo administrador
 *     tags:
 *       - Administradores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               nombre:
 *                 type: string
 *               fotoPerfil:
 *                 type: string
 *     responses:
 *       201:
 *         description: Administrador creado
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', async (req, res) => {
  const { correo, contrasena, nombre, fotoPerfil } = req.body;
  const nuevoAdmin = new Admin({
    correo,
    contrasena,
    nombre,
    fotoPerfil: fotoPerfil || null,
  });

  try {
    const adminGuardado = await nuevoAdmin.save();
    res.status(201).json(adminGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /admins/login:
 *   post:
 *     summary: Autenticar un administrador y obtener un token
 *     tags:
 *       - Administradores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Administrador autenticado, devuelve token
 *       401:
 *         description: Credenciales incorrectas
 *       404:
 *         description: Administrador no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const admin = await Admin.findOne({ correo });
    if (!admin) return res.status(404).json({ mensaje: 'Administrador no encontrado' });

    // Nota: En producción, se debe usar bcrypt para comparar contraseñas hasheadas.
    if (admin.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /admins/{id}:
 *   put:
 *     summary: Actualizar un administrador existente
 *     tags:
 *       - Administradores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               nombre:
 *                 type: string
 *               fotoPerfil:
 *                 type: string
 *     responses:
 *       200:
 *         description: Administrador actualizado
 *       404:
 *         description: Administrador no encontrado
 *       400:
 *         description: Error en la solicitud
 */
router.put('/:id', async (req, res) => {
  try {
    const adminActualizado = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!adminActualizado) return res.status(404).json({ mensaje: 'Administrador no encontrado' });
    res.json(adminActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Eliminar un administrador
 *     tags:
 *       - Administradores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del administrador
 *     responses:
 *       200:
 *         description: Administrador eliminado correctamente
 *       404:
 *         description: Administrador no encontrado
 *       400:
 *         description: Error en la solicitud
 */
router.delete('/:id', async (req, res) => {
    try {
      console.log('ID recibido:', req.params.id);
      const adminEliminado = await Admin.findByIdAndDelete(req.params.id);
      if (!adminEliminado) {
        console.log('Administrador no encontrado');
        return res.status(404).json({ mensaje: 'Administrador no encontrado' });
      }
      res.json({ mensaje: 'Administrador eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar administrador:', error);
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router;