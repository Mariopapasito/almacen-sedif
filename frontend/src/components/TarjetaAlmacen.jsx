export default function TarjetaAlmacen({ nombre, icono, cantidad }) {
  // Lógica de color según cantidad
  let colorEstado = "#2ecc71"; // verde
  let estado = "Normal";

  if (cantidad <= 500) {
    colorEstado = "#e74c3c"; // rojo
    estado = "Bajo";
  } else if (cantidad <= 1000) {
    colorEstado = "#f1c40f"; // amarillo
    estado = "Medio";
  }

  return (
    <div style={{
      backgroundColor: "#ffffff",
      border: "2px solid #333",
      borderRadius: "12px",
      padding: "1.5rem",
      width: "200px",
      textAlign: "center",
      boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
      margin: "1rem"
    }}>
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
    </div>
  );
}

import PropTypes from "prop-types";

TarjetaAlmacen.propTypes = {
  nombre: PropTypes.string.isRequired,
  icono: PropTypes.node.isRequired,
  cantidad: PropTypes.number.isRequired,
};
