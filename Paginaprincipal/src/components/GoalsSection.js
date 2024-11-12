import React from "react";
import "./GoalsSection.css";

// Importar imágenes locales
import deviceManagementImage from "../images/mobile-device-management.png";
import dashboardImage from "../images/panel.png";
import warrantyImage from "../images/control.png";
import smartControlImage from "../images/garanta.png";

function GoalsSection() {
  return (
    <div className="goals-container">
      <h1>Funciones Clave de UbyTEC</h1>
      <p>
        UbyTEC ofrece herramientas poderosas para los clientes y comercios afiliados, facilitando la gestión
        y entrega de pedidos de comida a nivel nacional.
      </p>

      <div className="goals-items">
        <div className="goal-card">
          <img src={deviceManagementImage} alt="Gestión de clientes y comercios" className="goal-image" />
          <h3>Gestión de Usuarios</h3>
          <p>
            Administra fácilmente tu perfil, consulta tus pedidos anteriores y configura tus preferencias
            para una mejor experiencia.
          </p>
        </div>

        <div className="goal-card">
          <img src={dashboardImage} alt="Panel de control de pedidos" className="goal-image" />
          <h3>Panel de Control de Pedidos</h3>
          <p>
            Visualiza el estado de tus pedidos en tiempo real, recibe notificaciones y mantén un registro de tus compras.
          </p>
        </div>

        <div className="goal-card">
          <img src={warrantyImage} alt="Gestión de comercios afiliados" className="goal-image" />
          <h3>Comercios Afiliados</h3>
          <p>
            Explora una variedad de comercios locales y selecciona el que mejor se adapte a tus gustos
            y necesidades de compra.
          </p>
        </div>

        <div className="goal-card">
          <img src={smartControlImage} alt="Feedback y control de calidad" className="goal-image" />
          <h3>Feedback y Calidad</h3>
          <p>
            Deja comentarios sobre tus pedidos y ayuda a mejorar el servicio de los comercios afiliados.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GoalsSection;
