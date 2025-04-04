const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu'); // Asegúrate de que la ruta al modelo sea la correcta

// Obtener todos los menus
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un menu por ID
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

// Crear un nuevo menu
router.post('/', async (req, res) => {
  try {
    const nuevoMenu = new Menu(req.body);
    const menuGuardado = await nuevoMenu.save();
    res.status(201).json(menuGuardado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un menu por ID
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

// Eliminar un menu por ID
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
