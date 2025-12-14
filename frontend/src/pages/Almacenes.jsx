import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import { AuthContext } from "../context/AuthContext";

export default function Almacenes() {
  const { token, usuario } = useContext(AuthContext);
  const [almacenes, setAlmacenes] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });
  const [editId, setEditId] = useState(null);

  const obtenerAlmacenes = useCallback(async () => {
    try {
      const res = await axios.get("/api/almacenes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlmacenes(res.data);
    } catch (error) {
      console.error("Error al obtener almacenes:", error);
      alert("Error al obtener almacenes");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editId) {
        // No hay ruta para actualizar almacén, solo crear y eliminar
        alert("Editar almacén no implementado");
      } else {
        await axios.post("/api/almacenes", form, config);
      }

      setForm({ nombre: "", descripcion: "" });
      setEditId(null);
      obtenerAlmacenes();
    } catch (error) {
      console.error("Error al guardar almacén:", error);
      alert("Error al guardar almacén");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (confirm("¿Seguro que deseas eliminar este almacén?")) {
        await axios.delete(`/api/almacenes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        obtenerAlmacenes();
      }
    } catch (error) {
      console.error("Error al eliminar almacén:", error);
      alert(error.response?.data?.mensaje || `Error ${error.response?.status}: ${JSON.stringify(error.response?.data)}` || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      obtenerAlmacenes();
    }
  }, [token, obtenerAlmacenes]);

  if (!token) return null;

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ marginLeft: "240px", padding: "2rem", width: "100%" }}>
        <h2>Gestión de Almacenes</h2>
        <p>Almacén asignado: {usuario?.rol === "admin" ? "Todos" : usuario?.almacen?.nombre || "Ninguno"}</p>

        <form onSubmit={handleSubmit} style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            style={{
              padding: "1rem",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              outline: "none",
              transition: "all 0.3s ease"
            }}
            onFocus={(e) => { e.target.style.borderColor = "#843434"; e.target.style.boxShadow = "0 0 0 3px rgba(132,52,52,0.08)" }}
            onBlur={(e) => { e.target.style.borderColor = "#e9ecef"; e.target.style.boxShadow = "none" }}
          />

          <input
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            style={{
              padding: "1rem",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              outline: "none",
              transition: "all 0.3s ease"
            }}
            onFocus={(e) => { e.target.style.borderColor = "#843434"; e.target.style.boxShadow = "0 0 0 3px rgba(132,52,52,0.08)" }}
            onBlur={(e) => { e.target.style.borderColor = "#e9ecef"; e.target.style.boxShadow = "none" }}
          />

          <button
            type="submit"
            style={{
              gridColumn: "span 2",
              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              color: "white",
              border: "none",
              padding: "1rem",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(40,167,69,0.2)"
            }}
            onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 25px rgba(40,167,69,0.3)" }}
            onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 15px rgba(40,167,69,0.2)" }}
          >
            Crear Almacén
          </button>
        </form>

        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "2rem"
        }}>
          <h3 style={{
            margin: "0 0 1.5rem 0",
            color: "#2c3e50",
            fontSize: "1.5rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            Lista de Almacenes
          </h3>
          <div style={{
            overflowX: "auto"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
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
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Nombre</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Descripción</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {almacenes.map((a, index) => (
                  <tr key={a.id} style={{
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
                      padding: "1rem",
                      fontWeight: "500",
                      color: "#2c3e50"
                    }}>{a.nombre}</td>
                    <td style={{
                      padding: "1rem",
                      color: "#6c757d"
                    }}>{a.descripcion}</td>
                    <td style={{
                      padding: "1rem",
                      textAlign: "center"
                    }}>
                      <button
                        onClick={() => handleDelete(a.id)}
                        style={{
                          background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
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
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}