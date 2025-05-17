const express = require("express");
const router = express.Router();
const {
  crearItem,
  obtenerItems,
  actualizarItem,
  eliminarItem,
} = require("../controllers/item.controller");

const auth = require("../middleware/auth.middleware");
const soloAdmin = require("../middleware/role.middleware")("admin");

router.post("/", auth, soloAdmin, crearItem);
router.get("/", auth, obtenerItems);
router.put("/:id", auth, soloAdmin, actualizarItem);
router.delete("/:id", auth, soloAdmin, eliminarItem);

module.exports = router;
