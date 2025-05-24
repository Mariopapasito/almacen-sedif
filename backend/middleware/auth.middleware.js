const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // 🔓 Permitir solicitudes OPTIONS sin verificar token (CORS preflight)
    if (req.method === "OPTIONS") {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ mensaje: "Token no proporcionado o malformado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id || !decoded.rol) {
      return res.status(403).json({ mensaje: "Token inválido o incompleto" });
    }

    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("🔐 Error de autenticación:", error.message);
    return res.status(403).json({ mensaje: "Token inválido o expirado" });
  }
};