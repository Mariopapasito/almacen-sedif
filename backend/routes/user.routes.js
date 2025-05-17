const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const User = require("../models/user"); // ✅ importa User correctamente

// 🟢 Rutas públicas
router.post("/login", login);
router.post("/register", register);

// 🔐 Rutas protegidas
router.get("/perfil", auth, async (req, res) => {
  try {
    const user = await User.findById(req.usuario.id);
    res.json({ foto: user.foto });
  } catch (error) {
    console.error("Error al obtener foto de perfil:", error);
    res.status(500).json({ mensaje: "Error al obtener foto" });
  }
});

router.put("/upload-profile", auth, upload.single("foto"), async (req, res) => {
  try {
    const user = await User.findById(req.usuario.id);
    user.foto = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ mensaje: "Imagen de perfil actualizada", foto: user.foto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al subir imagen", error });
  }
});

module.exports = router;
