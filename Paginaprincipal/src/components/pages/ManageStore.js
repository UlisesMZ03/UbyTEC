import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./ManageStore.css";

function ManageStore() {
  const [products, setProducts] = useState([]); // Para almacenar productos exitosos
  const [failedProducts, setFailedProducts] = useState([]); // Para almacenar productos fallidos
  const [file, setFile] = useState(null); // Para almacenar el archivo subido
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga

  // Manejar la subida del archivo Excel
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  // Función para procesar el archivo Excel y enviar los productos a la API
  const handleFileUpload = async () => {
    if (file) {
      const reader = new FileReader();
      setLoading(true);

      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const successfulProducts = [];
        const failedProducts = [];

        for (const product of jsonData) {
          if (product.Nombre && product.DistribuidorCedula && product.Precio) {
            try {
              const response = await fetch('https://localhost:5555/api/Producto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
              });

              const result = await response.json();

              if (response.ok) {
                successfulProducts.push(result);
              }else {
                failedProducts.push({
                    product,
                    error: result.errores ? result.errores.join(", ") : result.message || "Error desconocido.",
                });
            }
            
            } catch (error) {
              console.error("Error de conexión:", error);
              failedProducts.push({
                product,
                error: "Error en la conexión o respuesta no válida. Detalles: " + error.message,
              });
            }
          } else {
            failedProducts.push({
              product,
              error: "Faltan campos requeridos.",
            });
          }
        }

        setProducts(successfulProducts);
        setFailedProducts(failedProducts);
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert("Por favor, seleccione un archivo Excel.");
    }
  };

  return (
    <div className="manage-store-container">
      <h1>Gestionar la Tienda en Línea y Distribuidores</h1>

      <div className="file-upload">
        <label>Subir archivo Excel con productos por distribuidor:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Cargar Productos</button>
      </div>

      {loading && <p>Cargando productos, por favor espera...</p>}

      {(products.length > 0 || failedProducts.length > 0) && (
        <div className="products-list">
          <h2>Todos los Productos</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Número de Serie</th>
                <th>Distribuidor Cedula</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.numeroSerieDispositivo || 'N/A'}</td>
                  <td>{item.distribuidorCedula}</td>
                  <td>${item.precio}</td>
                  <td>Exitoso</td>
                </tr>
              ))}
              {failedProducts.map((item, index) => (
                <tr key={index}>
                  <td>{item.product.Nombre}</td>
                  <td>{item.product.NumeroSerieDispositivo || 'N/A'}</td>
                  <td>{item.product.DistribuidorCedula}</td>
                  <td>${item.product.Precio}</td>
                  <td style={{ color: 'red' }}>Fallido - {item.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageStore;
