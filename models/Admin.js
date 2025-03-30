const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  contrasena: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  fotoPerfil: {
    type: String,
    default: null,
  },
  peso: {
    type: Number,
    default: null,
  },
  altura: {
    type: Number,
    default: null,
  },
  fechaNacimiento: {
    type: Date,
    required: true,
  },
  genero: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Especificar el nombre de la colección como "Usuario"
const Usuario = mongoose.model('Usuario', usuarioSchema, 'Usuario');

// Crear el esquema para Admin
const adminSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  contrasena: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  fotoPerfil: {
    type: String,
    default: null,
  },
}, { timestamps: true });

// Especificar el nombre de la colección como "Admin"
const Admin = mongoose.model('Admin', adminSchema, 'Admin');

module.exports =  Admin;