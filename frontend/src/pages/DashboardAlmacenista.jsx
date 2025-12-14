import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import TarjetaAlmacen from "../components/TarjetaAlmacen";
// import ProductosAlmacen from "../components/ProductosAlmacen";
import { AuthContext } from "../context/AuthContext";
// Removed commented import for ProductosAlmacen to satisfy lint.
import axios from "axios";

export default function DashboardAlmacenista() {
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [cantidad, setCantidad] = useState(0);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  useEffect(() => {
    if (!token || usuario?.rol !== "almacenista") {
      navigate("/");
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get("/api/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const itemsAlmacen = res.data.filter(item => item.almacenId === usuario.almacenId);
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
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
    }}>
      <MenuLateral />
      <div style={{
        marginLeft: "240px",
        padding: "2rem",
        width: "100%",
        flex: 1
      }}>
        <div style={{
          background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          textAlign: "center"
        }}>
          <h1 style={{
            margin: 0,
            fontSize: "2.5rem",
            fontWeight: "700",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
          }}>
            Panel de Almacenista SEDIF
          </h1>
          <p style={{
            margin: "0.5rem 0 0 0",
            fontSize: "1.2rem",
            opacity: 0.9
          }}>
            Bienvenido, {usuario?.nombre || "Almacenista"}
          </p>
        </div>

        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "2rem"
        }}>
          <h2 style={{
            margin: "0 0 1.5rem 0",
            color: "#2c3e50",
            fontSize: "1.8rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            Mi Almacén
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
            maxWidth: "1400px",
            margin: "0 auto"
          }}>
            <button
              onClick={() => navigate(`/almacen/${usuario.almacenId}`)}
              style={{ cursor: "pointer", width: "100%", background: "none", border: "none", padding: 0, textAlign: "inherit" }}
              aria-label={`Abrir almacén ${usuario.almacen?.nombre || 'N/A'}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/almacen/${usuario.almacenId}`); }}
            >
              <TarjetaAlmacen
                nombre={usuario.almacen?.nombre || 'N/A'}
                icono=""
                cantidad={cantidad}
                ultimaActualizacion={ultimaActualizacion}
                almacenId={usuario.almacenId}
                descripcion={usuario.almacen?.descripcion}
                isUniformSize={true}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
