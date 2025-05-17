const roleMiddleware = (rolRequerido) => {
  return (req, res, next) => {
    if (req.usuario.rol !== rolRequerido) {
      return res.status(403).json({ mensaje: "No autorizado para esta acción" });
    }
    next();
  };
};

module.exports = roleMiddleware;
// Este middleware se utiliza para verificar el rol del usuario autenticado.
// Se compara el rol del usuario con el rol requerido para acceder a la ruta.
// Si el rol no coincide, se devuelve un error 403 (prohibido).
// Si el rol coincide, se permite el acceso a la ruta.
// Se utiliza en rutas que requieren permisos específicos, como administrador o almacenista.