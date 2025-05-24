import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MenuLateral() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useContext(AuthContext);
  const rol = usuario?.rol;
  const fotoURL = usuario?.foto ? `http://localhost:5050${usuario.foto}` : null;

  useEffect(() => {
    // Redirección forzada si ya estás en la ruta actual
    const rutaInicio = rol === "admin" ? "/dashboard" : "/dashboard-almacenista";
    if (location.pathname === rutaInicio) {
      navigate(rutaInicio, { replace: true });
    }
  }, [rol, location.pathname, navigate]);

  return (
    <div style={{
      width: "150px",
      backgroundColor: "#843434",
      color: "white",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "1rem",
      position: "fixed"
    }}>
     <div style={{ marginBottom: "2rem", textAlign: "center" }}>
  <img
    src="/logo-sedif.png"
    alt="Logo SEDIF"
    style={{ width: "120px", height: "auto" }}
  />
</div>


      {/* ✅ Botón de Inicio según rol */}
      <button
        onClick={() => {
          if (rol === "admin") navigate("/dashboard");
          else if (rol === "almacenista") navigate("/dashboard-almacenista");
        }}
        style={btnEstilo}
      >
        🏠 Inicio
      </button>

      <button onClick={() => navigate("/vales")} style={btnEstilo}>📄 Vales</button>
      <button onClick={() => navigate("/perfil")} style={btnEstilo}>👤 Mi Perfil</button>

      {rol === "admin" && (
        <>
          <button onClick={() => navigate("/articulos")} style={btnEstilo}>📦 Artículos</button>
          <button onClick={() => navigate("/usuarios")} style={btnEstilo}>👥 Usuarios</button>
          <button onClick={() => navigate("/configuracion")} style={btnEstilo}>⚙️ Configuración</button>
        </>
      )}

      <div style={{ flexGrow: 1 }} />

      {fotoURL && (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <img
            src={fotoURL}
            alt="Foto de perfil"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "2px solid white",
              objectFit: "cover"
            }}
          />
        </div>
      )}

      <button
  onClick={logout}
  style={{
    ...btnEstilo,
    backgroundColor: "#fff",
    color: "#843434",
    fontWeight: "bold",
    borderRadius: "30px", // más redondo
    border: "2px solid #843434",
    marginBottom: "1rem",
    transition: "background-color 0.3s, transform 0.2s",
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#eaeaea"; // más oscuro al pasar cursor
    e.target.style.transform = "scale(1.02)";
  }}
  onFocus={(e) => {
    e.target.style.backgroundColor = "#eaeaea";
    e.target.style.transform = "scale(1.02)";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "#fff";
    e.target.style.transform = "scale(1)";
  }}
  onBlur={(e) => {
    e.target.style.backgroundColor = "#fff";
    e.target.style.transform = "scale(1)";
  }}
>
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
