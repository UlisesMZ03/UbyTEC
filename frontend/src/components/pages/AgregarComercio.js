// agregarcomercio.js

import React, { useState } from 'react';
import AdministradorForm from './AdministradorForm';
import BusinessForm from './BussinesForm';


const AgregarComercio = () => {
    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        setStep(2); // Pasa al siguiente paso (registro de negocio)
    };

    return (
        <div className="app-container">
            {step === 1 ? (
                <AdministradorForm onNextStep={handleNextStep} />
            ) : (
                <BusinessForm />
            )}
        </div>
    );
};

export default AgregarComercio;
