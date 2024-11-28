import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import Carousel from 'react-bootstrap/Carousel'; // Importamos Carousel
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap esté importado
import "./GoalsSection.css";
import citiesData from "./data/cities.json"; // Asegúrate de que la ruta sea correcta

// Ejemplo de componente de imagen para el carrusel
const ExampleCarouselImage = ({ src, alt }) => (
  <img 
    src={src} 
    alt={alt} 
    style={{ 
      width: '100%', 
      height: '80vh', 
      objectFit: 'cover', 
      objectPosition: 'top'  // Alinea la imagen hacia la parte superior
    }} 
  />
);

function GoalsSectionNL() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCities(citiesData);
  }, []);

  return (
    <div className="ubbytec-cities">
      {/* Carrusel de opciones */}
      <Carousel>
        {/* Primera opción */}
        <Carousel.Item>
          <ExampleCarouselImage 
            src="https://web.didiglobal.com/_next/image/?url=https%3A%2F%2Fimages.ctfassets.net%2Fn7hs0hadu6ro%2F5FMGbqS3Yh897fBZtCcpwr%2F0ba3d3dd09631b9d606ea13c741f40df%2FiStock-1253498989.jpg&w=3840&q=75"
            alt="Socio Repartidor"
          />
          <Carousel.Caption>
            <h3>¿Te interesa hacer entregas?</h3>
            <p>Únete como socio repartidor y empieza a generar ganancias.</p>
            <Link to="/reg-repartidor">
              <button>Unirme como socio repartidor</button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Segunda opción */}
        <Carousel.Item>
          <ExampleCarouselImage 
            src="https://web.didiglobal.com/_next/image/?url=https%3A%2F%2Fimages.ctfassets.net%2Fn7hs0hadu6ro%2F2EGID4EYXYjUtGOnN7FMNc%2F5005065c912d266b0c7cb768963bcdbe%2FiStock-1180926063.jpg&w=3840&q=75"
            alt="Afiliación Comercio"
          />
          <Carousel.Caption>
            <h3>¿Tienes un comercio?</h3>
            <p>Afíliate para que tu comercio esté disponible en nuestra plataforma.</p>
            <Link to="/reg-afiliado">
              <button>Afiliar mi comercio</button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Lista de ciudades */}
      <h2>Ciudades donde opera UBYTEC</h2>
      <div className="city-list">
        {cities.map((city) => (
          <div key={city.id} className="city-item">
            {city.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalsSectionNL;
