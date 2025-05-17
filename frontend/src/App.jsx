import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import Articulos from './pages/Articulos';
import Usuarios from './pages/Usuarios';
import Vales from './pages/Vales';
import Configuracion from './pages/Configuracion';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const { usuario } = useContext(AuthContext);

  if (!usuario) return <Login />;

  return (
    <Routes>
      {usuario.rol === 'admin' && (
        <>
          <Route path="/" element={<DashboardAdmin />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/vales" element={<Vales />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </>
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
