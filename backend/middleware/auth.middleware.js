const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // 🔓 Permitir solicitudes OPTIONS (preflight) sin bloquear
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(403).json({ mensaje: "Token no proporcionado" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};
