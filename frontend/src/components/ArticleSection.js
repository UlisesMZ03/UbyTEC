import React, { useEffect, useState } from "react";
import "./ArticleSection.css"; // Asegúrate de que el CSS esté bien aplicado

function Footer() {
  const [isPaddingNeeded, setIsPaddingNeeded] = useState(false);

  useEffect(() => {
    // Revisar el tamaño del contenido cuando la página se carga o cambia
    const checkPadding = () => {
      const contentHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      // Si el contenido es menor que el tamaño de la ventana, agregamos padding al footer
      setIsPaddingNeeded(contentHeight < windowHeight);
    };

    // Ejecutar la función al cargar la página
    checkPadding();

    // Agregar un listener para el cambio de tamaño de la ventana
    window.addEventListener("resize", checkPadding);

    // Limpiar el listener cuando el componente se desmonte
    return () => window.removeEventListener("resize", checkPadding);
  }, []); // Solo se ejecuta una vez al cargar

  return (
    <footer className={`footer-container ${isPaddingNeeded ? "footer-padding" : ""}`}>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Sobre UBYTEC</h3>
          <p>
            UBYTEC es una plataforma dedicada a ofrecer soluciones de hogares inteligentes para mejorar tu calidad de vida y promover la eficiencia energética.
          </p>
        </div>

        <div className="footer-section">
          <h3>Enlaces útiles</h3>
          <ul>
            <li><a href="/about">Acerca de Nosotros</a></li>
            <li><a href="/services">Servicios</a></li>
            <li><a href="/contact">Contacto</a></li>
            <li><a href="/privacy">Política de Privacidad</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contacto</h3>
          <p>Email: contacto@ubytec.com</p>
          <p>Teléfono: +506 1234 5678</p>
          <p>Dirección: San José, Costa Rica</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 UBYTEC. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
