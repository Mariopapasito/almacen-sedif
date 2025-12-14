const express = require("express");
const router = express.Router();
const {
  crearVale,
  obtenerVales,
  generarPDF,
  eliminarVale
} = require("../controllers/pdf.controller");
const auth = require("../middleware/auth.middleware");

// 🟢 Generar y descargar PDF de un vale específico
router.get("/pdf/:id", auth, generarPDF);

// 🟢 Obtener vales (filtrados por almacén si es almacenista)
router.get("/", auth, obtenerVales);

// 🟢 Crear un vale (requiere autenticación)
router.post("/", auth, crearVale);

// 🗑️ Eliminar un vale
router.delete("/:id", auth, eliminarVale);

module.exports = router;
