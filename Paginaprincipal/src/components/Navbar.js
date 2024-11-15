import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import "./Navbar.css";

function Navbar() {
  const { loggedIn, logout, role } = useAuth();
  const { cart, updateCartItemQuantity } = useCart();  
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      if (role === 'cliente') {
        navigate("/delivery");  
      } else {
        navigate("/");  
      }
    } else {
      navigate("/");  
    }
  };

  const closeDropdownOnClickOutside = (e) => {
    if (!e.target.closest('.profile-menu') && !e.target.closest('.cart-menu')) {
      setShowDropdown(false);
      setShowCartDropdown(false);
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
    document.addEventListener("click", closeDropdownOnClickOutside);
    window.addEventListener("scroll", handleScroll);
    
    if (showCartDropdown) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto'; 
    }

    return () => {
      document.removeEventListener("click", closeDropdownOnClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showCartDropdown]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleLogoClick}>
          UBYTEC
        </div>
        {loggedIn ? (
          <ul className="nav-menu">
            <li>
              <Link to="/reports" className="nav-links special-link">
                Reportes de Uso
              </Link>
            </li>
            <li>
              <Link to="/tienda" className="nav-links special-link">
                Tienda en Línea
              </Link>
            </li>
            <li className="nav-item profile-cart-container">
              <div className="cart-menu">
                <div className="cart-icon" onClick={toggleCartDropdown}>
                  <i className="fas fa-shopping-cart"></i>
                  {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
                </div>
                {showCartDropdown && <div className="cart-overlay" onClick={toggleCartDropdown}></div>}
                <div className={`cart-dropdown ${showCartDropdown ? 'active' : ''}`}>
                  <div className="cart-title">
                    Carrito de compras
                  </div>
                  {cart.length === 0 ? (
                    <p className="dropdown-item">El carrito está vacío</p>
                  ) : (
                    <div className="cart-dropdown-wrapper">
                      <div className="cart-dropdown-items">
                        {cart.map((item) => (
                          <div key={item.id} className="cart-item">
                            <div className="cart-item-name">{item.nombre}</div>
                            <div className="cart-item-quantity">
                              <input 
                                type="number" 
                                value={item.cantidad} 
                                min="1" 
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                className="cart-quantity-input"
                              />
                            </div>
                            <div className="cart-item-price">₡{item.precio}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="cart-total">
                    Total: ₡{cart.reduce((total, item) => total + item.precio * item.cantidad, 0)}
                  </div>
                  <Link to="/carrito" className="view-cart-button">
                    Ver carrito
                  </Link>
                </div>
              </div>

              <div className="profile-menu">
                <div className="profile-icon" onClick={toggleDropdown}>
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className={`dropdown-menu ${showDropdown ? 'active' : ''}`}>
                  <Link to="/profile" className="dropdown-item">
                    Mi Perfil
                  </Link>
                  <Link to="/" className="dropdown-item" onClick={logout}>
                    Cerrar Sesión
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        ) : (
          <Link to="/login">
            <button className="btn-login">INICIA SESIÓN</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
