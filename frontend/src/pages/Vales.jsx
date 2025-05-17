import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Vales() {
  const { usuario } = useContext(AuthContext);
  const [vales, setVales] = useState([]);
  const [form, setForm] = useState({
    producto: "",
    cantidad: "",
    entregadoPor: usuario?.nombre || "",
    recibidoPor: "",
  });

  const obtenerVales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vales");
      setVales(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener vales");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/vales", form);
      setForm({ producto: "", cantidad: "", entregadoPor: usuario.nombre, recibidoPor: "" });
      obtenerVales();
    } catch (error) {
      console.error(error);
      alert("Error al registrar vale");
    }
  };

  const descargarPDF = (id) => {
    window.open(`http://localhost:5000/api/vales/pdf/${id}`, "_blank");
  };

  useEffect(() => {
    obtenerVales();
  }, []);

 return (
  <div style={{ display: "flex" }}>
    <MenuLateral />
    <div style={{ marginLeft: "220px", padding: "2rem", width: "100%" }}>
      <h2>Vales de Salida</h2>

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "2rem",
        flexWrap: "wrap"
      }}>
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
        <button type="submit" style={{ flexGrow: 1 }}>Registrar salida</button>
      </form>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Entregado por</th>
            <th>Recibido por</th>
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
)};
