import React, { useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import "./Registrarse.css"; // Asegúrate de crear este archivo CSS
import { Tab, Tabs } from "react-bootstrap";
import RegistrarRepartidor from "./RegistrarRepartidor";
import RegistrarAfiliado from "./RegistrarAfiliado";
import RegistrarAdminAfiliado from "./RegistrarAdminAfiliado"
export default function Registrarse() {
  const navigate = useNavigate();
  
  // Manejar los valores del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    continente: "",
    pais: "",
    email: "",
    password: "",
    direccion: "",
    tipoUsuario: "Cliente", // Se establece el valor predeterminado como Cliente
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Función para enviar los datos a la API
  const handleClick = async () => {
    try {
      const response = await fetch("https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: formData.nombre,
          Apellidos: formData.apellido1 + " " + formData.apellido2,
          Region: formData.continente + " - " + formData.pais,
          CorreoElectronico: formData.email,
          Contraseña: formData.password,
          DireccionEntrega: formData.direccion,
          Dispositivos: [], // Asumo que no se envían dispositivos en el registro inicial
          TipoUsuario: formData.tipoUsuario // Tipo de usuario (Admin, Comercio, Repartidor, Cliente)
        })
      });

      if (response.ok) {
        // Si la respuesta es exitosa, redirige al usuario
        alert("Registro exitoso");
        navigate("/"); // Redirigir después del registro exitoso
      } else {
        const errorData = await response.json();
        alert("Error al registrarse: " + errorData.errors || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al conectarse con la API:", error);
      alert("Error al conectarse con la API");
    }
  };

  return (
    <div className="register-container">
      <h1 className="registrarse">¡Únete a UbyTEC!</h1>
      <p className="description">Regístrate y empieza a disfrutar de nuestros beneficios.</p>
      
      {/* Sección de Tabs para seleccionar el tipo de usuario */}
      <Tabs
        defaultActiveKey="Cliente"
        id="user-type-tabs"
        className="mb-3"
        justify
        onSelect={(key) => setFormData({ ...formData, tipoUsuario: key })}
      >
        <Tab eventKey="Admin" title="Admin">
        {<RegistrarAdminAfiliado></RegistrarAdminAfiliado>}
        </Tab>
        <Tab eventKey="Comercio" title="Comercio">
          {<RegistrarAfiliado></RegistrarAfiliado>}
        </Tab>
        <Tab eventKey="Repartidor" title="Repartidor">
          {<RegistrarRepartidor></RegistrarRepartidor>}
        </Tab>
        <Tab eventKey="Cliente" title="Cliente">
          {/* Aquí puedes agregar contenido específico para Cliente */}
        </Tab>
      </Tabs>
    
    </div>
  );
}
