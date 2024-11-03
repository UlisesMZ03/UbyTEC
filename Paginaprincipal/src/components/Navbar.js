import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';  // Asegúrate de ajustar la ruta correctamente
import "./Navbar.css";

function Navbar() {
  const { loggedIn, logout } = useAuth(); // Usa el estado global de autenticación y el usuario
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false); // Estado para mostrar el dropdown del perfil

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  
  const toggleDropdown = (e) => {
    e.stopPropagation();  // Evita la propagación del evento click para evitar cierres no deseados
    setShowDropdown(!showDropdown);
  };

  // Cierra el menú desplegable al hacer click fuera de él
  const closeDropdownOnClickOutside = (e) => {
    if (!e.target.closest('.profile-menu')) {
      setShowDropdown(false);
    }
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
    document.addEventListener("click", closeDropdownOnClickOutside);
    return () => {
      document.removeEventListener("click", closeDropdownOnClickOutside);
    };
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          SmartHomeTEC
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        {loggedIn ? (  // Mostrar solo si el usuario ha iniciado sesión
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li>
              <Link to="/reports" className="nav-links special-link" onClick={closeMobileMenu}>
                Reportes de Uso
              </Link>
            </li>
            <li>
              <Link to="/tienda" className="nav-links special-link" onClick={closeMobileMenu}>
                Tienda en Línea
              </Link>
            </li>
            
            {/* Menú desplegable del perfil */}
            <li className="nav-item profile-menu">
              <div className="profile-icon" onClick={toggleDropdown}>
                <i className="fas fa-user-circle"></i> {/* Ícono de perfil */}
              </div>
              <div className={`dropdown-menu ${showDropdown ? 'active' : ''}`}>
                <Link to="/profile" className="dropdown-item" onClick={closeMobileMenu}>
                  Mi Perfil
                </Link>
                <Link to="/" className="dropdown-item" onClick={logout}>
                  Cerrar Sesión
                </Link>
              </div>
            </li>
          </ul>
        ) : (
          button && (
            <Link to="/login">
              <button className="btn btn--outline">INICIA SESIÓN</button>
            </Link>
          )
        )}
      </div>
    </nav>
  );
}

export default Navbar;
