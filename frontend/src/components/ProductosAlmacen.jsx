import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

export default function ProductosAlmacen({ almacenId: propAlmacenId, onSelectProducto }) {
  const { id: paramId } = useParams();
  const almacenId = propAlmacenId || paramId;
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setCargando(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/items", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const filtrados = res.data.filter((item) => item.almacenId === parseInt(almacenId));
        setProductos(filtrados);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("Error al cargar productos");
      } finally {
        setCargando(false);
      }
    };

    if (almacenId) {
      obtenerProductos();
    } else {
      setError("Almacén no especificado");
      setCargando(false);
    }
  }, [almacenId]);

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      marginTop: "1rem"
    }}>
      {productos.length === 0 ? (
        <p style={{
          textAlign: "center",
          color: "#6c757d",
          fontSize: "1.1rem",
          padding: "2rem"
        }}>No se encontraron productos para este almacén.</p>
      ) : (
        <div style={{
          overflowX: "auto"
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
          }}>
          <thead>
            <tr style={{
              background: "linear-gradient(135deg, #843434 0%, #a04444 100%)",
              color: "white"
            }}>
              <th style={{
                padding: "1rem 0.75rem",
                textAlign: "left",
                fontWeight: "600",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Nombre</th>
              <th style={{
                padding: "1rem 0.75rem",
                textAlign: "left",
                fontWeight: "600",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Categoría</th>
              <th style={{
                padding: "1rem 0.75rem",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Cantidad</th>
              <th style={{
                padding: "1rem 0.75rem",
                textAlign: "left",
                fontWeight: "600",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Última actualización</th>
              <th style={{
                padding: "1rem 0.75rem",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, index) => (
              <tr key={p.id} style={{
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                transition: "all 0.2s ease",
                borderBottom: "1px solid #e9ecef"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f1f3f4";
                e.currentTarget.style.transform = "scale(1.01)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f8f9fa";
                e.currentTarget.style.transform = "scale(1)";
              }}
              >
                <td style={{
                  padding: "0.75rem",
                  fontWeight: "500",
                  color: "#2c3e50"
                }}>{p.nombre}</td>
                <td style={{
                  padding: "0.75rem",
                  color: "#6c757d"
                }}>{p.categoria}</td>
                <td style={{
                  padding: "0.75rem",
                  textAlign: "center",
                  fontWeight: "600",
                  color: p.cantidad <= 10 ? "#dc3545" : p.cantidad <= 50 ? "#ffc107" : "#28a745"
                }}>{p.cantidad}</td>
                <td style={{
                  padding: "0.75rem",
                  color: "#6c757d",
                  fontSize: "0.9rem"
                }}>
                  {new Date(p.updatedAt).toLocaleString()}
                </td>
                <td style={{
                  padding: "0.75rem",
                  textAlign: "center"
                }}>
                  {onSelectProducto && (
                    <button
                      onClick={() => onSelectProducto(p)}
                      style={{
                        background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                      }}
                    >
                      📤 Salida
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

ProductosAlmacen.propTypes = {
  almacenId: PropTypes.string,
  onSelectProducto: PropTypes.func,
};