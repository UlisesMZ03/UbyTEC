import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  // Controla el estado del botón en función del ancho de la ventana
  React.useEffect(() => {
    showButton();
    window.addEventListener("resize", showButton);
    return () => window.removeEventListener("resize", showButton);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          UbyTEC
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li>
            <Link to="/login" className="nav-links" onClick={closeMobileMenu}>
              Iniciar Sesión
            </Link>
          </li>
          <li>
            <Link to="/LoginCommerce" className="nav-links" onClick={closeMobileMenu}>
              Comercios Afiliados
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;


