import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MenuLateral() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useContext(AuthContext);
  const rol = usuario?.rol;
  const fotoURL = usuario?.foto ? `${usuario.foto}` : null;
  const logo = localStorage.getItem("logo") || "/logo-sedif.png";

  useEffect(() => {
    // Redirección forzada si ya estás en la ruta actual
    const rutaInicio = rol === "admin" ? "/dashboard" : "/dashboard-almacenista";
    if (location.pathname === rutaInicio) {
      navigate(rutaInicio, { replace: true });
    }
  }, [rol, location.pathname, navigate]);

  return (
    <div style={{
      width: "220px",
      backgroundColor: "#843434",
      color: "white",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem",
      position: "fixed",
      boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
      borderRadius: "0 20px 20px 0",
      zIndex: 1000,
    }}>
      <div style={{ marginBottom: "3rem", textAlign: "center" }}>
        <img
          src={logo}
          alt="Logo SEDIF"
          style={{ width: "140px", height: "auto", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
        />
      </div>


      {/* ✅ Botón de Inicio según rol */}
      <button
        onClick={() => {
          if (rol === "admin") navigate("/dashboard");
          else if (rol === "almacenista") navigate("/dashboard-almacenista");
        }}
        style={{
          backgroundColor: "rgba(255,255,255,0.2)",
          color: "white",
          border: "none",
          padding: "12px 20px",
          marginBottom: "10px",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "500",
          transition: "all 0.3s ease",
          textAlign: "left",
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.3)"}
        onMouseOut={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
      >
        🏠 Inicio
      </button>

      <button onClick={() => navigate("/vales")} style={{
        backgroundColor: "rgba(255,255,255,0.2)",
        color: "white",
        border: "none",
        padding: "12px 20px",
        marginBottom: "10px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
        transition: "all 0.3s ease",
        textAlign: "left",
      }}
        onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.3)"}
        onMouseOut={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
      >📄 Vales</button>
      <button onClick={() => navigate("/perfil")} style={{
        backgroundColor: "rgba(255,255,255,0.2)",
        color: "white",
        border: "none",
        padding: "12px 20px",
        marginBottom: "10px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
        transition: "all 0.3s ease",
        textAlign: "left",
      }}
        onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.3)"}
        onMouseOut={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
      >👤 Mi Perfil</button>

      {rol === "admin" && (
        <>
          <button onClick={() => navigate("/articulos")} style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            border: "none",
            padding: "12px 20px",
            marginBottom: "10px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "all 0.3s ease",
            textAlign: "left",
          }}
            onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.3)"}
            onMouseOut={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
          >📦 Artículos</button>
          <button onClick={() => navigate("/almacenes")} style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            border: "none",
            padding: "12px 20px",
            marginBottom: "10px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "all 0.3s ease",
            textAlign: "left",
          }}
            onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.3)"}
            onMouseOut={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
          >🏭 Almacenes</button>
          <button onClick={() => navigate("/usuarios")} style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            border: "none",
            padding: "12px 20px",
            marginBottom: "10px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "all 0.3s ease",
            textAlign: "left",
          }}
            onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.3)"}
            onMouseOut={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
          >👥 Usuarios</button>
          <button onClick={() => navigate("/configuracion")} style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            border: "none",
            padding: "12px 20px",
            marginBottom: "10px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "all 0.3s ease",
            textAlign: "left",
          }}
            onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.3)"}
            onMouseOut={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
          >⚙️ Configuración</button>
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
          backgroundColor: "#fff",
          color: "#843434",
          border: "2px solid #843434",
          padding: "12px 20px",
          borderRadius: "25px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "1rem",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#f8f8f8";
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#fff";
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}


