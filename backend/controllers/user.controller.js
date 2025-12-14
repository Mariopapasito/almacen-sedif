const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nombre, email, contraseña, rol, almacenId } = req.body;

  try {
    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ mensaje: "Nombre, email y contraseña son obligatorios" });
    }

    if (contraseña.length < 6) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ mensaje: "Email inválido" });
    }

    const existe = await User.findOne({ where: { email } });
    if (existe) return res.status(400).json({ mensaje: "Usuario ya existe" });

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = await User.create({
      nombre,
      email,
      contraseña: hashedPassword,
      rol: rol || "almacenista",
      almacenId,
    });

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar", error });
  }
};

exports.login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    if (!email || !contraseña) {
      return res.status(400).json({ mensaje: "Email y contraseña son obligatorios" });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: require('../models/Almacen'), as: 'almacen' }]
    });
    if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const valido = await bcrypt.compare(contraseña, user.contraseña);
    if (!valido) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, rol: user.rol, almacenId: user.almacenId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      usuario: {
        nombre: user.nombre,
        rol: user.rol,
        almacenId: user.almacenId,
        almacen: user.almacen,
        foto: user.foto || null,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
};
