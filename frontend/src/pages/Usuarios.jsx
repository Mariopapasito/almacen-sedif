import { useEffect, useState, useContext } from "react";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import { AuthContext } from "../context/AuthContext";

export default function Usuarios() {
  const { usuario } = useContext(AuthContext);

  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contraseña: "",
    rol: "almacenista",
    almacen: "",
  });
  const [editId, setEditId] = useState(null);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsuarios(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener usuarios");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/users/${editId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/users/register", form);
      }
      setForm({ nombre: "", email: "", contraseña: "", rol: "almacenista", almacen: "" });
      setEditId(null);
      obtenerUsuarios();
    } catch (error) {
      console.error(error);
      alert("Error al guardar usuario");
    }
  };

  const handleEdit = (usuario) => {
    setForm({ ...usuario, contraseña: "" });
    setEditId(usuario._id);
  };

  const handleDelete = async (id) => {
    try {
      if (confirm("¿Eliminar este usuario?")) {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        obtenerUsuarios();
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar usuario");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Control de acceso opcional
  if (usuario?.rol !== "admin") {
    return <p style={{ padding: "2rem" }}>Acceso denegado</p>;
  }

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ padding: "2rem", marginLeft: "220px", width: "100%" }}>
        <h2>Gestión de Usuarios</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Contraseña" value={form.contraseña} onChange={(e) => setForm({ ...form, contraseña: e.target.value })} />
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            <option value="almacenista">Almacenista</option>
            <option value="admin">Administrador</option>
          </select>
          <input placeholder="Almacén" value={form.almacen} onChange={(e) => setForm({ ...form, almacen: e.target.value })} />
          <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
        </form>

        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Almacén</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>{u.almacen}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Editar</button>
                  <button onClick={() => handleDelete(u._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
