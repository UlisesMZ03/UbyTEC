import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { useAuth } from "../../AuthContext"; 
import './OnlineStore.css';

function OnlineStore() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { user } = useAuth(); 
  const [userRegion, setUserRegion] = useState(''); 
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [regionFetched, setRegionFetched] = useState(false); 

  useEffect(() => {
    const fetchUserRegion = async () => {
      console.log("Intentando obtener la región del usuario...");
      if (user && user.userId) {
        try {
          const response = await fetch(`https://localhost:5555/api/users/${user.userId}/details`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          });

          const data = await response.json();
          console.log("Respuesta de la API:", data);

          if (response.ok) {
            setUserRegion(data.region); 
            setRegionFetched(true); 
            console.log("Región obtenida:", data.region);
            
            // Adjuntar la función a window para que sea accesible desde la consola
            window.getUserRegion = () => console.log("Región del usuario:", data.region);
          } else {
            setError(data.message || "Error al obtener los detalles del usuario");
            setRegionFetched(false);
          }
        } catch (error) {
          console.error("Error al conectarse con la API:", error);
          setError("Error al conectarse con la API");
          setRegionFetched(false);
        }
      }
    };

    fetchUserRegion(); 
  }, [user]);

  useEffect(() => {
    const fetchProductos = async () => {
      if (userRegion) {
        try {
          const response = await fetch(`https://localhost:5555/api/Producto/por-region/${userRegion}`); // Llamada actualizada para filtrar por región
          if (!response.ok) throw new Error('Error al obtener productos');
          const data = await response.json();
          setProductos(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductos();
  }, [userRegion]); // Dependencia de userRegion para llamar cuando cambia

  const handleProductoSelect = (producto) => {
    navigate(`/producto/${producto.id}`);
  };

  return (
    <div className="store-container">
      <h1>Tienda en línea</h1>
      {regionFetched ? (
        <p>Seleccione un producto para comprar: <strong>{userRegion || 'No disponible'}</strong></p>
      ) : (
        <p>Obteniendo región del usuario...</p>
      )}

      {loading && <p>Cargando productos...</p>}
      {error && <p>Error: {error}</p>}

      <div className="device-list">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div
              key={producto.id}
              className="device-item"
              onClick={() => handleProductoSelect(producto)}
            >
              <h3>{producto.nombre}</h3>
              <p>Precio: ${producto.precio}</p>
              <p>Número de serie: {producto.numeroSerieDispositivo}</p>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default OnlineStore;
