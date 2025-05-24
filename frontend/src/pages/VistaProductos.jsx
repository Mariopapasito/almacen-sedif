import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import ProductosAlmacen from "../components/ProductosAlmacen";
import { AuthContext } from "../context/AuthContext";

export default function VistaProductos() {
  const { id } = useParams();
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

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
      <div style={{ marginLeft: "220px", padding: "2rem", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>
            Bienvenido, {usuario.nombre} | Almacén {id}
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
        <ProductosAlmacen almacenId={id} />
      </div>
    </div>
  );
}