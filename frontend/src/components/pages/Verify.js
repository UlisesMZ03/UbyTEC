import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';  // Si estás utilizando React Router

const Verify = () => {
    const [result, setResult] = useState('');
    const { search } = useLocation(); // Captura los parámetros de la URL

    useEffect(() => {
        const queryParams = new URLSearchParams(search);
        const token = queryParams.get('token');
        const action = queryParams.get('action');

        if (token && action) {
            // Realizar la solicitud para procesar el enlace de verificación
            fetch(`http://localhost:3001/verify?token=${token}&action=${action}`, {
                method: 'GET',
            })
                .then((response) => response.text())
                .then((data) => setResult(data))
                .catch((error) => setResult('Error al verificar'));
        }
    }, [search]);

    return (
        <div>
            <h2>Verificación de Administrador</h2>
            <p>{result}</p>
        </div>
    );
};

export default Verify;
