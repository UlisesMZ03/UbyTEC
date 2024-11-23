import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ReporteVentasPorAfiliado.css';

const ReporteVentasPorAfiliado = () => {
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calcularTotales = () => {
    const totalMontoTotal = reporte.reduce((sum, item) => sum + (item.montoTotal || 0), 0);
    const totalMontoServicio = reporte.reduce((sum, item) => sum + (item.montoServicio || 0), 0);
    const totalCompras = reporte.reduce((sum, item) => sum + (item.compras || 0), 0);
    return { totalMontoTotal, totalMontoServicio, totalCompras };
  };

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await fetch('https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/reportes/reporte-ventas-por-afiliado');
        if (!response.ok) {
          throw new Error('Error al obtener el reporte');
        }
        const data = await response.json();
        setReporte(data);
        console.log('Datos recibidos del API:', data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, []);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('UbyTec', 105, 10, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Reporte de Ventas Por Afiliado', 105, 20, { align: 'center' });

    // Construcción de los datos para la tabla
    const tableColumn = ['Afiliado', 'Compras', 'Monto Total', 'Monto Servicio'];
    const tableRows = reporte.map((item) => [
      item.afiliado || 'N/A',
      item.compras || 0,
      `$${item.montoTotal ? item.montoTotal.toFixed(2) : '0.00'}`,
      `$${item.montoServicio ? item.montoServicio.toFixed(2) : '0.00'}`,
    ]);

    // Agregar totales al final
    const { totalMontoTotal, totalMontoServicio, totalCompras } = calcularTotales();
    tableRows.push([
      'Total',
      totalCompras,
      `$${totalMontoTotal.toFixed(2)}`,
      `$${totalMontoServicio.toFixed(2)}`,
    ]);

    // Renderización de la tabla
    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { halign: 'center' },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      bodyStyles: { fontSize: 10 },
      footStyles: { fontStyle: 'bold' },
    });

    // Agregar la fecha de impresión al final del reporte
    const fechaImpresion = new Date().toLocaleDateString();
    doc.text(`Impreso: ${fechaImpresion}`, 14, doc.lastAutoTable.finalY + 10);

    // Descargar el PDF
    doc.save('Reporte_Ventas_Afiliado.pdf');
  };

  if (loading) return <div className="loading">Cargando reporte...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const { totalMontoTotal, totalMontoServicio, totalCompras } = calcularTotales();

  return (
    <div className="reporte-afiliado-container">
      <h1>Reporte de Ventas por Afiliado</h1>
      <button onClick={exportarPDF} className="btn-exportar-pdf">
        Exportar a PDF
      </button>
      <table className="reporte-tabla">
        <thead>
          <tr>
            <th>Afiliado</th>
            <th>Compras</th>
            <th>Monto Total</th>
            <th>Monto Servicio</th>
          </tr>
        </thead>
        <tbody>
          {reporte.map((item, index) => (
            <tr key={index}>
              <td>{item.afiliado || 'N/A'}</td>
              <td>{item.compras || 0}</td>
              <td>${item.montoTotal ? item.montoTotal.toFixed(2) : '0.00'}</td>
              <td>${item.montoServicio ? item.montoServicio.toFixed(2) : '0.00'}</td>
            </tr>
          ))}
          {/* Fila de totales */}
          <tr className="totales">
            <td style={{ fontWeight: 'bold', textAlign: 'right' }}>Total:</td>
            <td>{totalCompras}</td>
            <td style={{ fontWeight: 'bold' }}>${totalMontoTotal.toFixed(2)}</td>
            <td style={{ fontWeight: 'bold' }}>${totalMontoServicio.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReporteVentasPorAfiliado;
