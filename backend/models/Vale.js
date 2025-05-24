const mongoose = require("mongoose");

const valeSchema = new mongoose.Schema(
  {
    producto: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1,
    },
    entregadoPor: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    recibidoPor: {
      type: String,
      trim: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    almacen: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt
  }
);

module.exports = mongoose.model("Vale", valeSchema);
