import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import { AuthContext } from "../context/AuthContext";

export default function Articulos() {
  const { token } = useContext(AuthContext);
  const [articulos, setArticulos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    categoria: "",
    cantidad: "",
    peso: "",
    almacenId: "",
    codigoBarras: "",
  });
  const [editId, setEditId] = useState(null);

  const obtenerArticulos = useCallback(async () => {
    try {
      const res = await axios.get("/api/items", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticulos(res.data);
    } catch (error) {
      console.error("Error al obtener artículos:", error);
      alert("Error al obtener artículos");
    }
  }, [token]);

  const obtenerAlmacenes = useCallback(async () => {
    try {
      const res = await axios.get("/api/almacenes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlmacenes(res.data);
    } catch (error) {
      console.error("Error al obtener almacenes:", error);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editId) {
        await axios.put(`/api/items/${editId}`, form, config);
      } else {
        await axios.post("/api/items", form, config);
      }

      setForm({ nombre: "", tipo: "", categoria: "", cantidad: "", peso: "", almacenId: "", codigoBarras: "" });
      setEditId(null);
      obtenerArticulos();
    } catch (error) {
      console.error("Error al guardar artículo:", error);
      alert("Error al guardar artículo");
    }
  };

  const handleEdit = (item) => {
    setForm({
      nombre: item.nombre,
      tipo: item.tipo,
      categoria: item.categoria,
      cantidad: item.cantidad,
      peso: item.peso,
      almacenId: item.almacenId,
      codigoBarras: item.codigoBarras || "",
    });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      if (confirm("¿Seguro que deseas eliminar este artículo?")) {
        await axios.delete(`/api/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        obtenerArticulos();
      }
    } catch (error) {
      console.error("Error al eliminar artículo:", error);
      alert("Error al eliminar artículo");
    }
  };

  useEffect(() => {
    if (token) {
      obtenerArticulos();
      obtenerAlmacenes();
    }
  }, [token, obtenerArticulos, obtenerAlmacenes]);

  if (!token) return null; // Protege si no está autenticado

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ marginLeft: "240px", padding: "2rem", width: "100%" }}>
        <h2>Gestión de Artículos</h2>

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
            {editId ? "Editar Artículo" : "Crear Nuevo Artículo"}
          </h3>
          <form onSubmit={handleSubmit} style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{
                color: "#2c3e50",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                Nombre
              </label>
              <input
                placeholder="Nombre del artículo"
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
                onFocus={(e) => {
                  e.target.style.borderColor = "#843434";
                  e.target.style.boxShadow = "0 0 0 3px rgba(132, 52, 52, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{
                color: "#2c3e50",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                Tipo
              </label>
              <input
                placeholder="Tipo de artículo"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                required
                style={{
                  padding: "1rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#843434";
                  e.target.style.boxShadow = "0 0 0 3px rgba(132, 52, 52, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{
                color: "#2c3e50",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                Categoría
              </label>
              <input
                placeholder="Categoría"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                required
                style={{
                  padding: "1rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#843434";
                  e.target.style.boxShadow = "0 0 0 3px rgba(132, 52, 52, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{
                color: "#2c3e50",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                Cantidad
              </label>
              <input
                type="number"
                placeholder="Cantidad"
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                required
                min="0"
                style={{
                  padding: "1rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#843434";
                  e.target.style.boxShadow = "0 0 0 3px rgba(132, 52, 52, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{
                color: "#2c3e50",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                Peso
              </label>
              <input
                type="number"
                placeholder="Peso (kg)"
                value={form.peso}
                onChange={(e) => setForm({ ...form, peso: e.target.value })}
                required
                min="0"
                step="0.01"
                style={{
                  padding: "1rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#843434";
                  e.target.style.boxShadow = "0 0 0 3px rgba(132, 52, 52, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{
                color: "#2c3e50",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                Código de Barras
              </label>
              <input
                type="text"
                placeholder="Código de barras (opcional)"
                value={form.codigoBarras}
                onChange={(e) => setForm({ ...form, codigoBarras: e.target.value })}
                style={{
                  padding: "1rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#843434";
                  e.target.style.boxShadow = "0 0 0 3px rgba(132, 52, 52, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{
                color: "#2c3e50",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                Almacén
              </label>
              <select
                value={form.almacenId}
                onChange={(e) => setForm({ ...form, almacenId: e.target.value })}
                required
                style={{
                  padding: "1rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#843434";
                  e.target.style.boxShadow = "0 0 0 3px rgba(132, 52, 52, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Seleccionar Almacén</option>
                {almacenes.map((alm) => (
                  <option key={alm.id} value={alm.id}>{alm.nombre}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              style={{
                gridColumn: "span 3",
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "white",
                border: "none",
                padding: "1rem",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(40, 167, 69, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(40, 167, 69, 0.3)";
              }}
            >
              {editId ? "Actualizar Artículo" : "Crear Artículo"}
            </button>
          </form>
        </div>

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
            Lista de Artículos
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
                  }}>Tipo</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Categoría</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Cantidad</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Peso</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Almacén</th>
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
                {articulos.map((a, index) => (
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
                    }}>{a.tipo}</td>
                    <td style={{
                      padding: "1rem",
                      color: "#6c757d"
                    }}>{a.categoria}</td>
                    <td style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontWeight: "600",
                      color: a.cantidad <= 10 ? "#dc3545" : a.cantidad <= 50 ? "#ffc107" : "#28a745"
                    }}>{a.cantidad}</td>
                    <td style={{
                      padding: "1rem",
                      textAlign: "center",
                      color: "#6c757d"
                    }}>{a.peso}</td>
                    <td style={{
                      padding: "1rem",
                      color: "#6c757d"
                    }}>{a.almacen ? a.almacen.nombre : 'N/A'}</td>
                    <td style={{
                      padding: "1rem",
                      textAlign: "center"
                    }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                        <button
                          onClick={() => handleEdit(a)}
                          style={{
                            background: "linear-gradient(135deg, #ffc107 0%, #e0a800 100%)",
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
                          Editar
                        </button>
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
                      </div>
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
