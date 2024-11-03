import React, { createContext, useState, useEffect, useContext } from "react";

// Crea el contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto de autenticación
export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Estado del usuario

  // Efecto para cargar la sesión de localStorage si está disponible
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Restaura la sesión
      setLoggedIn(true);
    }
  }, []); // Solo se ejecuta una vez al montar

  // Función para iniciar sesión
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setLoggedIn(true);  // Actualizar el estado global de autenticación
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("user");
    
    setUser(null);
    setLoggedIn(false);  // Actualizar el estado global de autenticación
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}
