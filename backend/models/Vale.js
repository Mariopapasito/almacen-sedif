const mongoose = require("mongoose");

const valeSchema = new mongoose.Schema({
  producto: { type: String, required: true },
  cantidad: { type: Number, required: true },
  entregadoPor: { type: String, required: true },
  recibidoPor: { type: String },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vale", valeSchema);
