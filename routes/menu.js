const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       properties:
 *         plan:
 *           type: string
 *           description: URL o ruta del archivo del plan (PDF o Word)
 *         idUsuario:
 *           type: string
 *           description: ID del usuario al que pertenece el menú
 *       required:
 *         - plan
 *         - idUsuario
 */

/**
 * @swagger
 * tags:
 *   - name: Menu
 *     description: Endpoints para la gestión de menús
 */

/**
 * @swagger
 * /menu:
 *   get:
 *     tags: [Menu]
 *     summary: Obtiene todos los menús
 *     responses:
 *       200:
 *         description: Lista de menús
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 */
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     tags: [Menu]
 *     summary: Obtiene un menú por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del menú
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menú encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       404:
 *         description: Menú no encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu no encontrado' });
    }
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /menu:
 *   post:
 *     tags: [Menu]
 *     summary: Crea un nuevo menú
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       201:
 *         description: Menú creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       500:
 *         description: Error al crear el menú
 */
router.post('/', async (req, res) => {
  try {
    const nuevoMenu = new Menu(req.body);
    const menuGuardado = await nuevoMenu.save();
    res.status(201).json(menuGuardado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     tags: [Menu]
 *     summary: Actualiza un menú por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del menú a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: Menú actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       404:
 *         description: Menú no encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const menuActualizado = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuActualizado) {
      return res.status(404).json({ message: 'Menu no encontrado' });
    }
    res.status(200).json(menuActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     tags: [Menu]
 *     summary: Elimina un menú por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del menú a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menú eliminado correctamente
 *       404:
 *         description: Menú no encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const menuEliminado = await Menu.findByIdAndDelete(req.params.id);
    if (!menuEliminado) {
      return res.status(404).json({ message: 'Menu no encontrado' });
    }
    res.status(200).json({ message: 'Menu eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
