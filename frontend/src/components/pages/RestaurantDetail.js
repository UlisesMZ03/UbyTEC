import React, { useEffect, useState } from "react";
import "./RestaurantDetail.css";
import { useCart } from "../../CartContext"; // Importa el contexto del carrito

function RestaurantDetail({ restaurante, onBack }) {
  const { addToCart, cart = [] } = useCart(); // Asegura que cart sea un array vacío si es undefined
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos con fotos
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de los productos
  const [error, setError] = useState(null); // Estado para manejar errores
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos"); // Estado para la categoría seleccionada
  const urlAPI = "http://localhost:5133"; // URL base de la API

  useEffect(() => {
    // Función para manejar el retroceso en el navegador
    const handlePopState = (event) => {
      onBack();
    };

    // Agregar evento de escucha para el retroceso
    window.addEventListener("popstate", handlePopState);

    // Limpiar el evento de escucha cuando el componente se desmonte
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onBack]);

  useEffect(() => {
    // Obtener los productos con fotos desde la API
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${urlAPI}/api/comercios/buscarProductosConFotos?correoComercio=${restaurante.correo}`);
        if (!response.ok) {
          setError("No se pudieron obtener los productos con fotos.");
          return;
        }
        const data = await response.json();
  
        // Depuración: Mostrar los productos que llegaron de la API
        console.log("Productos obtenidos desde la API:", data);
  
        setProductos(data); // Almacena los productos en el estado
  
        // Obtener las categorías de los productos, asegurando que 'todos' esté al principio
        const categorias = ["todos", ...new Set(data.map(producto => producto.categoria))];
        setCategorias(categorias); // Establece las categorías disponibles
      } catch (err) {
        setError("Ocurrió un error al intentar cargar los productos.");
        console.error("Error al obtener los productos:", err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductos();
  }, [restaurante.correo]);
  
  // Función para obtener la cantidad de un platillo específico en el carrito
  const getCartQuantity = (productoID) => {
    const item = cart.find(
      (item) => item.productoID === productoID && item.restaurantId === restaurante.id
    );
    return item ? item.cantidad : 0;
  };

  // Función para agregar un platillo al carrito
  const handleAddToCart = (platillo) => {
    addToCart({ ...platillo, restaurantId: restaurante.id });
  };

  // Filtrar productos por la categoría seleccionada
  const productosFiltrados = categoriaSeleccionada === "todos" 
    ? productos 
    : productos.filter(producto => producto.categoria === categoriaSeleccionada);

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return (
      <div className="restaurant-detail">
        <button onClick={onBack}>Volver a los restaurantes</button>
        <div className="error-message-container">
          <p>{error}</p>
          <p>Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-detail">
      <button onClick={onBack}>Volver a los restaurantes</button>
      <h2>{restaurante.nombre}</h2>
      <p>{restaurante.descripcion}</p>

      {/* Filtro de categorías con iconos */}
      <div className="filtro-categorias">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            className={`categoria-button ${categoriaSeleccionada === categoria ? 'seleccionado' : ''}`}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria === "todos" ? "Todos" : categoria}
          </button>
        ))}
      </div>

      <div className="platillos">
        {productosFiltrados.length === 0 ? (
          <div>
            <p>No hay platillos disponibles en esta categoría.</p>
            <button onClick={onBack}>Volver a los restaurantes</button>
          </div>
        ) : (
          productosFiltrados.map((platillo) => (
            <div key={platillo.productoID} className="platillo-item"> {/* Usando 'productoID' en lugar de 'ProductoID' */}
              <div className="platillo-info">
                <h4>{platillo.nombreProducto}</h4>
                <p className="categoria">{platillo.categoria}</p> {/* Mostrar la categoría */}
                <p className="precio">₡ {platillo.precio}</p> {/* Mostrar el precio */}
                
              </div>
              <div className="image-container">
                <img src={platillo.fotoProducto} alt={platillo.nombreProducto} />
                <button
                  className="add-button"
                  onClick={() => handleAddToCart(platillo)}
                >
                  {getCartQuantity(platillo.productoID) > 0 ? getCartQuantity(platillo.productoID) : "+"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RestaurantDetail;
