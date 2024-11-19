const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { MailerSend, Sender, Recipient, EmailParams } = require('mailersend');  
const bodyParser = require('body-parser');
const app = express();

// Almacenamos el estado de las verificaciones en memoria
const verificationStates = {}; // Guarda el estado de verificación de cada correo

// Configurar MailerSend con tu API Key
const mailersend = new MailerSend({
    apiKey: 'mlsn.0016765de86e8e2bdbade2ee582563ae3a654365f81303e6d405e5388f5c63c6',  // Tu API Key de MailerSend
});

// Middleware para manejar solicitudes JSON
app.use(bodyParser.json());

// Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors());

// Función para generar un token único
const generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

// Enviar correo con los enlaces de verificación
const sendVerificationEmail = (email, token) => {
    const urlAccept = `https://ubytec.karticos.com/verify?token=${token}&action=accept`;
    const urlDeny = `https://ubytec.karticos.com/verify?token=${token}&action=deny`;

    // Crear un objeto Sender con la dirección del remitente usando el dominio de prueba
    const sentFrom = new Sender('no-reply@trial-ynrw7gyzjer42k8e.mlsender.net', 'UbyTEC');   // Remitente usando el dominio de prueba

    // Crear el objeto Recipient con el correo del destinatario
    const recipients = [new Recipient(email, 'Administrador')];

    // Crear el objeto EmailParams y configurar todos los parámetros del correo
    const emailParams = new EmailParams()
        .setFrom(sentFrom)                        // Remitente
        .setTo(recipients)                        // Destinatarios
        .setSubject('Solicitud de Verificación de Administrador')
        .setHtml(`
            <p>Haga clic en uno de los siguientes enlaces para aceptar o denegar la solicitud de administración:</p>
            <p><a href="${urlAccept}">Aceptar</a></p>
            <p><a href="${urlDeny}">Denegar</a></p>
        `)
        .setText(`
            Haga clic en uno de los siguientes enlaces para aceptar o denegar la solicitud de administración:
            Aceptar: ${urlAccept}
            Denegar: ${urlDeny}
        `);

    // Enviar el correo
    mailersend.email.send(emailParams)
        .then(() => {
            console.log('Correo enviado con éxito');
        })
        .catch((error) => {
            console.error('Error al enviar el correo:', error);
        });
};

// Ruta para enviar el correo de verificación
app.post('/send-verification', (req, res) => {
    const { email } = req.body;
    const token = generateToken();

    // Guardamos el estado de la verificación como pendiente y asociamos el correo
    verificationStates[email] = { token, status: 'pending' };

    // Aquí deberías guardar el token en tu base de datos asociado al correo del administrador
    console.log('Token generado:', token);

    sendVerificationEmail(email, token);
    res.send('Correo de verificación enviado');
});

// Ruta para procesar la verificación del administrador
app.get('/verify', (req, res) => {
    const { token, action } = req.query;

    if (!token || !action) {
        return res.status(400).send('Faltan parámetros');
    }

    // Buscar la verificación por token
    let email = null;
    for (let [key, value] of Object.entries(verificationStates)) {
        if (value.token === token) {
            email = key;
            break;
        }
    }

    if (email) {
        if (action === 'accept') {
            verificationStates[email].status = 'accepted';
            res.send('Administrador aceptado correctamente');
        } else if (action === 'deny') {
            verificationStates[email].status = 'denied';
            res.send('Administrador denegado');
        } else {
            res.status(400).send('Acción no válida');
        }
    } else {
        res.status(400).send('Token no encontrado');
    }
});

// Ruta para consultar el estado de verificación usando el correo
app.get('/check-verification', (req, res) => {
    const { email } = req.query;

    if (!email || !verificationStates[email]) {
        return res.status(400).send('Correo no encontrado');
    }

    const state = verificationStates[email].status;
    res.send(`El estado de la verificación de ${email} es: ${state}`);
});

// Iniciar el servidor en el puerto 3001
const port = process.env.PORT || 3001;  // El puerto puede ser configurado por Azure
app.listen(port, () => {
    console.log(`Backend corriendo en http://localhost:${port}`);
});

