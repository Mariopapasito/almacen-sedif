const express = require("express");
const router = express.Router();
const { crearAlmacen, obtenerAlmacenes, obtenerAlmacen, eliminarAlmacen } = require("../controllers/almacen.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, crearAlmacen);
router.get("/", auth, obtenerAlmacenes);
router.get("/:id", auth, obtenerAlmacen);
router.delete("/:id", auth, eliminarAlmacen);

module.exports = router;