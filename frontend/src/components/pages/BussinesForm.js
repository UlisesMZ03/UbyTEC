import React, { useState } from 'react';
import './Form.css';

const BusinessForm = () => {
    const [businessData, setBusinessData] = useState({
        businessName: '',
        businessType: 'restaurante',
        address: '',
        contactPhone: '',
        sinpeNumber: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBusinessData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmitBusiness = (e) => {
        e.preventDefault();
        // Enviar datos del negocio al backend
        console.log('Registrando negocio:', businessData);
        alert('Negocio registrado exitosamente.');
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmitBusiness}>
                <h2>Solicitud de Registro de Negocio</h2>
                <label>Nombre del Comercio:</label>
                <input
                    type="text"
                    name="businessName"
                    value={businessData.businessName}
                    onChange={handleInputChange}
                    required
                />

                <label>Tipo de Comercio:</label>
                <select
                    name="businessType"
                    value={businessData.businessType}
                    onChange={handleInputChange}
                    required
                >
                    <option value="restaurante">Restaurante</option>
                    <option value="supermercado">Supermercado</option>
                    <option value="farmacia">Farmacia</option>
                    <option value="dulceria">Dulcería</option>
                </select>

                <label>Dirección:</label>
                <input
                    type="text"
                    name="address"
                    value={businessData.address}
                    onChange={handleInputChange}
                    required
                />

                <label>Teléfonos:</label>
                <input
                    type="text"
                    name="contactPhone"
                    value={businessData.contactPhone}
                    onChange={handleInputChange}
                    required
                />

                <label>Número SINPE Móvil:</label>
                <input
                    type="text"
                    name="sinpeNumber"
                    value={businessData.sinpeNumber}
                    onChange={handleInputChange}
                    required
                />

                <button type="submit">Registrar Negocio</button>
            </form>
        </div>
    );
};

export default BusinessForm;
