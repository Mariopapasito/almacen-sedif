import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import './design.css';

// ⬇️ Asegura que el color personalizado se aplique al cargar
const colorGuardado = localStorage.getItem("colorPrincipal");
if (colorGuardado) {
  document.documentElement.style.setProperty("--color-principal", colorGuardado);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);