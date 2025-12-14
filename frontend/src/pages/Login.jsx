import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const logo = localStorage.getItem("logo") || "/logo-sedif.png";

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    try {
      const res = await axios.post("/api/users/login", {
        email,
        contraseña
      });

      const usuario = res.data.usuario;
      const token = res.data.token;

      if (!usuario || !token) {
        throw new Error("Datos de sesión incompletos");
      }

      login(usuario, token);

      // ✅ Redirección por rol
      if (usuario.rol === "admin") {
        navigate("/dashboard");
      } else if (usuario.rol === "almacenista") {
        navigate("/dashboard-almacenista");
      } else {
        navigate("/vales");
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      alert("Correo o contraseña incorrecta");
    }
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      gap: "3rem",
      padding: "2rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: "2rem",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
        }}>
          <img
            src={logo}
            alt="Logo SEDIF"
            style={{
              width: "300px",
              height: "auto",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
            }}
          />
          <h1 style={{
            color: "#000000",
            margin: "1rem 0 0 0",
            fontSize: "2rem",
            fontWeight: "300",
            textShadow: "none"
          }}>
            Sistema de Gestión de Almacén
          </h1>
          <p style={{
            color: "#6c757d",
            margin: "0.5rem 0 0 0",
            fontSize: "1.1rem"
          }}>
            SEDIF - Gestión Eficiente de Inventarios
          </p>
        </div>
      </div>

      <form onSubmit={handleLogin} style={{
        background: "rgba(255,255,255,0.95)",
        padding: "2.5rem",
        borderRadius: "20px",
        width: "420px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2 style={{
            color: "#2c3e50",
            margin: 0,
            fontSize: "1.8rem",
            fontWeight: "600"
          }}>
            Iniciar Sesión
          </h2>
          <p style={{
            color: "#6c757d",
            margin: "0.5rem 0 0 0",
            fontSize: "0.95rem"
          }}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="email" style={{
            color: "#2c3e50",
            fontWeight: "600",
            fontSize: "0.95rem"
          }}>
            👤 Usuario
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="correo@ejemplo.com"
            style={{
              padding: "1rem",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              outline: "none"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#843434";
              e.target.style.boxShadow = "0 0 0 3px rgba(132, 52, 52, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e9ecef";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="password" style={{
            color: "#2c3e50",
            fontWeight: "600",
            fontSize: "0.95rem"
          }}>
            🔒 Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
            placeholder="••••••••"
            style={{
              padding: "1rem",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              outline: "none"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#843434";
              e.target.style.boxShadow = "0 0 0 3px rgba(132, 52, 52, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e9ecef";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <button type="submit"
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "linear-gradient(135deg, #843434 0%, #a04444 100%)",
            color: "white",
            fontWeight: "600",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(132, 52, 52, 0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 25px rgba(132, 52, 52, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(132, 52, 52, 0.3)";
          }}
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
