import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSectionAdmin.css';
import '../App.css';
import { useAuth } from '../AuthContext';  // Asegúrate de tener un contexto de autenticación

function HeroSectionAdmin() {
  const { user } = useAuth();  // Suponiendo que tienes un contexto de autenticación con 'user'
  const navigate = useNavigate();

  // Verificación de usuario
  useEffect(() => {
    if (!user) {
      navigate('/login');  // Redirige al login si no hay usuario autenticado
    }
  }, [user, navigate]);

  const handleGestionClick = () => {
    if (user?.role === "admin") {
      navigate('/admin-dashboard');  // Redirige a la sección de administración
    } else {
      navigate('/login');  // Redirige al login si no es un administrador
    }
  };

  if (!user) {
    return <p>Cargando...</p>;  // Muestra un mensaje mientras se carga el usuario
  }

  return (
    <div className="admin-container">
      <div className="welcome-message">
        <h2>Bienvenido {user.name}</h2>  {/* Se obtiene el nombre del usuario autenticado */}
        <p>Accede a las herramientas de administración para gestionar los restaurantes y usuarios.</p>

        {/* Usamos el botón HTML estándar de React */}
        <button className="my-button" onClick={handleGestionClick}>
          Gestionar
        </button>
      </div>
    </div>
  );
}

export default HeroSectionAdmin;
