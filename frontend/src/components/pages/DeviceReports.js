import React, { useState } from "react";
import "./DeviceReports.css"; // Archivo CSS separado para los estilos

function DeviceReports() {
  const [reports] = useState({
    monthlyUsage: "Consumo mensual del dispositivo: 500 kWh",
    dailyUsage: "Período de mayor uso: 6pm - 9pm",
    deviceTypes: "Dispositivos más usados: Televisión, Refrigerador",
  });

  return (
    <div className="reports-container">
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
    </div>
  );
}

export default DeviceReports;
