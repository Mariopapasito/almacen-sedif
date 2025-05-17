import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MenuLateral() {
  const navigate = useNavigate();
  const { usuario, logout } = useContext(AuthContext);

  return (
    <div style={{
      width: "220px",
      backgroundColor: "#843434",
      color: "white",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "1rem",
      position: "fixed"
    }}>
      <h3 style={{ marginBottom: "2rem", textAlign: "center" }}>SEDIF</h3>

      {/* ✅ Botones visibles para todos */}
      <button onClick={() => navigate("/dashboard")} style={btnEstilo}>🏠 Inicio</button>
      <button onClick={() => navigate("/vales")} style={btnEstilo}>📄 Vales</button>
      <button onClick={() => navigate("/perfil")} style={btnEstilo}>👤 Mi Perfil</button>

      {/* ✅ Solo visible para admin */}
      {usuario?.rol === "admin" && (
        <>
          <button onClick={() => navigate("/articulos")} style={btnEstilo}>📦 Artículos</button>
          <button onClick={() => navigate("/usuarios")} style={btnEstilo}>👥 Usuarios</button>
          <button onClick={() => navigate("/configuracion")} style={btnEstilo}>⚙️ Configuración</button>
        </>
      )}

      <div style={{ flexGrow: 1 }} />
      <button
        onClick={logout}
        style={{
          ...btnEstilo,
          backgroundColor: "#fff",
          color: "#843434",
          fontWeight: "bold"
        }}>
        Cerrar sesión
      </button>
    </div>
  );
}

const btnEstilo = {
  backgroundColor: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  padding: "0.75rem 1rem",
  cursor: "pointer",
  fontSize: "1rem",
  marginBottom: "0.5rem"
};
