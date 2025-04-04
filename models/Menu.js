const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  plan: {
    type: String, // URL o ruta del archivo (PDF o Word)
    required: true,
  },
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Referencia al modelo de Usuario
    required: true,
  },
}, { timestamps: true });

// Especificar el nombre de la colección como "Menu"
const Menu = mongoose.model('Menu', menuSchema, 'Menu');

module.exports = Menu;
