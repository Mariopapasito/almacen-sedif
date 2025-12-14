import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import { AuthContext } from "../context/AuthContext";

export default function Configuracion() {
  const [logo, setLogo] = useState(null);
  const [color, setColor] = useState(localStorage.getItem("colorPrincipal") || "#eeeeee");

  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || usuario?.rol !== "admin") {
      navigate("/");
    }
  }, [token, usuario, navigate]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("logo", reader.result);
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (e) => {
    const nuevoColor = e.target.value;
    localStorage.setItem("colorPrincipal", nuevoColor);
    setColor(nuevoColor);
    document.documentElement.style.setProperty("--color-principal", nuevoColor);
  };

  useEffect(() => {
    const logoGuardado = localStorage.getItem("logo");
    if (logoGuardado) setLogo(logoGuardado);
    document.documentElement.style.setProperty("--color-principal", color);
  }, [color]);

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ padding: "2rem", marginLeft: "240px", width: "100%" }}>
        <h2>Configuración del Sistema</h2>

        <div>
          <label htmlFor="logo-input">Subir logo:</label>
          <input id="logo-input" type="file" accept="image/*" onChange={handleLogoChange} />
          {logo && <img src={logo} alt="Logo" height={60} style={{ marginTop: "1rem" }} />}
        </div>

        <div style={{ marginTop: "2rem" }}>
          <label htmlFor="color-input">Color de interfaz:</label>
          <input id="color-input" type="color" value={color} onChange={handleColorChange} />
        </div>
      </div>
    </div>
  );
}
