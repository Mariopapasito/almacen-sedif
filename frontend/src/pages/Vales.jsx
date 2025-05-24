import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import { AuthContext } from "../context/AuthContext";

export default function Vales() {
  const { usuario, token } = useContext(AuthContext);
  const [vales, setVales] = useState([]);
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState(usuario?.almacen || "");
  const [form, setForm] = useState({
    producto: "",
    cantidad: "",
    entregadoPor: usuario?.nombre || "",
    recibidoPor: "",
  });
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const obtenerVales = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/vales", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let todos = res.data;

      if (fechaInicio || fechaFin) {
        const inicio = fechaInicio ? new Date(fechaInicio) : new Date("1970-01-01");
        const fin = fechaFin ? new Date(fechaFin) : new Date();
        todos = todos.filter((v) => {
          const fechaVale = new Date(v.fecha);
          return fechaVale >= inicio && fechaVale <= fin;
        });
      }

      if (usuario?.rol !== "admin") {
        todos = todos.filter((v) => v.almacen === usuario.almacen);
      }

      setVales(todos);
    } catch (error) {
      console.error(error);
      alert("Error al obtener vales");
    }
  };

  useEffect(() => {
    obtenerVales();
  }, [fechaInicio, fechaFin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.producto || !form.cantidad || !form.recibidoPor) {
      return alert("Todos los campos son obligatorios");
    }

    const almacen = usuario.rol === "admin" ? almacenSeleccionado : usuario.almacen;

    if (!almacen) {
      return alert("Debe seleccionar un almacén");
    }

    try {
      const datos = {
        ...form,
        almacen,
      };

      await axios.post("http://localhost:5050/api/vales", datos, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        producto: "",
        cantidad: "",
        entregadoPor: usuario?.nombre || "",
        recibidoPor: "",
      });

      obtenerVales();
    } catch (error) {
      console.error("Error al registrar vale:", error);
      alert("Error al registrar vale");
    }
  };

  const descargarPDF = async (id) => {
    try {
      const response = await fetch(`http://localhost:5050/api/vales/pdf/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("No se pudo descargar el PDF");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ marginLeft: "220px", padding: "2rem", width: "100%" }}>
        <h2>Vales de Salida</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          {usuario.rol === "admin" && (
            <select
              value={almacenSeleccionado}
              onChange={(e) => setAlmacenSeleccionado(e.target.value)}
              required
            >
              <option value="">-- Selecciona almacén --</option>
              <option value="A">Almacén A</option>
              <option value="B">Almacén B</option>
              <option value="C">Almacén C</option>
              <option value="D">Almacén D</option>
            </select>
          )}

          <input
            placeholder="Producto"
            value={form.producto}
            onChange={(e) => setForm({ ...form, producto: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={form.cantidad}
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
            required
          />
          <input
            placeholder="Recibido por"
            value={form.recibidoPor}
            onChange={(e) => setForm({ ...form, recibidoPor: e.target.value })}
            required
          />
          <button type="submit" style={{ flexGrow: 1 }}>
            Registrar salida
          </button>
        </form>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ marginRight: "1rem" }}>Filtrar por fecha:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <span style={{ margin: "0 0.5rem" }}>hasta</span>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Entregado por</th>
              <th>Recibido por</th>
              <th>Almacén</th>
              <th>Fecha</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {vales.map((v) => (
              <tr key={v._id}>
                <td>{v.producto}</td>
                <td>{v.cantidad}</td>
                <td>{v.entregadoPor}</td>
                <td>{v.recibidoPor}</td>
                <td>{v.almacen}</td>
                <td>{new Date(v.fecha).toLocaleString()}</td>
                <td>
                  <button onClick={() => descargarPDF(v._id)}>Descargar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}