import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import { AuthContext } from "../context/AuthContext";

export default function Perfil() {
  const { usuario, token, actualizarFoto } = useContext(AuthContext);
  const [fotoURL, setFotoURL] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !usuario) {
      navigate("/");
      return;
    }

    const obtenerFoto = async () => {
      try {
        const res = await axios.get("/api/users/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFotoURL(res.data.foto);
      } catch (error) {
        console.error("Error al obtener foto:", error);
      }
    };

    obtenerFoto();
  }, [token, usuario, navigate]);

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("foto", file);

    try {
      const res = await axios.put(
        "/api/users/upload-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const nuevaFoto = res.data.foto;
      setFotoURL(nuevaFoto);
      actualizarFoto(nuevaFoto); // ✅ actualiza globalmente
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Error al subir imagen");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ padding: "2rem", marginLeft: "240px", width: "100%" }}>
        <h2>Mi Perfil</h2>
        <p><strong>Nombre:</strong> {usuario?.nombre}</p>
        <p><strong>Rol:</strong> {usuario?.rol}</p>
        <p><strong>Almacén:</strong> {usuario?.almacen?.nombre || 'N/A'}</p>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="fotoPerfil"><strong>Actualizar foto de perfil:</strong></label>
          <input id="fotoPerfil" type="file" accept="image/*" onChange={handleFoto} />
          {fotoURL && (
            <div style={{ marginTop: "1rem" }}>
              <img
                src={`${fotoURL}`}
                alt="Foto de perfil"
                style={{
                  height: "120px",
                  width: "120px",
                  borderRadius: "50%",
                  border: "2px solid #843434",
                  objectFit: "cover"
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
