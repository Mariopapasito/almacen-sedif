import { useEffect, useState } from "react";
import axios from "axios";

export default function Articulos() {
  const [articulos, setArticulos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    categoria: "",
    cantidad: "",
    peso: "",
    almacen: "",
  });
  const [editId, setEditId] = useState(null);

  const obtenerArticulos = async () => {
    const res = await axios.get("http://localhost:5000/api/items");
    setArticulos(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/items/${editId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/items", form);
      }
      setForm({ nombre: "", tipo: "", categoria: "", cantidad: "", peso: "", almacen: "" });
      setEditId(null);
      obtenerArticulos();
    } catch (error) {
        console.error(error);
      alert("Error al guardar el artículo");
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este artículo?")) {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      obtenerArticulos();
    }
  };

  useEffect(() => {
    obtenerArticulos();
  }, []);

  return (
  <div style={{ display: "flex" }}>
    <MenuLateral />
    <div style={{ marginLeft: "220px", padding: "2rem", width: "100%" }}>
      <h2>Gestión de Artículos</h2>

      <form onSubmit={handleSubmit} style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input placeholder="Tipo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} />
        <input placeholder="Categoría" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
        <input type="number" placeholder="Cantidad" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
        <input type="number" placeholder="Peso" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} />
        <input placeholder="Almacén" value={form.almacen} onChange={(e) => setForm({ ...form, almacen: e.target.value })} />
        <button type="submit" style={{ gridColumn: "span 2" }}>
          {editId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Peso</th>
            <th>Almacén</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((a) => (
            <tr key={a._id}>
              <td>{a.nombre}</td>
              <td>{a.tipo}</td>
              <td>{a.categoria}</td>
              <td>{a.cantidad}</td>
              <td>{a.peso}</td>
              <td>{a.almacen}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Editar</button>
                <button onClick={() => handleDelete(a._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)};
