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
      const res = await axios.post("http://localhost:5050/api/users/login", {
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
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      gap: "2rem",
      padding: "2rem"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={logo} alt="Logo SEDIF" style={{ width: "400px" }} />
      </div>

      <form onSubmit={handleLogin} style={{
        backgroundColor: "#843434",
        padding: "2rem",
        borderRadius: "8px",
        width: "400px",
        boxShadow: "4px 4px 0 #5c1e1e",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <label htmlFor="email" style={{ color: "#fff", fontWeight: "bold" }}>Usuario</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "0.6rem",
            border: "none",
            borderRadius: "4px"
          }}
        />
        <label htmlFor="password" style={{ color: "#fff", fontWeight: "bold" }}>Contraseña</label>
        <input
          id="password"
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
          style={{
            padding: "0.6rem",
            border: "none",
            borderRadius: "4px"
          }}
        />
        <button type="submit"
          style={{
            marginTop: "1rem",
            padding: "0.6rem",
            backgroundColor: "#fff",
            color: "#843434",
            fontWeight: "bold",
            border: "2px solid #843434",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#f2f2f2"}
          onFocus={(e) => e.target.style.backgroundColor = "#f2f2f2"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#fff"}
          onBlur={(e) => e.target.style.backgroundColor = "#fff"}
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
