import React from "react";
import "./ArticleSection.css";

// Importar imágenes locales
import smartDevicesImage from "../images/casa1.png";
import energySavingImage from "../images/disp.png";
import automationImage from "../images/casa2.png";

function ArticleSection() {
  return (
    <div className="article-container">
      <div className="article-hero">
        <h1>UbyTEC: Tu plataforma para envíos de comida en Costa Rica</h1>
        <p>La mejor opción para disfrutar de tus comidas favoritas desde la comodidad de tu hogar</p>
      </div>

      <div className="article-content">
        <div className="article-section">
          <img
            src={smartDevicesImage}
            alt="Conectando comercios y clientes"
            className="article-image"
          />
          <h2>¿Qué es UbyTEC?</h2>
          <p>
            UbyTEC es una plataforma diseñada para conectar a clientes con sus comercios locales favoritos,
            ofreciendo una experiencia fácil y rápida para realizar pedidos y recibirlos en casa.
          </p>
        </div>

        <div className="article-section">
          <h2>Beneficios de UbyTEC</h2>
          <p>
            Con UbyTEC, puedes disfrutar de tus comidas favoritas sin salir de casa. La plataforma facilita
            el proceso de compra, brindando acceso rápido a una variedad de comercios y opciones de entrega segura.
          </p>
          <img
            src={energySavingImage}
            alt="Comida rápida y segura"
            className="article-image"
          />
        </div>

        <div className="article-section">
          <h2>Cómo usar UbyTEC</h2>
          <ul>
            <li>Regístrate y configura tu perfil de cliente.</li>
            <li>Explora los comercios afiliados en tu área.</li>
            <li>Agrega tus productos favoritos al carrito y realiza tu pedido.</li>
            <li>Recibe tu pedido en casa y deja tu feedback para ayudar a mejorar el servicio.</li>
          </ul>
          <img
            src={automationImage}
            alt="Facilidad de uso"
            className="article-image"
          />
        </div>
      </div>
    </div>
  );
}

export default ArticleSection;
