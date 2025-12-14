import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import { AuthContext } from "../context/AuthContext";

export default function Usuarios() {
  const { usuario, token } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contraseña: "",
    rol: "almacenista",
    almacenId: "",
  });
  const [editId, setEditId] = useState(null);

  const obtenerUsuarios = useCallback(async () => {
    try {
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert("Error al obtener usuarios");
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
      const data = { ...form };
      if (data.rol === "admin") data.almacenId = null;
      if (editId === usuario.id && data.rol !== "admin") {
        alert("No puedes cambiar tu propio rol de administrador.");
        return;
      }
      if (editId) {
        await axios.put(`/api/users/${editId}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("/api/users/register", data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({ nombre: "", email: "", contraseña: "", rol: "almacenista", almacenId: "" });
      setEditId(null);
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Error al guardar usuario");
    }
  };

  const handleEdit = (usuario) => {
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      contraseña: "",
      rol: usuario.rol,
      almacenId: usuario.almacenId || "",
    });
    setEditId(usuario.id);
  };

  const handleDelete = async (id) => {
    if (id === usuario.id) {
      alert("No puedes eliminar tu propio usuario.");
      return;
    }
    try {
      if (confirm("¿Eliminar este usuario?")) {
        await axios.delete(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        obtenerUsuarios();
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario");
    }
  };

  useEffect(() => {
    if (token) {
      obtenerUsuarios();
      obtenerAlmacenes();
    }
  }, [token, obtenerUsuarios, obtenerAlmacenes]);

  if (!token || usuario?.rol !== "admin") return null; // 🔐 evita mostrar si no hay permiso

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ padding: "2rem", marginLeft: "240px", width: "100%" }}>
        <h2>Gestión de Usuarios</h2>

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
            {editId ? "Editar Usuario" : "Crear Nuevo Usuario"}
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
                placeholder="Nombre completo"
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
                Correo
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.contraseña}
                onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
                required={!editId}
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
                Rol
              </label>
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
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
                <option value="almacenista">Almacenista</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {form.rol === "almacenista" && (
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
            )}

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
              {editId ? "Actualizar Usuario" : "Crear Usuario"}
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
            Lista de Usuarios
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
                  }}>Email</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Rol</th>
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
                {usuarios.map((u, index) => (
                  <tr key={u.id} style={{
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
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {u.foto && <img src={`${u.foto}`} alt="Foto" style={{ width: '35px', height: '35px', borderRadius: '50%', marginRight: '10px', border: '2px solid #e9ecef' }} />}
                        {u.nombre}
                      </div>
                    </td>
                    <td style={{
                      padding: "1rem",
                      color: "#6c757d"
                    }}>{u.email}</td>
                    <td style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontWeight: "600",
                      color: u.rol === "admin" ? "#dc3545" : "#28a745"
                    }}>{u.rol}</td>
                    <td style={{
                      padding: "1rem",
                      color: "#6c757d"
                    }}>{u.almacen ? u.almacen.nombre : 'N/A'}</td>
                    <td style={{
                      padding: "1rem",
                      textAlign: "center"
                    }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                        <button
                          onClick={() => handleEdit(u)}
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
                          onClick={() => handleDelete(u.id)}
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
