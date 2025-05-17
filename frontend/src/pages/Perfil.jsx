import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

export default function Perfil() {
  const { usuario } = useContext(AuthContext);
  const [fotoURL, setFotoURL] = useState("");

  const obtenerFoto = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/perfil");
      setFotoURL(res.data.foto);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("foto", file);

    try {
      const res = await axios.put("http://localhost:5000/api/users/upload-profile", formData);
      setFotoURL(res.data.foto);
    } catch (error) {
      console.error(error);
      alert("Error al subir imagen");
    }
  };

  useEffect(() => {
    obtenerFoto();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <h2>Mi Perfil</h2>
        <p>Nombre: {usuario.nombre}</p>
        <p>Rol: {usuario.rol}</p>
        <p>Almacén: {usuario.almacen}</p>

        <div style={{ marginTop: "1rem" }}>
          <label>Actualizar foto de perfil:</label>
          <input type="file" accept="image/*" onChange={handleFoto} />
          {fotoURL && (
            <div style={{ marginTop: "1rem" }}>
              <img src={`http://localhost:5000${fotoURL}`} alt="Foto de perfil" height={120} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
