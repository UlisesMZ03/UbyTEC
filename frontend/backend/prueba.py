import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuración del servidor SMTP (Gmail en este caso)
smtp_server = 'smtp.gmail.com'
smtp_port = 587
sender_email = 'castromontenegrokia@gmail.com'  # Cambia esto por tu correo
receiver_email = 'ulises128mz@gmail.com'  # Cambia esto por el correo del destinatario
password = 'hpzl room gzod kxmo'  # Cambia esto por tu contraseña

# Crea el mensaje
message = MIMEMultipart()
message['From'] = sender_email
message['To'] = receiver_email
message['Subject'] = 'Asunto del correo'

# Cuerpo del mensaje
body = 'Este es el cuerpo del correo.'
message.attach(MIMEText(body, 'plain'))

try:
    # Conexión al servidor SMTP y envío del correo
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()  # Inicia la conexión segura
        server.login(sender_email, password)  # Inicia sesión en tu cuenta
        text = message.as_string()  # Convierte el mensaje a una cadena
        server.sendmail(sender_email, receiver_email, text)  # Envia el correo
        print("Correo enviado exitosamente")
except Exception as e:
    print(f"Error al enviar el correo: {e}")
