import MenuLateral from "../components/MenuLateral";
import TarjetaAlmacen from "../components/TarjetaAlmacen";

export default function DashboardAdmin() {
  const almacenes = [
    { nombre: "Almacén A", icono: "🖨️", cantidad: 2000 },
    { nombre: "Almacén B", icono: "👥", cantidad: 1000 },
    { nombre: "Almacén C", icono: "🚲", cantidad: 250 },
    { nombre: "Almacén D", icono: "🧸", cantidad: 2000 },
    { nombre: "Almacén E", icono: "📁", cantidad: 2000 }
  ];

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral />
      <div style={{ marginLeft: "220px", padding: "2rem", width: "100%" }}>
        <h2>Bienvenido, administrador</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
          {almacenes.map((almacen) => (
            <TarjetaAlmacen
              key={almacen.nombre}
              nombre={almacen.nombre}
              icono={almacen.icono}
              cantidad={almacen.cantidad}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
