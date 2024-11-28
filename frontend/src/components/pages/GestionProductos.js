import React, { useState, useEffect } from "react";
import "./GestionAdminEmpl";

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    id: null, // ID del producto (para edición)
    precio: "",
    categoria: "",
    nombre: "",
    correoComercio: "mcdonalds@example.com", // Correo fijo del comercio
  });

  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [errors, setErrors] = useState({});

  // Obtener productos del comercio
  const obtenerProductos = async () => {
    try {
      
      const response = await fetch(
        `https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/comercios/productos?correoComercio=${formData.correoComercio}`
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();
      console.log("Productos recibidos:", data);
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const validateForm = () => {
    let errors = {};
    if (!formData.nombre) errors.nombre = "El nombre del producto es obligatorio.";
    if (!formData.precio || isNaN(Number(formData.precio)))
      errors.precio = "El precio debe ser un número válido.";
    if (!formData.categoria) errors.categoria = "La categoría es obligatoria.";
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddProduct = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      console.log("Correo:  ",formData);
      const response = await fetch(
        "https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/comercios/productos/agregar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Producto agregado correctamente.");
        obtenerProductos(); // Actualizar la lista de productos
        setFormData({
          id: null,
          precio: "",
          categoria: "",
          nombre: "",
          correoComercio: formData.correoComercio,
        });
      } else {
        alert("Error al agregar el producto.");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar el producto.");
    }
  };


  const handleEditProduct = (index) => {
    // Iniciar el modo de edición con el producto seleccionado
    setEditing(true);
    setCurrentIndex(index);
  
    // Configurar los datos en el formulario, incluyendo el correoComercio
    setFormData({
      ...productos[index],
      correoComercio: "mcdonalds@example.com", // Asegúrate de incluir el correo del comercio
    });
  
    console.log("Producto seleccionado para editar:", {
      ...productos[index],
      correoComercio: "mcdonalds@example.com",
    });
  };
  
  const handleUpdateProduct = async () => {
    // Validar el formulario antes de enviar
    const formErrors = validateForm();
    setErrors(formErrors);
  
    if (Object.keys(formErrors).length > 0) {
      return; // Si hay errores, salir de la función
    }
  
    // Verificar que el ID esté presente para la edición
    if (!formData.id) {
      alert("El ID del producto es obligatorio para actualizar.");
      return;
    }
  
    // Asegurar que correoComercio esté presente
    const updatedFormData = {
      ...formData,
      correoComercio: formData.correoComercio || "mcdonalds@example.com",
    };
  
    // Mostrar los datos que se enviarán al servidor
    console.log("Datos del producto a actualizar:", updatedFormData);
  
    try {
      // Realizar la solicitud para actualizar el producto
      const response = await fetch(
        "https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/comercios/productos/editar",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFormData), // Incluye el ID y el correoComercio en el cuerpo
        }
      );
  
      if (response.ok) {
        alert("Producto actualizado correctamente.");
        obtenerProductos(); // Refrescar la lista de productos
        // Restablecer el formulario
        setFormData({
          id: null,
          precio: "",
          categoria: "",
          nombre: "",
          correoComercio: "mcdonalds@example.com",
        });
        setEditing(false); // Salir del modo de edición
      } else {
        const errorData = await response.json();
        console.error("Error al actualizar producto:", errorData);
        alert(errorData.error || "Error al actualizar el producto.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("Error al actualizar el producto.");
    }
  };
  

  

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(
        `https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/comercios/productos/eliminar?id=${id}&correoComercio=${formData.correoComercio}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Producto eliminado correctamente.");
        obtenerProductos();
      } else {
        alert("Error al eliminar el producto.");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar el producto.");
    }
  };

  return (
    <div className="gestion-empleados">

      <div className="form-container">
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={formData.nombre}
            onChange={handleInputChange}
            style={{ borderColor: errors.nombre ? "red" : "" }}
          />
          {errors.nombre && <small className="error-message">{errors.nombre}</small>}
        </div>
        <div>
          <label>Precio</label>
          <input
            type="text"
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleInputChange}
            style={{ borderColor: errors.precio ? "red" : "" }}
          />
          {errors.precio && <small className="error-message">{errors.precio}</small>}
        </div>
        <div>
          <label>Categoría</label>
          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={formData.categoria}
            onChange={handleInputChange}
            style={{ borderColor: errors.categoria ? "red" : "" }}
          />
          {errors.categoria && (
            <small className="error-message">{errors.categoria}</small>
          )}
        </div>
        {editing ? (
          <button className="actualizar-emp" onClick={handleUpdateProduct}>Actualizar Producto</button>
        ) : (
          <button onClick={handleAddProduct}>Agregar Producto</button>
        )}
        {editing && (
          <button className="cancelar-edicion" onClick={() => setEditing(false)}>Cancelar Edición</button>
        )}
      </div>

      <div className="empleados-list">
        <h3>Lista de Productos</h3>
        <table className="empleados-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.precio}</td>
                <td>{producto.categoria}</td>
                <td>
                <div className="btn-acciones">
                  <button onClick={() => handleEditProduct(index)}>Editar</button>
                  <button onClick={() => handleDeleteProduct(producto.id)}>
                    Eliminar
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionProductos;


