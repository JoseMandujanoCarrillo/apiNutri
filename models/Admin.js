const mongoose = require('mongoose');

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