import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './ProductDetails.css'; // Asegúrate de que la ruta sea correcta

const GOOGLE_API_KEY = 'AIzaSyDH5vmhH9kvN8aPpbScYIijZl1-tgd9si0'; // Tu clave de API de Google
const CUSTOM_SEARCH_ENGINE_ID = '42110769c7aab4c72'; // Tu ID de motor de búsqueda

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

function ProductDetails() {
  const { id } = useParams();
  const [productoDetalles, setProductoDetalles] = useState(null);
  const [dispositivosRelacionados, setDispositivosRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productImage, setProductImage] = useState('');

  useEffect(() => {
    const fetchProductoDetalles = async () => {
      try {
        const response = await fetch(`https://localhost:5555/api/Producto/detalles/${id}`);
        if (!response.ok) throw new Error('Error al obtener detalles del producto');
        const detalles = await response.json();
        setProductoDetalles(detalles);
        await fetchProductImage(detalles.nombre, detalles.dispositivo.marca, detalles.dispositivo.tipoDispositivo?.nombre);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDispositivosRelacionados = async () => {
      try {
        const response = await fetch(`https://localhost:5555/api/Producto/${id}/relacionados`);
        if (!response.ok) throw new Error('Error al obtener dispositivos relacionados');
        const relacionados = await response.json();
        setDispositivosRelacionados(relacionados.slice(0, 10)); // Limitar a 10 productos
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProductoDetalles();
    fetchDispositivosRelacionados();
  }, [id]);

  const fetchProductImage = async (productName, productBrand, deviceType) => {
    try {
      const query = `${productName}`; // Consulta más específica
      const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${CUSTOM_SEARCH_ENGINE_ID}&searchType=image&key=${GOOGLE_API_KEY}`);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setProductImage(data.items[1].link);
      } else {
        console.log('No se encontraron imágenes para este producto.');
      }
    } catch (error) {
      console.error('Error al buscar imagen:', error);
    }
  };

  if (loading) return <p>Cargando detalles del producto...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!productoDetalles) return <p>No se encontraron detalles para este producto.</p>;

  return (
    <div className="product-details-container">
      <div className="product-grid">
        <div className="product-image">
          <img 
            src={productImage || 'default-image-url.png'} // URL de imagen por defecto
            alt={productoDetalles.nombre} 
          />
        </div>
        <div className="product-info">
          <h1>{productoDetalles.nombre}</h1>
          <p><strong>Número de Serie:</strong> {productoDetalles.numeroSerieDispositivo}</p>
          <p><strong>Distribuidor:</strong> {productoDetalles.distribuidor.nombre}</p>
          <p><strong>Región:</strong> {productoDetalles.distribuidor.region}</p>
          <p><strong>Dispositivo - Marca:</strong> {productoDetalles.dispositivo.marca}</p>
          <p><strong>Consumo Eléctrico:</strong> {productoDetalles.dispositivo.consumoElectrico} kWh</p>
          <p><strong>Tipo de Dispositivo:</strong> {productoDetalles.dispositivo.tipoDispositivo?.nombre}</p>
          <p><strong>Descripción:</strong> {productoDetalles.dispositivo.tipoDispositivo?.descripcion}</p>
          <p><strong>Tiempo de Garantía:</strong> {productoDetalles.dispositivo.tipoDispositivo?.tiempoGarantia} meses</p>
        </div>
        <div className="purchase-container">
          <div className="price-container">
            <p className="price"><strong>Precio:</strong> ${productoDetalles.precio}</p>
          </div>
          <button className="buy-button">Comprar</button>
        </div>
      </div>

      <h2>Productos Relacionados</h2>
      <div className="related-devices-list">
        {dispositivosRelacionados.length > 0 ? (
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} // significa renderizar el carrusel en el lado del servidor.
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000} // Velocidad de reproducción automática
            keyBoardControl={true}
            customTransition="transform 0.5s ease-in-out" // Efecto de suavizado al pasar a la siguiente página
            transitionDuration={500} // Duración de la transición
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {dispositivosRelacionados.map((dispositivo) => (
              <Link to={`/producto/${dispositivo.id}`} key={dispositivo.numeroSerieDispositivo} className="related-device">
                <div className="related-device-card">
                  <h3>{dispositivo.nombre}</h3>
                  <p>Precio: ${dispositivo.precio}</p>
                  <p>Número de serie: {dispositivo.numeroSerieDispositivo}</p>
                </div>
              </Link>
            ))}
          </Carousel>
        ) : (
          <p>No hay dispositivos relacionados.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
