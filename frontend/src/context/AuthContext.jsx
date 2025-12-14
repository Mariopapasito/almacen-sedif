import { createContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    if (!guardado) return null;
    try {
      return JSON.parse(guardado);
    } catch (err) {
      console.warn("Usuario en localStorage inválido, limpiando", err);
      localStorage.removeItem("usuario");
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const inactividadRef = useRef(null);

  const TIEMPO_INACTIVIDAD = 5 * 60 * 1000; // ⏱️ 5 minutos

  const logout = useCallback(() => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = "";
    window.location.href = "/"; // ✅ Redirección segura fuera del router context
  }, []);

  const resetInactividad = useCallback(() => {
    clearTimeout(inactividadRef.current);
    inactividadRef.current = setTimeout(() => {
      logout();
      alert("Sesión cerrada por inactividad.");
    }, TIEMPO_INACTIVIDAD);
  }, [logout, TIEMPO_INACTIVIDAD]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    if (token && usuario) {
      resetInactividad();
      window.addEventListener("mousemove", resetInactividad);
      window.addEventListener("keydown", resetInactividad);
    }

    return () => {
      clearTimeout(inactividadRef.current);
      window.removeEventListener("mousemove", resetInactividad);
      window.removeEventListener("keydown", resetInactividad);
    };
  }, [token, usuario, resetInactividad]);

  const login = (datos, token) => {
    setUsuario(datos);
    setToken(token);
    localStorage.setItem("usuario", JSON.stringify(datos));
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const actualizarFoto = (nuevaFoto) => {
    const actualizado = { ...usuario, foto: nuevaFoto };
    setUsuario(actualizado);
    localStorage.setItem("usuario", JSON.stringify(actualizado));
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, actualizarFoto }}>
      {children}
    </AuthContext.Provider>
  );
};