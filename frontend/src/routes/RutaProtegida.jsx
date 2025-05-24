import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";

export default function RutaProtegida({ rolRequerido }) {
  const { usuario } = useContext(AuthContext);

  // 🔒 Si no hay sesión iniciada
  if (!usuario) return <Navigate to="/" replace />;

  // 🔐 Si el rol del usuario no coincide con el requerido
  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  // ✅ Acceso permitido
  return <Outlet />;
}

RutaProtegida.propTypes = {
  rolRequerido: PropTypes.string,
};