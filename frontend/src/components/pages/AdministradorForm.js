import React, { useState } from 'react';
import './Form.css';

const AdministradorForm = ({ onNextStep }) => {
    const [adminData, setAdminData] = useState({
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
        isVerified: false
    });

    const [step, setStep] = useState(0); // 0: pantalla inicial, 1: crear admin, 2: verificar admin existente

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmitAdmin = (e) => {
        e.preventDefault();

        // Si es un administrador nuevo, generamos una contraseña aleatoria y enviamos la solicitud al backend
        const generatedPassword = Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria
        console.log('Creando administrador', { ...adminData, password: generatedPassword });

        alert('Administrador creado y contraseña enviada al correo');
        setStep(2); // Cambiar al paso 2 (verificación del administrador existente)
    };

    const handleSendVerificationEmail = (e) => {
        e.preventDefault();

        // Aquí iría la llamada al backend para enviar el código de verificación al correo
        console.log('Enviando correo de verificación a:', adminData.email);

        alert('Correo de verificación enviado. Espera a que el administrador verifique el código.');
        setAdminData({ ...adminData, isEmailSent: true });
        setStep(2); // Cambiar a paso 2 (verificación del código)
    };

    const handleVerification = (e) => {
        e.preventDefault();
        // Llamada al backend para verificar el código enviado por correo
        console.log('Verificando código:', adminData.verificationCode);

        // Simulación de validación del código
        if (adminData.verificationCode === '123456') {
            setAdminData({ ...adminData, isVerified: true });
            alert('Administrador verificado correctamente');
            onNextStep(); // Paso a la siguiente etapa de solicitud del negocio
        } else {
            alert('Código de verificación incorrecto');
        }
    };

    const handleOptionSelection = (option) => {
        if (option === 'new') {
            setStep(1); // Paso para crear nuevo administrador
        } else {
            setStep(2); // Paso para enviar correo de verificación
        }
    };

    return (
        <div className="form-container">
            {step === 0 ? (
                <div>
                    <h2>¿Tienes un Administrador del Comercio?</h2>
                    <button onClick={() => handleOptionSelection('new')}>Crear nuevo administrador</button>
                    <button onClick={() => handleOptionSelection('existing')}>Verificar administrador existente</button>
                </div>
            ) : step === 1 ? (
                <form onSubmit={handleSubmitAdmin}>
                    <h2>Registrar Administrador del Comercio</h2>

                    <label>Correo Electrónico:</label>
                    <input
                        type="email"
                        name="email"
                        value={adminData.email}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={adminData.firstName}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Primer Apellido:</label>
                    <input
                        type="text"
                        name="lastName1"
                        value={adminData.lastName1}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Segundo Apellido:</label>
                    <input
                        type="text"
                        name="lastName2"
                        value={adminData.lastName2}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Usuario:</label>
                    <input
                        type="text"
                        name="username"
                        value={adminData.username}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Provincia:</label>
                    <input
                        type="text"
                        name="province"
                        value={adminData.province}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Cantón:</label>
                    <input
                        type="text"
                        name="canton"
                        value={adminData.canton}
                        onChange={handleInputChange}
                        required
                    />

                    <label>Distrito:</label>
                    <input
                        type="text"
                        name="district"
                        value={adminData.district}
                        onChange={handleInputChange}
                        required
                    />

                    <button type="submit">Enviar</button>
                </form>
            ) : (
                <div>
                    {adminData.isEmailSent ? (
                        <form onSubmit={handleVerification}>
                            <h2>Verificar Administrador</h2>
                            <label>Código de Verificación:</label>
                            <input
                                type="text"
                                name="verificationCode"
                                value={adminData.verificationCode}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit">Verificar Código</button>
                        </form>
                    ) : (
                        <form onSubmit={handleSendVerificationEmail}>
                            <h2>Verificar Administrador</h2>
                            <label>Correo Electrónico del Administrador:</label>
                            <input
                                type="email"
                                name="email"
                                value={adminData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit">Enviar Código de Verificación</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdministradorForm;
