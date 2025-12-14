import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import TarjetaAlmacen from "../components/TarjetaAlmacen";
// removed unused ProductosAlmacen import
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function DashboardAdmin() {
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [almacenes, setAlmacenes] = useState([]);

  useEffect(() => {
    if (!token || usuario?.rol !== "admin") {
      navigate("/");
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get("/api/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = res.data;

        const almacenesMap = new Map();

        items.forEach((item) => {
          const { almacen, cantidad, updatedAt } = item;
          if (almacen) {
            if (!almacenesMap.has(almacen.id)) {
              almacenesMap.set(almacen.id, {
                id: almacen.id,
                nombre: almacen.nombre,
                descripcion: almacen.descripcion,
                icono: "",
                cantidad: 0,
                ultimaActualizacion: updatedAt,
              });
            }
            almacenesMap.get(almacen.id).cantidad += cantidad;
            if (new Date(updatedAt) > new Date(almacenesMap.get(almacen.id).ultimaActualizacion)) {
              almacenesMap.get(almacen.id).ultimaActualizacion = updatedAt;
            }
          }
        });

        // Agregar almacenes sin artículos
        const almacenesRes = await axios.get("/api/almacenes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const todosAlmacenes = almacenesRes.data;
        todosAlmacenes.forEach(alm => {
          if (!almacenesMap.has(alm.id)) {
            almacenesMap.set(alm.id, {
              id: alm.id,
              nombre: alm.nombre,
              descripcion: alm.descripcion,
              icono: "",
              cantidad: 0,
              ultimaActualizacion: null,
            });
          }
        });

        setAlmacenes(Array.from(almacenesMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre)));
      } catch (error) {
        console.error("Error al obtener los artículos:", error);
      }
    };

    fetchItems();
  }, [token, usuario, navigate]);

  if (!token || usuario?.rol !== "admin") return null;

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
          background: "linear-gradient(135deg, #843434 0%, #a04444 100%)",
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
            Panel de Administración SEDIF
          </h1>
          <p style={{
            margin: "0.5rem 0 0 0",
            fontSize: "1.2rem",
            opacity: 0.9
          }}>
            Bienvenido, {usuario?.nombre || "Administrador"}
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
            Resumen de Almacenes
          </h2>
          <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem",
              maxWidth: "1400px",
              margin: "0 auto"
            }}
          >
            {almacenes.map((almacen) => (
              <button
                key={almacen.id}
                onClick={() => navigate(`/almacen/${almacen.id}`)}
                style={{ cursor: "pointer", width: "100%", background: "none", border: "none", padding: 0, textAlign: "inherit" }}
                aria-label={`Abrir almacén ${almacen.nombre}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/almacen/${almacen.id}`); }}
              >
                <TarjetaAlmacen
                  nombre={almacen.nombre}
                  icono={almacen.icono}
                  cantidad={almacen.cantidad}
                  ultimaActualizacion={almacen.ultimaActualizacion}
                  almacenId={almacen.id}
                  descripcion={almacen.descripcion}
                  isUniformSize={true}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}