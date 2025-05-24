import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import TarjetaAlmacen from "../components/TarjetaAlmacen";
import ProductosAlmacen from "../components/ProductosAlmacen";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function DashboardAlmacenista() {
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [cantidad, setCantidad] = useState(0);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [mostrarProductos, setMostrarProductos] = useState(false);

  useEffect(() => {
    if (!token || usuario?.rol !== "almacenista") {
      navigate("/");
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const itemsAlmacen = res.data.filter(item => item.almacen === usuario.almacen);
        const totalCantidad = itemsAlmacen.reduce((sum, item) => sum + item.cantidad, 0);
        const ultimaFecha = itemsAlmacen.reduce((fecha, item) => {
          const itemDate = new Date(item.updatedAt);
          return itemDate > new Date(fecha) ? itemDate : fecha;
        }, itemsAlmacen[0]?.updatedAt || new Date());

        setCantidad(totalCantidad);
        setUltimaActualizacion(ultimaFecha);
      } catch (error) {
        console.error("Error al obtener los artículos:", error);
      }
    };

    fetchItems();
  }, [token, usuario, navigate, location.pathname]);

  if (!token || usuario?.rol !== "almacenista") return null;

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ marginLeft: "220px", padding: "2rem", width: "100%" }}>
        <h2>Bienvenido, {usuario.nombre}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
          <div
            onClick={() => setMostrarProductos(!mostrarProductos)}
            style={{ cursor: "pointer" }}
          >
            <TarjetaAlmacen
              nombre={`Almacén ${usuario.almacen}`}
              icono="📦"
              cantidad={cantidad}
              ultimaActualizacion={ultimaActualizacion}
              almacen={usuario.almacen} // ✅ para vista de productos
            />
          </div>
        </div>

        {mostrarProductos && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>
              Productos del almacén {usuario.almacen}
            </h3>
            <ProductosAlmacen almacenId={usuario.almacen} />
          </div>
        )}
      </div>
    </div>
  );
}
