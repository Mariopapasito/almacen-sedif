const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nombre, email, contraseña, rol, almacen } = req.body;

  try {
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: "Usuario ya existe" });

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = new User({
      nombre,
      email,
      contraseña: hashedPassword,
      rol: rol || "almacenista",
      almacen,
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar", error });
  }
};

exports.login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const valido = await bcrypt.compare(contraseña, user.contraseña);
    if (!valido) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      usuario: { nombre: user.nombre, rol: user.rol, almacen: user.almacen },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
};
