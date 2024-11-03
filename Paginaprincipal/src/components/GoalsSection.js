import React from "react";
import "./GoalsSection.css";

// Importar las imágenes locales
import deviceManagementImage from "../images/mobile-device-management.png";
import dashboardImage from "../images/panel.png";
import warrantyImage from "../images/control.png";
import smartControlImage from "../images/garanta.png";

function GoalsSection() {
  return (
    <div className="goals-container">
      <h1>Las herramientas para gestionar tu hogar inteligente</h1>
      <p>
        Gestiona todos tus dispositivos inteligentes, accede a informes detallados y mantén el control sobre tu hogar desde una única plataforma.
      </p>

      <div className="goals-items">
        <div className="goal-card">
          <img src={deviceManagementImage} alt="Gestión de dispositivos" className="goal-image" />
          <h3>Gestión de dispositivos</h3>
          <p>
            Añade, edita y controla todos los dispositivos inteligentes de tu hogar, sin importar la marca, desde una sola plataforma.
          </p>
        </div>

        <div className="goal-card">
          <img src={dashboardImage} alt="Panel de control" className="goal-image" />
          <h3>Panel de control</h3>
          <p>
            Visualiza el consumo de energía, tiempo de uso y otros datos importantes en un panel de control fácil de usar.
          </p>
        </div>

        <div className="goal-card">
          <img src={warrantyImage} alt="Gestión de garantías" className="goal-image" />
          <h3>Gestión de garantías</h3>
          <p>
            Consulta y gestiona las garantías de todos tus dispositivos inteligentes, mantente al tanto de las fechas de vencimiento.
          </p>
        </div>

        <div className="goal-card">
          <img src={smartControlImage} alt="Control inteligente" className="goal-image" />
          <h3>Control inteligente</h3>
          <p>
            Controla el encendido, apagado y la automatización de tus dispositivos desde cualquier lugar con la app SmartHomeTEC.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GoalsSection;




