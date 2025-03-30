const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
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
 *               peso:
 *                 type: number
 *               altura:
 *                 type: number
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *               genero:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', async (req, res) => {
  const { correo, contrasena, nombre, fotoPerfil, peso, altura, fechaNacimiento, genero } = req.body;
  const nuevoUsuario = new Usuario({
    correo,
    contrasena,
    nombre,
    fotoPerfil,
    peso: peso || null,
    altura: altura || null,
    fechaNacimiento,
    genero
  });
  
  try {
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /usuarios/register:
 *   post:
 *     summary: Registrar un nuevo usuario y obtener un token
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
 *               peso:
 *                 type: number
 *               altura:
 *                 type: number
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *               genero:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado y token generado
 *       400:
 *         description: Error en la solicitud
 */
router.post('/register', async (req, res) => {
  const { correo, contrasena, nombre, fotoPerfil, peso, altura, fechaNacimiento, genero } = req.body;
  const nuevoUsuario = new Usuario({
    correo,
    contrasena,
    nombre,
    fotoPerfil,
    peso: peso || null,
    altura: altura || null,
    fechaNacimiento,
    genero
  });

  try {
    const usuarioGuardado = await nuevoUsuario.save();
    const token = jwt.sign({ id: usuarioGuardado._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ usuario: usuarioGuardado, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Autenticar un usuario y obtener un token
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
 *         description: Usuario autenticado, devuelve token
 *       401:
 *         description: Credenciales incorrectas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    // Nota: En producción, se debe usar bcrypt para comparar contraseñas hasheadas.
    if (usuario.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
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
 *               peso:
 *                 type: number
 *               altura:
 *                 type: number
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *               genero:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Error en la solicitud
 */
router.put('/:id', async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuarioActualizado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Error en la solicitud
 */
router.delete('/:id', async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
