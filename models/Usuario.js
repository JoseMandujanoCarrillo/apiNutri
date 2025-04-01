const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
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
  apellidoPaterno: {
    type: String,
    required: true,
  },
  apellidoMaterno: {
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
  numeroIdentificacion: {
    type: String,
    default: null, // Puede ser DNI, CURP, RFC
  },
  escolaridad: {
    type: String,
    default: null,
  },
  imc: {
    type: Number,
    required: true,
  },
  numeroWhatsapp: {
    type: String,
    default: null,
  },
  direccion: {
    type: String,
    default: null,
  },
  ciudad: {
    type: String,
    required: true,
  },
  estadoProvincia: {
    type: String,
    default: null,
  },
  descripcionDetallada: {
    type: String,
    default: null,
  },
}, { timestamps: true });

// Especificar el nombre de la colección como "Usuario"
const Usuario = mongoose.model('Usuario', usuarioSchema, 'Usuario');

module.exports = Usuario;
