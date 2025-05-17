import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        contraseña
      });
      login(res.data.usuario, res.data.token);
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      alert("Correo o contraseña incorrecta");
    }
  };

  const logo = localStorage.getItem("logo") || "/logo-sedif.png";

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      backgroundColor: "#fff"
    }}>
      {/* IZQUIERDA - LOGO */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <img
          src={logo}
          alt="Logo SEDIF"
          style={{ width: "200px" }}
        />
      </div>

      {/* DERECHA - FORMULARIO */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          backgroundColor: "#843434",
          padding: "2rem",
          borderRadius: "5px",
          width: "320px",
          boxShadow: "4px 4px 0 #5c1e1e",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <label htmlFor="email" style={{ color: "#fff", textAlign: "left", fontWeight: "bold" }}>
            Usuario
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "0.6rem",
              border: "none",
              borderRadius: "3px"
            }}
          />
          <label htmlFor="password" style={{ color: "#fff", textAlign: "left", fontWeight: "bold" }}>
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
            style={{
              padding: "0.6rem",
              border: "none",
              borderRadius: "3px"
            }}
          />
          <button type="submit"
            onClick={handleLogin}
            style={{
              marginTop: "1rem",
              padding: "0.6rem",
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: "bold",
              border: "2px solid black",
              cursor: "pointer"
            }}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
