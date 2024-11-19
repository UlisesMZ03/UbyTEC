import React, { useState } from 'react';
import axios from 'axios';

const VerificationForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://miappnode.azurewebsites.net/send-verification', { email });
            setMessage('Correo de verificación enviado con éxito');
        } catch (error) {
            setMessage('Hubo un error al enviar el correo');
        }
    };

    const checkVerificationStatus = async () => {
        try {
            const response = await axios.get(`https://miappnode.azurewebsites.net/check-verification?email=${email}`);
            setStatus(response.data);
        } catch (error) {
            setStatus('Error al consultar el estado de verificación');
        }
    };

    return (
        <div>
            <h2>Verificar Correo</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Introduce tu correo electrónico"
                    required
                />
                <button type="submit">Enviar correo de verificación</button>
            </form>
            {message && <p>{message}</p>}

            {/* Consultar el estado de la verificación */}
            <div>
                <h3>Consultar estado de la verificación</h3>
                <button onClick={checkVerificationStatus}>Consultar estado</button>
                <p>{status}</p>
            </div>
        </div>
    );
};

export default VerificationForm;
