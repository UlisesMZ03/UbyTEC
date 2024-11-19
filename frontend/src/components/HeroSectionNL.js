import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSectionNL.css';  // Asegúrate de tener el archivo de estilos correspondiente
import '../App.css';
import { useAuth } from '../AuthContext';  // Asegúrate de tener un contexto de autenticación

function HeroSectionNL() {
  const { user } = useAuth();  // Supongo que tienes un contexto de autenticación con 'user'
  const navigate = useNavigate();

  // Redirigir si ya están logueados
  useEffect(() => {
    if (user) {
      navigate('/menu');  // Redirige al menú si ya están logueados
    }
  }, [user, navigate]);

  const handleLoginClick = () => {
    navigate('/login');  // Redirige a la página de login
  };

  const handleSignupClick = () => {
    navigate('/registrarse');  // Redirige a la página de registro
  };

  return (
    <div className="hero-container">
      <div className="hero-message">
        <h2>Bienvenido a UBYTEC</h2>
        <p>¿Tienes hambre? Únete a nuestra plataforma o inicia sesión para disfrutar de deliciosos platillos y recibirlos en la puerta de tu casa.</p>

        {/* Botones para iniciar sesión o registrarse */}
        <div className="hero-buttons">
          <button className="btn-NLHERO" onClick={handleLoginClick}>
            Iniciar Sesión
          </button>
          <button className="btn-NLHERO" onClick={handleSignupClick}>
            Unirse a UBYTEC
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSectionNL;
