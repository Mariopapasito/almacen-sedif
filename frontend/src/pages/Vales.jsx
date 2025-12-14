import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import { AuthContext } from "../context/AuthContext";

export default function Vales() {
  const { usuario, token } = useContext(AuthContext);
  const [vales, setVales] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState(usuario?.almacenId || "");
  const [productos, setProductos] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [form, setForm] = useState({
    recibidoPor: "",
    producto: "",
    cantidad: 1,
  });
  const [selectedItems, setSelectedItems] = useState([]); // {nombre, cantidad, codigoBarras?}
  const [barcode, setBarcode] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const obtenerVales = useCallback(async () => {
    try {
      const res = await axios.get("/api/vales", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let todos = res.data;

      if (fechaInicio || fechaFin) {
        const inicio = fechaInicio ? new Date(fechaInicio + "T00:00:00") : new Date("1970-01-01");
        const fin = fechaFin ? new Date(fechaFin + "T23:59:59") : new Date();
        todos = todos.filter((v) => {
          const fechaVale = new Date(v.fecha);
          return fechaVale >= inicio && fechaVale <= fin;
        });
      }

      setVales(todos);
    } catch (error) {
      console.error(error);
      alert("Error al obtener vales");
    }
  }, [token, fechaInicio, fechaFin]);

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

  const obtenerProductos = useCallback(async () => {
    try {
      const res = await axios.get("/api/items", {
        headers: { Authorization: `Bearer ${token}` }
      });
      let items = res.data;
      if (usuario?.rol !== "admin") {
        items = items.filter(item => item.almacenId === usuario.almacenId);
      }
      setProductos(items);
      setProductosFiltrados(items);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }, [token, usuario?.almacenId, usuario?.rol]);

  useEffect(() => {
    obtenerVales();
    obtenerAlmacenes();
    obtenerProductos();
  }, [obtenerVales, obtenerAlmacenes, obtenerProductos]);

  useEffect(() => {
    obtenerVales();
  }, [fechaInicio, fechaFin, obtenerVales]);

  useEffect(() => {
    if (location.state?.productoSeleccionado) {
      const producto = location.state.productoSeleccionado;
      setForm(prev => ({ ...prev, producto: producto.nombre }));
      if (usuario.rol === "admin") {
        setAlmacenSeleccionado(producto.almacenId);
      }
      // Limpiar el state para no repetir
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate, usuario.rol]);

  useEffect(() => {
    if (busquedaProducto) {
      const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        p.tipo.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busquedaProducto.toLowerCase())
      );
      setProductosFiltrados(filtrados);
    } else {
      setProductosFiltrados(productos);
    }
  }, [busquedaProducto, productos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((selectedItems.length === 0 && (!form.producto || !form.cantidad || form.cantidad < 1)) || !form.recibidoPor) {
      return alert("Agrega al menos un producto con cantidad válida y especifica 'Recibido por'");
    }

    const almacenId = usuario.rol === "admin" ? almacenSeleccionado : usuario.almacenId;

    if (!almacenId) {
      return alert("Debe seleccionar un almacén");
    }

    try {
      // Validar y limpiar items antes de enviar
      const items = selectedItems.length > 0
        ? selectedItems
            .map(it => {
              const cantidad = typeof it.cantidad === "number" ? it.cantidad : (it.cantidad === "" ? 0 : Number(it.cantidad));
              return { 
                nombre: it.nombre.trim(), 
                cantidad: cantidad,
                codigoBarras: it.codigoBarras || undefined,
                almacenId: it.almacenId
              };
            })
            .filter(it => it.cantidad > 0 && !isNaN(it.cantidad)) // Filtrar items con cantidad 0, vacía o NaN
        : [{ 
            nombre: form.producto.trim(), 
            cantidad: typeof form.cantidad === "number" ? form.cantidad : Number(form.cantidad) 
          }];
      
      if (items.length === 0) {
        return alert("Debes agregar al menos un producto con cantidad mayor a 0");
      }
      
      // Verificar que todos los items tengan cantidad válida
      const itemsInvalidos = items.filter(it => !it.cantidad || it.cantidad <= 0 || isNaN(it.cantidad));
      if (itemsInvalidos.length > 0) {
        return alert("Todos los productos deben tener una cantidad válida mayor a 0");
      }
      
      const datos = {
        items,
        recibidoPor: form.recibidoPor.trim(),
        almacenId,
      };
      
      console.log("Enviando datos al backend:", datos);

      await axios.post("/api/vales", datos, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({ recibidoPor: "", producto: "", cantidad: 1 });
      setSelectedItems([]);

      obtenerVales();
      setAlmacenSeleccionado(usuario?.almacenId || "");
      alert("Vale registrado correctamente");
    } catch (error) {
      console.error("Error al registrar vale:", error);
      const mensajeError = error.response?.data?.mensaje || error.response?.data?.error || error.message || "Error desconocido";
      alert(`Error al registrar vale: ${mensajeError}`);
    }
  };

  const seleccionarProducto = (producto) => {
    const cantidadAgregar = typeof form.cantidad === "number" ? Math.max(0, form.cantidad) : 0;
    setSelectedItems(prev => {
      const existing = prev.find(p => p.nombre.toLowerCase() === producto.nombre.toLowerCase());
      if (existing) {
        return prev.map(p => p.nombre.toLowerCase() === producto.nombre.toLowerCase() ? { ...p, cantidad: p.cantidad + cantidadAgregar } : p);
      }
      return [...prev, { nombre: producto.nombre, cantidad: cantidadAgregar, codigoBarras: producto.codigoBarras, almacenId: producto.almacenId }];
    });
    
    // Seleccionar automáticamente el almacén del producto
    if (usuario.rol === "admin") {
      setAlmacenSeleccionado(producto.almacenId);
      console.log("Almacén seleccionado automáticamente:", producto.almacenId);
    }
    setBusquedaProducto("");
  };

  const agregarPorCodigoBarras = () => {
    if (!barcode) return;
    
    // Recargar productos para asegurar que tenemos la lista más actualizada
    obtenerProductos().then(() => {
      // Buscar el producto por código de barras sin filtrar por almacén primero (case-insensitive)
      const producto = productos.find(p => p.codigoBarras && p.codigoBarras.toLowerCase() === barcode.toLowerCase());
      if (!producto) {
        alert("Producto no encontrado por código de barras. Asegúrate de que el producto existe y tiene código de barras asignado.");
        return;
      }
      
      // Si es admin, seleccionar automáticamente el almacén del producto
      if (usuario.rol === "admin") {
        setAlmacenSeleccionado(producto.almacenId);
      }
      
      const cantidadAgregar = typeof form.cantidad === "number" ? Math.max(0, form.cantidad) : 0;
      setSelectedItems(prev => {
        const existing = prev.find(p => p.nombre.toLowerCase() === producto.nombre.toLowerCase());
        if (existing) {
          return prev.map(p => p.nombre.toLowerCase() === producto.nombre.toLowerCase() ? { ...p, cantidad: p.cantidad + cantidadAgregar } : p);
        }
      
        return [...prev, { nombre: producto.nombre, cantidad: cantidadAgregar, codigoBarras: producto.codigoBarras, almacenId: producto.almacenId }];
      });
      
      setBarcode("");
    });
  };



  const descargarPDF = async (id) => {
    try {
      const response = await fetch(`/api/vales/pdf/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await response.blob();
      const url = globalThis.URL.createObjectURL(blob);
      globalThis.open(url, "_blank");
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("No se pudo descargar el PDF");
    }
  };

  const eliminarVale = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este vale?")) return;
    try {
      await axios.delete(`/api/vales/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Vale eliminado correctamente");
      obtenerVales();
    } catch (error) {
      console.error("Error al eliminar vale:", error);
      alert("Error al eliminar vale");
    }
  };

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
            Gestión de Vales de Salida
          </h1>
          <p style={{
            margin: "0.5rem 0 0 0",
            fontSize: "1.2rem",
            opacity: 0.9
          }}>
            Registra y administra las salidas de productos del almacén
          </p>
        </div>

        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "2rem"
        }}>
          <h3 style={{
            margin: "0 0 1rem 0",
            color: "#2c3e50",
            fontSize: "1.5rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            Buscar Producto para Salida
          </h3>
          <input
            type="text"
            placeholder="Buscar producto por nombre, tipo o categoría..."
            aria-label="Buscar producto"
            value={busquedaProducto}
            onChange={(e) => setBusquedaProducto(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              marginBottom: "1rem",
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
          {busquedaProducto && productosFiltrados.length > 0 && (
            <div style={{
              maxHeight: "250px",
              overflowY: "auto",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              backgroundColor: "white",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}>
              {productosFiltrados.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => seleccionarProducto(p)}
                  style={{
                    cursor: "pointer",
                    padding: "1rem",
                    borderBottom: "1px solid #f8f9fa",
                    transition: "all 0.2s ease",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    color: "#2c3e50"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#f8f9fa"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  onFocus={(e) => { e.currentTarget.style.backgroundColor = "#f8f9fa"; }}
                  onBlur={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <div>
                    <strong>{p.nombre}</strong> - {p.categoria}
                  </div>
                  <div style={{
                    color: p.cantidad <= 10 ? "#dc3545" : p.cantidad <= 50 ? "#ffc107" : "#28a745",
                    fontWeight: "600"
                  }}>
                    Cant: {p.cantidad}
                  </div>
                </button>
              ))}
            </div>
          )}
          {busquedaProducto && productosFiltrados.length === 0 && (
            <p style={{
              textAlign: "center",
              color: "#6c757d",
              padding: "2rem",
              fontSize: "1.1rem"
            }}>
              No se encontraron productos que coincidan con la búsqueda.
            </p>
          )}
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
            Registrar Nuevo Vale de Salida
          </h3>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: usuario.rol === "admin" ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
              gap: "1rem",
              alignItems: "end"
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#2c3e50" }}>Productos seleccionados</h4>
              {selectedItems.length === 0 ? (
                <p style={{ color: "#6c757d" }}>No hay productos agregados todavía. Usa la búsqueda o el código de barras.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
                  {selectedItems.map((it, idx) => {
                    const productoInfo = productos.find(p => p.nombre.toLowerCase() === it.nombre.toLowerCase());
                    const stockDisponible = productoInfo ? productoInfo.cantidad : 0;
                    const stockColor = stockDisponible <= 10 ? "#dc3545" : stockDisponible <= 50 ? "#ffc107" : "#28a745";
                    return (
                      <div key={`${it.nombre}-${idx}`} style={{ border: "1px solid #e9ecef", borderRadius: 8, padding: "0.75rem", background: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <div style={{ fontWeight: 600 }}>{it.nombre}</div>
                          <div style={{ fontSize: "0.95rem", color: stockColor, fontWeight: 600 }}>
                            {stockDisponible}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                          <label htmlFor={`cantidad-${idx}`} style={{ color: "#2c3e50", fontSize: "0.9rem" }}>Cantidad</label>
                          <input
                            id={`cantidad-${idx}`}
                            type="number"
                            min="0"
                            max={stockDisponible}
                            value={it.cantidad}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Permitir vacío para que el usuario pueda borrar y editar libremente
                              const val = value === "" ? "" : Math.max(0, Number(value));
                              setSelectedItems(prev => prev.map((p,i) => i===idx ? { ...p, cantidad: val } : p));
                            }}
                            style={{ width: "100px", padding: "0.5rem", border: "2px solid #e9ecef", borderRadius: 8 }}
                          />
                          <button type="button" onClick={() => setSelectedItems(prev => prev.filter((_,i)=>i!==idx))} style={{
                            marginLeft: "auto",
                            background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 0.75rem",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}>Quitar</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="productoManualInput" style={{ color: "#2c3e50", fontWeight: "600", fontSize: "0.95rem" }}>Producto (manual)</label>
              <input
                id="productoManualInput"
                placeholder="Nombre de producto"
                value={form.producto}
                onChange={(e) => setForm({ ...form, producto: e.target.value })}
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
              <label htmlFor="cantidadManualInput" style={{ color: "#2c3e50", fontWeight: "600", fontSize: "0.95rem" }}>Cantidad</label>
              <input
                id="cantidadManualInput"
                type="number"
                min="0"
                value={form.cantidad}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm(prev => ({ ...prev, cantidad: value === "" ? "" : Number(value) }));
                }}
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

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="button" onClick={() => {
                const nombre = (form.producto || "").trim();
                const cantidadAgregar = typeof form.cantidad === "number" ? Math.max(0, form.cantidad) : 0;
                if (!nombre) {
                  alert("Especifica el nombre del producto manualmente");
                  return;
                }
                // Buscar el producto en la lista para obtener su almacenId
                const productoEncontrado = productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
                const almacenIdProducto = productoEncontrado ? productoEncontrado.almacenId : (usuario.rol === "admin" ? almacenSeleccionado : usuario.almacenId);
                
                setSelectedItems(prev => {
                  const existing = prev.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
                  if (existing) {
                    return prev.map(p => p.nombre.toLowerCase() === nombre.toLowerCase() ? { ...p, cantidad: p.cantidad + cantidadAgregar } : p);
                  }
                  return [...prev, { nombre, cantidad: cantidadAgregar, almacenId: almacenIdProducto }];
                });
                setForm(prev => ({ ...prev, producto: "" }));
              }} style={{
                background: "linear-gradient(135deg, #843434 0%, #a04444 100%)",
                color: "white",
                border: "none",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600
              }}>Agregar a la lista</button>
            </div>
            {usuario.rol === "admin" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label htmlFor="almacenSelect" style={{
                  color: "#2c3e50",
                  fontWeight: "600",
                  fontSize: "0.95rem"
                }}>
                  Almacén
                </label>
                <select
                  id="almacenSelect"
                  value={almacenSeleccionado}
                  onChange={(e) => setAlmacenSeleccionado(e.target.value)}
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
                >
                  <option value="">-- Selecciona almacén --</option>
                  {almacenes.map((alm) => (
                    <option key={alm.id} value={alm.id}>{alm.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sección de producto/cantidad única removida para multi-selección */}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="codigoBarrasInput" style={{ color: "#2c3e50", fontWeight: "600", fontSize: "0.95rem" }}>Código de barras</label>
              <input
                id="codigoBarrasInput"
                placeholder="Código de barras (Enter para agregar)"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    agregarPorCodigoBarras();
                  }
                }}
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
              <label htmlFor="recibidoPorInput" style={{
                color: "#2c3e50",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                Recibido por
              </label>
              <input
                id="recibidoPorInput"
                placeholder="Recibido por"
                value={form.recibidoPor}
                onChange={(e) => setForm({ ...form, recibidoPor: e.target.value })}
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

            <button type="submit" style={{
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
              letterSpacing: "0.5px",
              gridColumn: "1 / -1"
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
              Registrar Salida
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
            margin: "0 0 1rem 0",
            color: "#2c3e50",
            fontSize: "1.5rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            Filtrar por Fecha
          </h3>
          <div style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="fechaInicio" style={{
                color: "#2c3e50",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                Desde
              </label>
              <input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                style={{
                  padding: "0.75rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
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
            <div style={{
              alignSelf: "flex-end",
              marginBottom: "0.5rem",
              color: "#6c757d",
              fontWeight: "500"
            }}>
              hasta
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="fechaFin" style={{
                color: "#2c3e50",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                Hasta
              </label>
              <input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                style={{
                  padding: "0.75rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
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
            <button type="button" onClick={obtenerVales} style={{
              background: "linear-gradient(135deg, #843434 0%, #a04444 100%)",
              color: "white",
              border: "none",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600
            }}>Aplicar filtro</button>
          </div>
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
            Lista de Vales
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
                  }}>Productos</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Cantidades</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Entregado por</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Recibido por</th>
                  {usuario.rol === "admin" && (
                    <th style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Almacenes</th>
                  )}
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Fecha</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>PDF</th>
                  {usuario.rol === "admin" && (
                    <th style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Eliminar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {vales.map((v, index) => (
                  <tr key={v.id} style={{
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
                      {(v.items || []).map((it, idx) => (
                        <div key={idx} style={{ marginBottom: "0.25rem" }}>
                          {it.nombre}
                        </div>
                      ))}
                    </td>
                    <td style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontWeight: "600",
                      color: v.cantidad <= 10 ? "#dc3545" : "#28a745"
                    }}>{(v.items || []).map(it => `${it.cantidad}`).join(', ')}</td>
                    <td style={{
                      padding: "1rem",
                      color: "#6c757d"
                    }}>{v.entregadoPor.nombre}</td>
                    <td style={{
                      padding: "1rem",
                      color: "#6c757d"
                    }}>{v.recibidoPor}</td>
                    {usuario.rol === "admin" && (
                      <td style={{
                        padding: "1rem",
                        color: "#6c757d"
                      }}>
                        {(() => {
                          const almacenesUnicos = [...new Set((v.items || []).map(it => it.almacenId).filter(Boolean))];
                          return almacenesUnicos.map((almId, idx) => {
                            const almacen = almacenes.find(a => a.id === almId);
                            return (
                              <div key={idx} style={{ marginBottom: "0.25rem" }}>
                                {almacen ? almacen.nombre : 'N/A'}
                              </div>
                            );
                          });
                        })()}
                      </td>
                    )}
                    <td style={{
                      padding: "1rem",
                      color: "#6c757d",
                      fontSize: "0.9rem"
                    }}>{new Date(v.fecha).toLocaleString()}</td>
                    <td style={{
                      padding: "1rem",
                      textAlign: "center"
                    }}>
                      <button
                        onClick={() => descargarPDF(v.id)}
                        style={{
                          background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
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
                        PDF
                      </button>
                    </td>
                    {usuario.rol === "admin" && (
                      <td style={{
                        padding: "1rem",
                        textAlign: "center"
                      }}>
                        <button
                          onClick={() => eliminarVale(v.id)}
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
                    )}
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