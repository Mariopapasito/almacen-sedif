const express = require("express");
const router = express.Router();
const { crearVale, obtenerVales, generarPDF } = require("../controllers/pdf.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, crearVale);
router.get("/", auth, obtenerVales);
router.get("/pdf/:id", auth, generarPDF);

module.exports = router;
