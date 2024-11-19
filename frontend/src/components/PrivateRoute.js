// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom'; // Redirige a otras rutas
import { useAuth } from '../AuthContext'; // Importamos el hook useAuth

function PrivateRoute({ element, role, ...rest }) {
  const { loggedIn, user } = useAuth();  // Usamos el hook useAuth para obtener el usuario y el estado de autenticación
  console.log("User:", user);
  console.log("Logged In:", loggedIn);

  // Verificamos si el usuario está logueado
  if (!loggedIn || !user) {
    // Si el usuario no está logueado, redirigir al login
    return <Navigate to="/login" />;
  }

  // Verificamos si el rol coincide con el rol del usuario
  if (role && role !== user.role) {
    // Si el rol no coincide, redirigir a la página principal
    return <Navigate to="/" />;
  }

  // Si todo está bien, renderizamos el componente solicitado
  return element;
}

export default PrivateRoute;




