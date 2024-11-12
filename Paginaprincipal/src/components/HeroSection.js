import React from "react";
import "./HeroSection.css";
import { Button } from "./Button";
import smartHomeImage1 from "../images/casa.png";

function HeroSection() {
  return (
    <div className="hero-container">
      <div className="welcome-message">
        <h2>¡Bienvenido a UbyTEC!</h2>
        <p>La mejor plataforma para conectar clientes con sus comercios locales favoritos</p>
      </div>

      <div className="hero-text">
        <h1>Disfruta de Comidas y Productos en Casa con UbyTEC</h1>
        <p>
          Explora una amplia variedad de comercios afiliados, realiza tus pedidos en pocos clics y disfruta de
          la comodidad de recibir todo en la puerta de tu hogar.
        </p>
        <div className="hero-btns">
          <Button className="btns" buttonStyle="btn--primary" buttonSize="btn--large">
            EMPIEZA AHORA
          </Button>
        </div>
      </div>

      <div className="hero-images">
        <img src={smartHomeImage1} alt="Servicio de entrega con UbyTEC" className="hero-image" />
      </div>
    </div>
  );
}

export default HeroSection;

