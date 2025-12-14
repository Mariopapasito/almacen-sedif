import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function TarjetaAlmacen({ nombre, icono, cantidad, ultimaActualizacion, almacenId, descripcion, isUniformSize }) {
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
    if (almacenId) {
      navigate(`/almacen/${almacenId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: "1px solid #e9ecef",
        borderRadius: "16px",
        padding: "1.5rem",
        width: "100%",
        height: isUniformSize ? "400px" : "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textAlign: "center",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
      }}
    >
      <div style={{
        fontSize: "1.3rem",
        fontWeight: "600",
        marginBottom: "0.5rem",
        color: "#2c3e50"
      }}>{nombre}</div>
      {descripcion && <div style={{
        fontSize: "0.95rem",
        color: "#6c757d",
        marginBottom: "1rem",
        fontStyle: "italic"
      }}>{descripcion}</div>}
      <div style={{
        fontSize: "3rem",
        marginBottom: "1rem",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
      }}>{icono}</div>
      <div style={{
        background: `linear-gradient(135deg, ${colorEstado} 0%, ${colorEstado}dd 100%)`,
        color: "white",
        borderRadius: "50%",
        width: "70px",
        height: "70px",
        margin: "0 auto 0.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.2rem",
        fontWeight: "bold",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        border: "3px solid rgba(255,255,255,0.3)"
      }}>
        {cantidad}
      </div>
      <div style={{
        fontWeight: "600",
        fontSize: "1rem",
        color: "#495057",
        marginBottom: "0.5rem"
      }}>{estado}</div>
      <div style={{
        marginTop: "0.5rem",
        fontSize: "0.85rem",
        color: "#6c757d",
        fontWeight: "500"
      }}>
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
  almacenId: PropTypes.number.isRequired,
  descripcion: PropTypes.string,
  isUniformSize: PropTypes.bool,
};