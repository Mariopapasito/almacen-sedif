import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import TarjetaAlmacen from "../components/TarjetaAlmacen";
import ProductosAlmacen from "../components/ProductosAlmacen";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function DashboardAdmin() {
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [almacenes, setAlmacenes] = useState([]);
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null);

  useEffect(() => {
    if (!token || usuario?.rol !== "admin") {
      navigate("/");
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = res.data;

        const almacenesMap = {};

        items.forEach((item) => {
          const { almacen, cantidad, updatedAt } = item;
          if (!almacenesMap[almacen]) {
            almacenesMap[almacen] = {
              id: almacen,
              nombre: `Almacén ${almacen}`,
              icono: "📦",
              cantidad: 0,
              ultimaActualizacion: updatedAt,
            };
          }
          almacenesMap[almacen].cantidad += cantidad;

          if (new Date(updatedAt) > new Date(almacenesMap[almacen].ultimaActualizacion)) {
            almacenesMap[almacen].ultimaActualizacion = updatedAt;
          }
        });

        setAlmacenes(Object.values(almacenesMap));
      } catch (error) {
        console.error("Error al obtener los artículos:", error);
      }
    };

    fetchItems();
  }, [token, usuario, navigate]);

  if (!token || usuario?.rol !== "admin") return null;

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ marginLeft: "220px", padding: "2rem", width: "100%" }}>
        <h2>Bienvenido, administrador</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {almacenes.map((almacen) => (
            <div
              key={almacen.id}
              onClick={() => setAlmacenSeleccionado(almacen.id)}
              style={{ cursor: "pointer" }}
            >
              <TarjetaAlmacen
                nombre={almacen.nombre}
                icono={almacen.icono}
                cantidad={almacen.cantidad}
                ultimaActualizacion={almacen.ultimaActualizacion}
                almacen={almacen.id}
              />
            </div>
          ))}
        </div>

        {almacenSeleccionado && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Productos en el almacén {almacenSeleccionado}</h3>
            <ProductosAlmacen almacenId={almacenSeleccionado} />
          </div>
        )}
      </div>
    </div>
  );
}