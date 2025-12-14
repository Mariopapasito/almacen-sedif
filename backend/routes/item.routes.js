const express = require("express");
const router = express.Router();
const {
  crearItem,
  obtenerItems,
  obtenerItemsPorAlmacen,
  actualizarItem,
  eliminarItem,
  buscarItems,
} = require("../controllers/item.controller");

const auth = require("../middleware/auth.middleware");
const soloAdmin = require("../middleware/role.middleware")("admin");

// Rutas principales
router.post("/", auth, soloAdmin, crearItem);
router.get("/", auth, obtenerItems);
router.get("/search", auth, buscarItems); // Nueva ruta de búsqueda
router.get("/almacen/:id", auth, obtenerItemsPorAlmacen); // ✅ Nueva ruta
router.put("/:id", auth, soloAdmin, actualizarItem);
router.delete("/:id", auth, soloAdmin, eliminarItem);

module.exports = router;