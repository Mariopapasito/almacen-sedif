import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: "1rem", backgroundColor: "#eee", display: "flex", justifyContent: "space-between" }}>
      <div>Sistema SEDIF</div>
      <div>
        {usuario?.nombre} | <button onClick={logout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}
