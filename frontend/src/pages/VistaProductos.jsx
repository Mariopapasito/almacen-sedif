import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import ProductosAlmacen from "../components/ProductosAlmacen";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function VistaProductos() {
  const { id } = useParams();
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const [almacenNombre, setAlmacenNombre] = useState("");

  useEffect(() => {
    const obtenerAlmacen = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/almacenes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlmacenNombre(res.data.nombre);
      } catch (error) {
        console.error("Error al obtener almacén:", error);
        setAlmacenNombre("Desconocido");
      }
    };

    obtenerAlmacen();
  }, [id]);

  const volver = () => {
    if (usuario.rol === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard-almacenista");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ marginLeft: "240px", padding: "2rem", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>
            Bienvenido, {usuario.nombre} | Almacén {almacenNombre || id}
          </h2>
          <button
            onClick={volver}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#003366",
              color: "white",
              cursor: "pointer",
            }}
          >
            ⬅ Volver
          </button>
        </div>
        <hr style={{ margin: "1rem 0" }} />
        {/* ✅ Se pasa el ID del almacén como prop */}
        <ProductosAlmacen almacenId={id} onSelectProducto={(producto) => navigate('/vales', { state: { productoSeleccionado: producto } })} />
      </div>
    </div>
  );
}