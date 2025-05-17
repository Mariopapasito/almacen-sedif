const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
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


// Este middleware se utiliza para proteger las rutas que requieren autenticación.
// Se extrae el token del encabezado de autorización y se verifica su validez.
// Si el token es válido, se decodifica y se añade la información del usuario a la solicitud.
// Si el token no es válido o no se proporciona, se devuelve un error 403 (prohibido).