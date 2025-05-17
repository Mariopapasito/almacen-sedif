const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  categoria: { type: String, required: true },
  cantidad: { type: Number, required: true },
  peso: { type: Number, required: false },
  almacen: { type: String, required: true }, // A, B, C, D
});

module.exports = mongoose.model("Item", itemSchema);
