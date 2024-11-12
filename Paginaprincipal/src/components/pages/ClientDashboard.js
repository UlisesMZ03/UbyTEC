import React, { useState, useEffect } from "react";
import "./ClientDashboard.css";

function ClienteDashboard() {
  // Estado del usuario (perfil)
  const [usuario, setUsuario] = useState({
    cedula: "12345678",
    nombre: "Juan",
    apellidos: "Pérez",
    direccion: "San José, Central, Catedral",
    fechaNacimiento: "1990-01-01",
    telefono: "8888-8888",
    usuario: "juanp",
    password: "password123",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // Estado para manejo de perfil eliminado

  // Estado para otras funcionalidades
  const [comercios, setComercios] = useState([
    { id: 1, nombre: "Restaurante La Sabrosa" },
    { id: 2, nombre: "Supermercado Económico" },
    { id: 3, nombre: "Farmacia Salud Total" },
  ]);
  const [selectedComercio, setSelectedComercio] = useState(null);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [compras, setCompras] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCompras();
  }, []);

  // Cargar historial de compras
  const fetchCompras = () => {
    const datosCompras = [
      { id: 1, comercio: "Restaurante La Sabrosa", monto: 5000, feedback: "Excelente servicio" },
      { id: 2, comercio: "Supermercado Económico", monto: 8000, feedback: "Rápido y eficiente" },
    ];
    setCompras(datosCompras);
  };

  // Manejar cambio en el dropdown de comercios
  const handleSelectComercio = (event) => {
    const comercioSeleccionado = comercios.find(
      (comercio) => comercio.id === parseInt(event.target.value)
    );
    setSelectedComercio(comercioSeleccionado);
    if (comercioSeleccionado) {
      setProductos([
        { id: 1, nombre: "Pizza", precio: 5000 },
        { id: 2, nombre: "Hamburguesa", precio: 2500 },
        { id: 3, nombre: "Soda", precio: 1000 },
      ]);
    }
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  };

  // Actualizar cantidad de producto en carrito
  const actualizarCantidad = (index, cantidad) => {
    const nuevoCarrito = carrito.map((item, i) =>
      i === index ? { ...item, cantidad } : item
    );
    setCarrito(nuevoCarrito);
    calcularTotal(nuevoCarrito);
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
    calcularTotal(nuevoCarrito);
  };

  // Calcular total del carrito
  const calcularTotal = (carrito) => {
    const totalCalculado = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    setTotal(totalCalculado);
  };

  // Manejar cambios en el formulario de perfil
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUsuario({ ...usuario, [name]: value });
  };

  // Actualizar perfil de usuario
  const handleSubmitPerfil = (event) => {
    event.preventDefault();
    setIsEditing(false);
    alert("Perfil actualizado correctamente.");
  };

  // Eliminar perfil de usuario
  const eliminarPerfil = () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar tu perfil?");
    if (confirmacion) {
      setUsuario(null);
      setIsDeleted(true);
      alert("Perfil eliminado exitosamente.");
    }
  };

  // Realizar pedido
  const realizarPedido = () => {
    const costoServicio = total * 0.05;
    const montoFinal = total + costoServicio;
    alert(`Pedido realizado. Monto total: ₡${montoFinal} (incluye 5% de servicio)`);
    setCarrito([]);
    setTotal(0);
  };

  // Dejar feedback
  const dejarFeedback = () => {
    alert("Gracias por tu feedback");
    setFeedback("");
  };

  // Mostrar mensaje de perfil eliminado si es el caso
  if (isDeleted) {
    return (
      <div className="cliente-dashboard">
        <h2>Perfil Eliminado</h2>
        <p>Tu perfil ha sido eliminado exitosamente. Gracias por usar nuestros servicios.</p>
      </div>
    );
  }

  return (
    <div className="cliente-dashboard">
      <h2>Perfil de Usuario</h2>
      <section className="formulario-usuario">
        <h3>Información del Usuario</h3>
        <form onSubmit={handleSubmitPerfil}>
          <div className="input-container">
            <label>Número Cédula</label>
            <input
              type="text"
              name="cedula"
              value={usuario.cedula}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="input-container">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="input-container">
            <label>Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={usuario.apellidos}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="input-container">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={usuario.direccion}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="input-container">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={usuario.telefono}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          <button type="button" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Guardar Cambios" : "Editar Perfil"}
          </button>
          <button type="button" onClick={eliminarPerfil} style={{ backgroundColor: "#ff4d4d", marginLeft: "10px" }}>
            Eliminar Perfil
          </button>
        </form>
      </section>

      {/* Historial de Compras */}
      <section className="compras-recientes">
        <h3>Últimas Compras</h3>
        <ul>
          {compras.map((compra) => (
            <li key={compra.id}>
              <h4>{compra.comercio}</h4>
              <p>Monto: ₡{compra.monto}</p>
              <p>Feedback: {compra.feedback}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Dropdown de Comercios Afiliados */}
      <h2>Comercios Afiliados</h2>
      <section className="comercios">
        <div className="input-container">
          <label>Selecciona un Comercio</label>
          <select onChange={handleSelectComercio} defaultValue="">
            <option value="" disabled>
              Selecciona un comercio
            </option>
            {comercios.map((comercio) => (
              <option key={comercio.id} value={comercio.id}>
                {comercio.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Mostrar productos del comercio seleccionado */}
        {selectedComercio && (
          <div className="comercio-productos">
            <h3>Productos en {selectedComercio.nombre}</h3>
            <ul>
              {productos.map((producto, index) => (
                <li key={index}>
                  <h4>{producto.nombre}</h4>
                  <p>Precio: ₡{producto.precio}</p>
                  <button onClick={() => agregarAlCarrito(producto)}>Agregar al Carrito</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Carrito de Compras */}
      <section className="carrito">
        <h3>Carrito de Compras</h3>
        <ul>
          {carrito.map((item, index) => (
            <li key={index}>
              {item.nombre} - ₡{item.precio} x {item.cantidad}
              <input
                type="number"
                value={item.cantidad}
                onChange={(e) => actualizarCantidad(index, Number(e.target.value))}
                min="1"
              />
              <button onClick={() => eliminarDelCarrito(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
        <p>Total: ₡{total}</p>
        <button onClick={realizarPedido}>Realizar Pedido</button>
      </section>

      {/* Feedback */}
      <section className="feedback">
        <h3>Dejar Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Escribe tu comentario aquí"
        />
        <button onClick={dejarFeedback}>Enviar Feedback</button>
      </section>
    </div>
  );
}

export default ClienteDashboard;
