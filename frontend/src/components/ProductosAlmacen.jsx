import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

export default function ProductosAlmacen({ almacenId: propAlmacenId }) {
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
        const res = await axios.get("http://localhost:5050/api/items");
        const filtrados = res.data.filter((item) => item.almacen === almacenId);
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
    <div>
      <h2>Productos del almacén: <strong>{almacenId}</strong></h2>

      {productos.length === 0 ? (
        <p>No se encontraron productos para este almacén.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Nombre</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Categoría</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Cantidad</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Última actualización</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p._id}>
                <td style={{ padding: "0.5rem", border: "1px solid #eee" }}>{p.nombre}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #eee" }}>{p.categoria}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #eee" }}>{p.cantidad}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #eee" }}>
                  {new Date(p.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

ProductosAlmacen.propTypes = {
  almacenId: PropTypes.string,
};