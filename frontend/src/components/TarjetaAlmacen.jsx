import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function TarjetaAlmacen({ nombre, icono, cantidad, ultimaActualizacion, almacen }) {
  const navigate = useNavigate();

  let colorEstado = "#2ecc71";
  let estado = "Normal";

  if (cantidad <= 500) {
    colorEstado = "#e74c3c";
    estado = "Bajo";
  } else if (cantidad <= 1000) {
    colorEstado = "#f1c40f";
    estado = "Medio";
  }

  const fechaActualizacion = ultimaActualizacion
    ? new Date(ultimaActualizacion).toLocaleString()
    : "Sin registro";

  const handleClick = () => {
    navigate(`/almacen/${almacen}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: "#ffffff",
        border: "2px solid #333",
        borderRadius: "12px",
        padding: "1.5rem",
        width: "100%",
        maxWidth: "300px",
        textAlign: "center",
        boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
        margin: "1rem",
        flex: "1 1 calc(100% - 2rem)",
        boxSizing: "border-box",
        cursor: "pointer",
        transition: "transform 0.2s, background-color 0.2s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{nombre}</div>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{icono}</div>
      <div style={{
        backgroundColor: colorEstado,
        color: "white",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        margin: "0 auto 0.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.1rem",
        fontWeight: "bold"
      }}>
        {cantidad}
      </div>
      <div style={{ fontWeight: "bold" }}>{estado}</div>
      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#555" }}>
        Última actualización: {fechaActualizacion}
      </div>
    </div>
  );
}

TarjetaAlmacen.propTypes = {
  nombre: PropTypes.string.isRequired,
  icono: PropTypes.node.isRequired,
  cantidad: PropTypes.number.isRequired,
  ultimaActualizacion: PropTypes.string,
  almacen: PropTypes.string.isRequired,
};