const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const User = require("../models/User");

// 🟢 Rutas públicas
router.post("/login", login);
router.post("/register", register);

// 🔐 Obtener perfil del usuario autenticado
router.get("/perfil", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.usuario.id, {
      attributes: { exclude: ['contraseña'] },
      include: [{ model: require('../models/Almacen'), as: 'almacen' }]
    });
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

    const user = await User.findByPk(req.usuario.id);
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
    const usuarios = await User.findAll({
      attributes: { exclude: ['contraseña'] },
      include: [{ model: require('../models/Almacen'), as: 'almacen' }]
    });
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

    const [updated] = await User.update(
      { nombre, email, rol, almacen },
      { where: { id: req.params.id } }
    );

    if (updated) {
      const usuario = await User.findByPk(req.params.id);
      res.json(usuario);
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
});

// 🔐 Eliminar usuario
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ mensaje: "Usuario eliminado correctamente" });
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
});

module.exports = router;