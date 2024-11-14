import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import "./Navbar.css";

function Navbar() {
  const { loggedIn, logout } = useAuth();
  const { cart, updateCartItemQuantity } = useCart();  // Necesitarás una función updateCartItemQuantity
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const toggleCartDropdown = (e) => {
    e.stopPropagation();
    setShowCartDropdown(!showCartDropdown);
  };

  const handleLogoClick = () => {
    if (loggedIn) {
      navigate("/delivery");
    } else {
      navigate("/"); 
    }
    closeMobileMenu();
  };

  const closeDropdownOnClickOutside = (e) => {
    if (!e.target.closest('.profile-menu') && !e.target.closest('.cart-menu')) {
      setShowDropdown(false);
      setShowCartDropdown(false);
    }
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  const handleScroll = () => {
    setScrolled(window.scrollY > 0);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      updateCartItemQuantity(id, newQuantity);
    }
  };

  useEffect(() => {
    showButton();
    document.addEventListener("click", closeDropdownOnClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("click", closeDropdownOnClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleLogoClick}>
          UBYTEC
        </div>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        {loggedIn ? (
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

            {/* Cart icon and menu */}
            <li className="nav-item cart-menu">
              <div className="cart-icon" onClick={toggleCartDropdown}>
                <i className="fas fa-shopping-cart"></i>
                {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
              </div>
              <div className={`cart-dropdown ${showCartDropdown ? 'active' : ''}`}>
                {cart.length === 0 ? (
                  <p className="dropdown-item">El carrito está vacío</p>
                ) : (
                  <div className="cart-dropdown-items">
                    {cart.map((item) => (
                      <div key={item.id} className="dropdown-item">
                        <div className="cart-item-details">
                          <span>{item.nombre}</span>
                          <span>₡{item.precio} x 
                            <input 
                              type="number" 
                              value={item.cantidad} 
                              min="1" 
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))} 
                              className="cart-quantity-input" 
                            />
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="cart-total">
                      Total: ₡{cart.reduce((total, item) => total + item.precio * item.cantidad, 0)}
                    </div>
                    <Link to="/carrito" className="view-cart-button" onClick={closeMobileMenu}>
                      Ver carrito
                    </Link>
                  </div>
                )}
              </div>
            </li>

            {/* Profile dropdown */}
            <li className="nav-item profile-menu">
              <div className="profile-icon" onClick={toggleDropdown}>
                <i className="fas fa-user-circle"></i>
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
              <button className="btn-login">INICIA SESIÓN</button>
            </Link>
          )
        )}
      </div>
    </nav>
  );
}

export default Navbar;
