import React from "react";
import "./ArticleSection.css";

// Importar las imágenes locales
import smartDevicesImage from "../images/casa1.png";
import energySavingImage from "../images/disp.png";
import automationImage from "../images/casa2.png";

function ArticleSection() {
  return (
    <div className="article-container">
      <div className="article-hero">
        <h1>La Importancia de un Hogar Inteligente</h1>
        <p>Cómo los dispositivos inteligentes pueden mejorar tu calidad de vida y la eficiencia en tu hogar</p>
      </div>

      <div className="article-content">
        <div className="article-section">
          <img
            src={smartDevicesImage}
            alt="Dispositivos inteligentes"
            className="article-image"
          />
          <h2>¿Qué es un hogar inteligente?</h2>
          <p>
            Un hogar inteligente utiliza dispositivos conectados a Internet para controlar y automatizar funciones como iluminación, calefacción, seguridad y electrodomésticos. Estos dispositivos permiten un mayor control, comodidad y ahorro energético.
          </p>
        </div>

        <div className="article-section">
          <h2>Beneficios de los dispositivos inteligentes</h2>
          <p>
            Los dispositivos inteligentes no solo mejoran la comodidad, sino que también ayudan a reducir el consumo de energía. Gracias a la automatización y al control remoto, es posible ajustar el uso de dispositivos para que sean más eficientes y contribuyan a un estilo de vida sostenible.
          </p>
          <img
            src={energySavingImage}
            alt="Ahorro de energía"
            className="article-image"
          />
        </div>

        <div className="article-section">
          <h2>Consejos para un hogar más eficiente</h2>
          <ul>
            <li>Utiliza termostatos inteligentes para regular la temperatura y reducir el consumo de energía.</li>
            <li>Automatiza las luces para que se apaguen cuando no haya nadie en casa.</li>
            <li>Instala cámaras de seguridad conectadas para monitorizar tu hogar desde cualquier lugar.</li>
            <li>Configura rutinas para que los electrodomésticos funcionen en horarios de menor consumo.</li>
          </ul>
          <img
            src={automationImage}
            alt="Automatización del hogar"
            className="article-image"
          />
        </div>
      </div>
    </div>
  );
}

export default ArticleSection;
