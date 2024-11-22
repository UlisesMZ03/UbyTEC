import React, { useState } from 'react';
import axios from 'axios';
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
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmitAdmin = (e) => {
        e.preventDefault();
        const generatedPassword = Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria
        console.log('Creando administrador', { ...adminData, password: generatedPassword });

        alert('Administrador creado y contraseña enviada al correo');
        setStep(2); // Cambiar al paso 2 (verificación del administrador existente)
    };

    const handleSendVerificationEmail = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://miappnode.azurewebsites.net/send-verification', { email: adminData.email });
            setMessage('Correo de verificación enviado con éxito');
            setAdminData({ ...adminData, isEmailSent: true });
        } catch (error) {
            setMessage('Hubo un error al enviar el correo');
        }

        setStep(2); // Cambiar a paso 2 (verificación del código)
    };

    const checkVerificationStatus = async () => {
        try {
            const response = await axios.get(`https://miappnode.azurewebsites.net/check-verification?email=${adminData.email}`);
            setStatus(response.data);

            // Verificar si la verificación fue exitosa (estado "accepted")
            if (response.data.includes('accepted')) {
                setAdminData({ ...adminData, isVerified: true });
                alert('Administrador verificado correctamente');
                onNextStep(); // Paso a la siguiente etapa de solicitud del negocio
            } else {
                alert('La verificación no fue aceptada, intente nuevamente');
            }
        } catch (error) {
            setStatus('Error al consultar el estado de verificación');
        }
    };

    const handleVerification = (e) => {
        e.preventDefault();

        // Aquí iría la lógica para verificar el código ingresado con el backend
        console.log('Verificando código:', adminData.verificationCode);
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
                        <div>
                            <h2>Verificar Administrador</h2>
                            <label>Código de Verificación:</label>
                            <input
                                type="text"
                                name="verificationCode"
                                value={adminData.verificationCode}
                                onChange={handleInputChange}
                                required
                            />
                            <button onClick={handleVerification}>Verificar Código</button>

                            <h3>Consultar estado de la verificación</h3>
                            <button onClick={checkVerificationStatus}>Consultar estado</button>
                            <p>{status}</p>
                        </div>
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
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdministradorForm;
