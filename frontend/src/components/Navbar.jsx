import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Navbar() {
  const { usuario, token, logout } = useContext(AuthContext);
  const [fotoPerfil, setFotoPerfil] = useState("");

  useEffect(() => {
    const obtenerFoto = async () => {
      try {
        const res = await axios.get("/api/users/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFotoPerfil(`${res.data.foto}`);
      } catch (error) {
        console.error("Error al obtener la foto de perfil:", error);
      }
    };

    if (token) obtenerFoto();
  }, [token]);

  return (
    <nav
      style={{
        padding: "1rem",
        backgroundColor: "#eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>Sistema SEDIF</div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {fotoPerfil && (
          <img
            src={fotoPerfil}
            alt="Perfil"
            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
          />
        )}
        <span>{usuario?.nombre}</span>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}
