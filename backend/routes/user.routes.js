const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const User = require("../models/user");

// 🟢 Rutas públicas
router.post("/login", login);
router.post("/register", register);

// 🔐 Obtener perfil del usuario autenticado
router.get("/perfil", auth, async (req, res) => {
  try {
    const user = await User.findById(req.usuario.id).select("-contraseña");
    if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    console.error("❌ Error al obtener perfil:", error);
    res.status(500).json({ mensaje: "Error al obtener perfil" });
  }
});

// 🔐 Subir imagen de perfil
router.put("/upload-profile", auth, upload.single("foto"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: "No se recibió ninguna imagen" });
    }

    const user = await User.findById(req.usuario.id);
    if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    user.foto = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ mensaje: "Imagen de perfil actualizada", foto: user.foto });
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    res.status(500).json({ mensaje: "Error al subir imagen", error });
  }
});

// 🔐 Obtener todos los usuarios
router.get("/", auth, async (req, res) => {
  try {
    const usuarios = await User.find().select("-contraseña");
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
});

// 🔐 Actualizar usuario
router.put("/:id", auth, async (req, res) => {
  try {
    const { nombre, email, rol, almacen } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ mensaje: "Nombre y correo son obligatorios" });
    }

    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, email, rol, almacen },
      { new: true }
    );

    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
});

// 🔐 Eliminar usuario
router.delete("/:id", auth, async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
});

module.exports = router;