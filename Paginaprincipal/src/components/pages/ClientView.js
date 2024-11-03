import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirigir
import "./ClientView.css";

function ClientView() {
  const [profile, setProfile] = useState({
    name: "Juan Pérez",
    email: "juan.perez@example.com", // El email no es modificable
    region: "Europa",
  });

  const [reports] = useState({
    monthlyUsage: "Consumo mensual del dispositivo: 500 kWh",
    dailyUsage: "Período de mayor uso: 6pm - 9pm",
    deviceTypes: "Dispositivos más usados: Televisión, Refrigerador",
  });

  const navigate = useNavigate(); // Hook para manejar la navegación

  // Manejar cambios en el perfil (excepto el correo electrónico)
  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert("Perfil actualizado con éxito");
    // Aquí podrías enviar el perfil actualizado a una API o base de datos
  };

  const goToStore = () => {
    navigate("/tienda", { state: { userRegion: profile.region } });
  };

  return (
    <div className="client-container">
      <h1>Gestión del Perfil</h1>
      <form className="profile-form" onSubmit={handleProfileSubmit}>
        <div className="input-group">
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
          />
        </div>

        <div className="input-group">
          <label>Región</label>
          <select
            name="region"
            value={profile.region}
            onChange={handleProfileChange}
          >
            <option value="América">América</option>
            <option value="Europa">Europa</option>
            <option value="Asia">Asia</option>
            <option value="África">África</option>
            <option value="Oceanía">Oceanía</option>
          </select>
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" value={profile.email} readOnly />
        </div>

        <button type="submit" className="btn">Guardar Cambios</button>
      </form>

      <h1>Reportes del Uso de los Dispositivos</h1>
      <div className="reports">
        <div className="report-item">
          <h3>Reporte de Consumo Mensual</h3>
          <p>{reports.monthlyUsage}</p>
        </div>
        <div className="report-item">
          <h3>Reporte de Consumo Diario</h3>
          <p>{reports.dailyUsage}</p>
        </div>
        <div className="report-item">
          <h3>Reporte de Tipos de Dispositivos</h3>
          <p>{reports.deviceTypes}</p>
        </div>
      </div>

      {/* Botón para ir a la tienda en línea */}
      <button className="btn-store" onClick={goToStore}>
        Ir a la Tienda en Línea
      </button>
    </div>
  );
}

export default ClientView;
