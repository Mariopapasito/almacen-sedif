import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardAlmacenista from "./pages/DashboardAlmacenista";
import Articulos from "./pages/Articulos";
import Almacenes from "./pages/Almacenes";
import Usuarios from "./pages/Usuarios";
import Vales from "./pages/Vales";
import Configuracion from "./pages/Configuracion";
import Perfil from "./pages/Perfil";
import RutaProtegida from "./routes/RutaProtegida";
import VistaProductos from "./pages/VistaProductos"; // 🆕 Importa nueva vista

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<RutaProtegida rolRequerido="admin" />}>
        <Route path="/dashboard" element={<DashboardAdmin />} />
        <Route path="/articulos" element={<Articulos />} />
        <Route path="/almacenes" element={<Almacenes />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Route>

      <Route element={<RutaProtegida rolRequerido="almacenista" />}>
        <Route path="/dashboard-almacenista" element={<DashboardAlmacenista />} />
      </Route>

      <Route element={<RutaProtegida />}>
        <Route path="/vales" element={<Vales />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/almacen/:id" element={<VistaProductos />} /> {/* 🆕 Nueva ruta */}
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;