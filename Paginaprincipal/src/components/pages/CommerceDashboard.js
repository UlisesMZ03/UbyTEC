import React, { useState } from "react";
import "./CommerceDashboard.css";

function CommerceDashboard() {
  // Estado para el Administrador del Comercio
  const [adminData, setAdminData] = useState({
    nombreCompleto: "Juan Pérez",
    direccion: "",
    provincia: "",
    canton: "",
    distrito: "",
    telefonos: ["8888-8888"],
    usuario: "jperez",
    email: "juan.perez@comercio.com",
  });

  // Datos de ejemplo para productos
  const [productos, setProductos] = useState([
    { nombre: "Pizza", categoria: "Comida", precio: 5000 },
    { nombre: "Soda", categoria: "Bebida", precio: 1000 },
    { nombre: "Hamburguesa", categoria: "Comida", precio: 4000 },
  ]);

  // Datos de ejemplo para pedidos
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      cliente: "Carlos Ruiz",
      monto: 12000,
      comprobante: "123456",
      direccion: "San José, Central, Catedral",
    },
    {
      id: 2,
      cliente: "Ana Fernández",
      monto: 15000,
      comprobante: "789012",
      direccion: "Alajuela, Central, San José",
    },
  ]);
  
  const [selectedPedido, setSelectedPedido] = useState(null);

  // Funciones CRUD para el Administrador
  const handleSaveAdmin = () => {
    console.log("Guardar administrador:", adminData);
  };

  const handleDeleteAdmin = () => {
    console.log("Eliminar administrador");
  };

  // Funciones CRUD para Productos
  const handleAddProduct = () => {
    const newProduct = { nombre: "", categoria: "", precio: "" };
    setProductos([...productos, newProduct]);
  };

  const handleUpdateProduct = (index, updatedProduct) => {
    const updatedProducts = productos.map((prod, i) => (i === index ? updatedProduct : prod));
    setProductos(updatedProducts);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = productos.filter((_, i) => i !== index);
    setProductos(updatedProducts);
  };

  // Función para seleccionar un pedido y ver detalles
  const handleSelectPedido = (pedido) => {
    setSelectedPedido(pedido);
  };

  // Función para asignar el pedido al repartidor
  const handleAssignToRepartidor = () => {
    console.log("Asignar pedido al repartidor más cercano:", selectedPedido);
  };

  return (
    <div className="commerce-dashboard">
      <h1>Panel de Comercio Afiliado</h1>

      {/* Gestión del Administrador */}
      <section className="admin-management">
        <h2>Gestión del Administrador</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-container">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={adminData.nombreCompleto}
              onChange={(e) => setAdminData({ ...adminData, nombreCompleto: e.target.value })}
              required
            />
          </div>
          <div className="input-container">
            <label>Dirección</label>
            <input
              type="text"
              placeholder="Provincia"
              value={adminData.provincia}
              onChange={(e) => setAdminData({ ...adminData, provincia: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Cantón"
              value={adminData.canton}
              onChange={(e) => setAdminData({ ...adminData, canton: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Distrito"
              value={adminData.distrito}
              onChange={(e) => setAdminData({ ...adminData, distrito: e.target.value })}
              required
            />
          </div>
          <div className="input-container">
            <label>Teléfonos</label>
            {adminData.telefonos.map((telefono, index) => (
              <div key={index} className="phone-input">
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => {
                    const updatedPhones = [...adminData.telefonos];
                    updatedPhones[index] = e.target.value;
                    setAdminData({ ...adminData, telefonos: updatedPhones });
                  }}
                  placeholder={`Teléfono ${index + 1}`}
                />
              </div>
            ))}
            <button type="button" onClick={() => setAdminData({ ...adminData, telefonos: [...adminData.telefonos, ""] })}>
              Añadir Teléfono
            </button>
          </div>
          <div className="input-container">
            <label>Usuario</label>
            <input
              type="text"
              value={adminData.usuario}
              onChange={(e) => setAdminData({ ...adminData, usuario: e.target.value })}
              required
            />
          </div>
          <div className="input-container">
            <label>Email</label>
            <input
              type="email"
              value={adminData.email}
              onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
              required
            />
          </div>
          <button onClick={handleSaveAdmin}>Guardar Administrador</button>
          <button onClick={handleDeleteAdmin} style={{ backgroundColor: "red", color: "white" }}>
            Eliminar Administrador
          </button>
        </form>
      </section>

      {/* Gestión de Productos */}
      <section className="product-management">
        <h2>Gestión de Productos</h2>
        <button onClick={handleAddProduct}>Añadir Producto</button>
        <ul>
          {productos.map((producto, index) => (
            <li key={index}>
              <p>Nombre: {producto.nombre}</p>
              <p>Categoría: {producto.categoria}</p>
              <p>Precio: ₡{producto.precio}</p>
              <button onClick={() => handleUpdateProduct(index, { ...producto, nombre: "Nuevo Nombre" })}>Editar</button>
              <button onClick={() => handleDeleteProduct(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Gestión de Pedidos */}
      <section className="order-management">
        <h2>Gestión de Pedidos</h2>
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido.id} onClick={() => handleSelectPedido(pedido)}>
              Pedido #{pedido.id} - Cliente: {pedido.cliente} - Monto: ₡{pedido.monto}
            </li>
          ))}
        </ul>

        {selectedPedido && (
          <div className="selected-order-details">
            <h3>Detalles del Pedido</h3>
            <p>Comprobante: {selectedPedido.comprobante}</p>
            <p>Dirección de entrega: {selectedPedido.direccion}</p>
            <button onClick={handleAssignToRepartidor}>Asignar a Repartidor</button>
          </div>
        )}
      </section>
    </div>
  );
}

export default CommerceDashboard;
