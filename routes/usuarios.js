const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Recomendado para seguridad
const Usuario = require('../models/Usuario');

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// Función auxiliar para cálculos de salud
const calcularSalud = (peso, altura, fechaNacimiento, genero) => {
    const imc = peso / (altura * altura);
    
    // Calcular edad para el BMR
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--;

    // Harris-Benedict BMR (Tasa Metabólica Basal)
    let bmr;
    if (genero.toLowerCase() === 'male' || genero.toLowerCase() === 'masculino') {
        bmr = 88.36 + (13.4 * peso) + (4.8 * altura * 100) - (5.7 * edad);
    } else {
        bmr = 447.59 + (9.2 * peso) + (3.1 * altura * 100) - (4.3 * edad);
    }

    return { imc: parseFloat(imc.toFixed(2)), bmr: Math.round(bmr) };
};

/**
 * @swagger
 * /usuarios:
 * post:
 * summary: Crear un nuevo usuario con cálculos automáticos
 * tags: [Usuarios]
 */
router.post('/', async (req, res) => {
    try {
        const data = req.body;

        // Cálculos automáticos antes de guardar
        const salud = calcularSalud(data.peso, data.altura, data.fechaNacimiento, data.genero);
        
        // Hashear contraseña por seguridad
        const salt = await bcrypt.genSalt(10);
        const hashedPath = await bcrypt.hash(data.contrasena || 'Nutri2026', salt);

        const nuevoUsuario = new Usuario({
            ...data,
            contrasena: hashedPath,
            imc: salud.imc,
            bmr: salud.bmr // Asegúrate de añadir bmr a tu Schema de Mongoose si lo deseas guardar
        });

        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /usuarios/{id}:
 * put:
 * summary: Actualizar usuario y recalcular salud
 * tags: [Usuarios]
 */
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        const usuarioActual = await Usuario.findById(req.params.id);

        if (!usuarioActual) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        // Si cambian datos físicos, recalcular IMC y BMR
        if (updates.peso || updates.altura) {
            const peso = updates.peso || usuarioActual.peso;
            const altura = updates.altura || usuarioActual.altura;
            const salud = calcularSalud(peso, altura, usuarioActual.fechaNacimiento, usuarioActual.genero);
            updates.imc = salud.imc;
            updates.bmr = salud.bmr;
        }

        // Bloquear edición de contraseña y foto desde esta ruta general
        delete updates.contrasena;
        delete updates.fotoPerfil;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- Rutas de búsqueda y eliminación (se mantienen iguales para consistencia) ---

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const usuarios = await Usuario.find().skip(skip).limit(limit).select('-contrasena');
        const totalUsuarios = await Usuario.countDocuments();
        res.json({ page, limit, totalUsuarios, totalPaginas: Math.ceil(totalUsuarios / limit), usuarios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('-contrasena');
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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