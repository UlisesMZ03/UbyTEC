// agregarcomercio.js

import React, { useState } from 'react';
import AdministradorForm from './AdministradorForm';
import BusinessForm from './BussinesForm';

const AgregarComercio = () => {
    const [step, setStep] = useState(1); // Paso inicial
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName1: '',
        lastName2: '',
        username: '',
        password: '',
        province: '',
        canton: '',
        district: '',
        verificationCode: '',
        isEmailSent: false,
        isVerified: false,
    });

    const handleNextStep = () => {
        setStep(step + 1); // Avanza al siguiente paso
    };

    const handlePrevStep = () => {
        setStep(step - 1); // Retrocede al paso anterior
    };

    const handleFormChange = (updatedData) => {
        setFormData(updatedData); // Actualiza el estado global con los datos del formulario
    };

    return (
        <div className="form-container">
            {step === 1 ? (
                <AdministradorForm 
                    adminData={formData} // Pasar los datos actuales
                    onFormChange={handleFormChange} // Manejar cambios
                    onNextStep={handleNextStep} 
                />
            ) : (
                <BusinessForm 
                    adminData={formData} // Aquí pasas los datos si es necesario
                    onFormChange={handleFormChange} 
                />
            )}
            <div className="navigation-buttons">
                {step > 1 && (
                    <button onClick={handlePrevStep}>Atrás</button>
                )}
                {step < 2 && (
                    <button onClick={handleNextStep}>Adelante</button>
                )}
            </div>
        </div>
    );
};

export default AgregarComercio;
