
import React, { useState, useEffect } from "react";
import axios from "axios"; // Importa axios para hacer solicitudes HTTP
import "./RegistrarAfiliado.css";

const AgregarAdministrador = ({ setCorreo, setDatosAdministrador, datosAdministrador, isCreatingAccount, setIsCreatingAccount, email }) => {
  const [emailError, setEmailError] = useState(""); // Estado para el error de validación
  const [isEmailValid, setIsEmailValid] = useState(false); // Estado para saber si el correo es válido
  const [verificationStatus, setVerificationStatus] = useState(""); // Estado para mostrar el estado de la verificación
  const [message, setMessage] = useState(""); // Estado para mensajes de error o éxito
  const [correo, setEmail] = useState(""); // El estado para el correo y su setter
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el estado de envío

  // Sincroniza el estado correo con el email que viene como prop
  useEffect(() => {
    setEmail(email); // Sincroniza correo con el valor de email
  }, [email]); // Solo se ejecuta cuando `email` cambie

  useEffect(() => {
    if (verificationStatus) {
      localStorage.setItem('verificationStatus', verificationStatus);
    }
  }, [verificationStatus]);

  useEffect(() => {
    if (correo) {
      checkVerificationStatus();
    }
  }, [correo]);

  const handleOptionChange = (e) => {
    setIsCreatingAccount(e.target.value === "crearCuenta");
  };

  // Función para enviar el correo de verificación
// Función para enviar el correo de verificación
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Establece el estado a "enviando"
    console.log("se envio el form" + isCreatingAccount);

    // Primero, enviamos el correo de verificación
    if (!isCreatingAccount) {
      try {
        const response = await axios.post('http://localhost:3001/send-verification', { email: correo });
        console.log("Correo de verificación enviado con éxito a " + correo);
        setMessage("Correo de verificación enviado con éxito a " + correo);
        checkVerificationStatus();
      } catch (error) {
        console.error("Error al enviar el correo: ", error);
        setMessage("Hubo un error al enviar el correo");
        setIsSubmitting(false);
      }
    }

    // Si se está creando una cuenta, llamamos al API para registrar el administrador
// Si se está creando una cuenta, llamamos al API para registrar al administrador
if (isCreatingAccount) {
    console.log("se envio el form");
    try {
      // Llamada al API para registrar al administrador
      const response = await axios.post('http://localhost:5133/api/comercios/registrarAdmin', {
        correo: datosAdministrador.usuario,
        nombre: datosAdministrador.nombre,
        apellido1: datosAdministrador.apellido1,
        apellido2: datosAdministrador.apellido2,
        usuario: datosAdministrador.usuario,
        cedula: datosAdministrador.cedula,
        provincia: datosAdministrador.provincia,
        canton: datosAdministrador.canton,
        distrito: datosAdministrador.distrito,
      });
  
      if (response.data.message === "Administrador afiliado insertado con éxito.") {
        // Guardamos el correo registrado en lugar de datosAdministrador.usuario
        setDatosAdministrador({
          ...datosAdministrador,
          correoReg: datosAdministrador.usuario,  // Guardamos el correo en correoReg
        });
        
        setMessage("Administrador registrado con éxito.");
        setIsSubmitting(false); // Cambia el estado a "no enviando"
      } else {
        setMessage("Hubo un error al registrar el administrador.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error al registrar administrador:", error);
      setMessage("Hubo un error al registrar el administrador.");
      setIsSubmitting(false);
    }
  } else {
    setMessage("Por favor, complete todos los campos.");
    setIsSubmitting(false);
  }
  
  };

  // Función para consultar el estado de la verificación
  const checkVerificationStatus = async () => {
    if (!isCreatingAccount){
    try {
      const response = await axios.get(`http://localhost:3001/check-verification?email=${correo}`);
      console.log(response.data);

      if (response.data && response.data.includes && response.data.includes("accepted")) {
        setVerificationStatus("accepted");
        setIsEmailValid(true);
        setCorreo(correo);
      } else {
        setVerificationStatus("pending");
        setIsEmailValid(false);
        setMessage("El correo no está verificado. No puede enviar el formulario.");
      }
    } catch (error) {
      setVerificationStatus("Error al consultar el estado de verificación");
    }}
  };

  useEffect(() => {
    // Definir el intervalo de 5 segundos
    const intervalId = setInterval(() => {
      checkVerificationStatus();
    }, 5000);

    // Detener la verificación después de 10 minutos
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId); // Detener el intervalo después de 10 minutos
    }, 600000); // 10 minutos en milisegundos

    // Limpiar los temporizadores cuando el componente se desmonte
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [correo]); // Re-iniciar el efecto si cambia el correo
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isCreatingAccount) {
        setCorreo(datosAdministrador.usuario); // Aquí se guarda en el estado de correo correctamente
    } 
    else{
        setCorreo(correo)
    }
    setDatosAdministrador(datosAdministrador);
};
  return (
    <div>
      <h3>Agregar Administrador</h3>
      <form onSubmit={handleSubmit}>  {/* Aquí se asegura que el formulario ejecute handleSubmit */}
  <div className="form-radio-container">
    <div className="radio-option">
      <label>
        <input
          type="radio"
          name="opcionAdministrador"
          value="ingresarCorreo"
          checked={!isCreatingAccount}
          onChange={handleOptionChange}
        />
        Ingresar correo de administrador existente
      </label>
    </div>
    <div className="radio-option">
      <label>
        <input
          type="radio"
          name="opcionAdministrador"
          value="crearCuenta"
          checked={isCreatingAccount}
          onChange={handleOptionChange}
        />
        Crear cuenta de administrador
      </label>
    </div>
  </div>

  {!isCreatingAccount && (
    <div>
      <label>
        Correo del Administrador:
        <input
          type="email"
          value={correo} // Aquí se usa el estado correo
          onChange={(e) => setEmail(e.target.value)} // Actualiza el estado correo cuando cambia el input
          placeholder="correo@dominio.com"
          required
        />
      </label>
      <button
        type="submit" // El botón ahora llama al handleSubmit al ser presionado
        className={`verify-button ${verificationStatus === "pending" ? "verificando" : ""} ${verificationStatus === "accepted" ? "aceptado" : ""}`}
        disabled={verificationStatus === "pending"} // Deshabilitar el botón si el estado es pendiente
      >
        {verificationStatus === "pending" ? (
          <>
            Verificando...<div className="spinner"></div>
          </>
        ) : (
          verificationStatus === "accepted" ? (
            "Correo verificado"
          ) : (
            "Enviar correo de verificación"
          )
        )}
      </button>

      {message && <p>{message}</p>}
    </div>
  )}

  {/* Si se seleccionó "Crear cuenta", muestra los campos para nombre, correo y contraseña */}
  {isCreatingAccount && (
    <div>
      <label>
        Cédula:
        <input
          type="text"
          value={datosAdministrador.cedula}
          onChange={(e) => setDatosAdministrador({ ...datosAdministrador, cedula: e.target.value })}
          required
        />
      </label>
      <div>
        <label>
          Nombre:
          <input
            type="text"
            value={datosAdministrador.nombre}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, nombre: e.target.value })}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Primer Apellido:
          <input
            type="text"
            value={datosAdministrador.apellido1}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, apellido1: e.target.value })}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Segundo Apellido:
          <input
            type="text"
            value={datosAdministrador.apellido2}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, apellido2: e.target.value })}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Usuario (Correo):
          <input
            type="email"
            value={datosAdministrador.usuario}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, usuario: e.target.value })}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Provincia:
          <input
            type="text"
            value={datosAdministrador.provincia}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, provincia: e.target.value })}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Cantón:
          <input
            type="text"
            value={datosAdministrador.canton}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, canton: e.target.value })}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Distrito:
          <input
            type="text"
            value={datosAdministrador.distrito}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, distrito: e.target.value })}
            required
          />
        </label>
      </div>
    </div>
  )}

  <div>
    <button type="submit" disabled={isSubmitting}>
      {isCreatingAccount ? (isSubmitting ? "Creando cuenta..." : "Crear Cuenta") : "Ingresar Correo"}
    </button>
  </div>

  {/* Mostrar el mensaje de éxito o error */}
  {message && <p>{message}</p>}
</form>

    </div>
  );
};



// Componente para agregar los datos del comercio
const AgregarDatosComercio = ({ correoAdmin, setDatosComercio, datosComercio }) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setDatosComercio(datosComercio); // Actualizamos los datos del comercio
    console.log("Datos del comercio", datosComercio);
  };

  return (
    <div>
      <h3>Agregar Datos del Comercio</h3>
      <form onSubmit={handleFormSubmit}>
      <div>
  <label>
    Nombre del Comercio:
    <input
      type="text"
      value={datosComercio.nombreComercio}
      onChange={(e) => setDatosComercio({ ...datosComercio, nombreComercio: e.target.value })}
      required
    />
  </label>
</div>
<div>
  <label>
    Correo del Comercio:
    <input
      type="text"
      value={datosComercio.correoComercio}
      onChange={(e) => setDatosComercio({ ...datosComercio, correoComercio: e.target.value })}
      required
    />
  </label>
</div>
<div>
  <label>
    Cédula Jurídica:
    <input
      type="text"
      value={datosComercio.cedulaJuridica}
      onChange={(e) => setDatosComercio({ ...datosComercio, cedulaJuridica: e.target.value })}
      required
    />
  </label>
</div>
<div>
  <label>
    Número SINPE:
    <input
      type="text"
      value={datosComercio.numeroSINPE}
      onChange={(e) => setDatosComercio({ ...datosComercio, numeroSINPE: e.target.value })}
      required
    />
  </label>
</div>
<div>
  <label>
    Tipo de ID:
    <input
      type="text"
      value={datosComercio.tipoID}
      onChange={(e) => setDatosComercio({ ...datosComercio, tipoID: e.target.value })}
      required
    />
  </label>
</div>
<div>
  <label>
    Provincia:
    <input
      type="text"
      value={datosComercio.provincia}
      onChange={(e) => setDatosComercio({ ...datosComercio, provincia: e.target.value })}
      required
    />
  </label>
</div>
<div>
  <label>
    Cantón:
    <input
      type="text"
      value={datosComercio.canton}
      onChange={(e) => setDatosComercio({ ...datosComercio, canton: e.target.value })}
      required
    />
  </label>
</div>
<div>
  <label>
    Distrito:
    <input
      type="text"
      value={datosComercio.distrito}
      onChange={(e) => setDatosComercio({ ...datosComercio, distrito: e.target.value })}
      required
    />
  </label>
</div>
<div>
  <label>
    Imagen:
    <input
      type="text"
      value={datosComercio.imagen}
      onChange={(e) => setDatosComercio({ ...datosComercio, imagen: e.target.value })}
    />
  </label>
</div>

        </form>
        <div>
          <button type="submit">Guardar Datos</button>
        </div>
       
      <form/>
    </div>
  );
};

// Componente para finalizar el proceso

const Finalizar = ({ datosAdministrador, datosComercio, isCreatingAccount, email }) => {
    // Local state to manage the verification status
    const [verificationStatus, setVerificationStatus] = useState(null);
  
    // Determine which email to display based on the selected option
    const correoAdministrador = isCreatingAccount ? datosAdministrador.correoReg : email;
  
    const checkVerificationStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/check-verification?email=${correoAdministrador}`);
        console.log(response.data); // Verifies the response
  
        if (response.data && response.data.includes && response.data.includes("accepted")) {
          setVerificationStatus("accepted");
        } else {
          setVerificationStatus("pending");
        }
      } catch (error) {
        setVerificationStatus("Error al consultar el estado de verificación");
      }
    };
  
    useEffect(() => {
      if (!isCreatingAccount) {
        checkVerificationStatus(); // Trigger verification status check only when not creating account
      } else {
        setVerificationStatus("accepted"); // Set status as accepted when creating account
      }
    }, [email, isCreatingAccount]); // Re-run the effect when email or isCreatingAccount changes
  
    return (
      <div className="finalizar-container">
        <h3>Finalizar</h3>
        <h5>Correo del Administrador: {correoAdministrador}</h5> {/* Show email based on selected option */}
        <h5>Estado de Verificación: {verificationStatus ? verificationStatus : "No se ha consultado el estado"}</h5> {/* Show verification status */}
        <h5>Datos del Comercio:</h5>
        <div className="finalizar-grid">
          <div className="label">Nombre:</div>
          <div className="value">{datosComercio.nombreComercio}</div>
          <div className="label">Cédula Jurídica:</div>
          <div className="value">{datosComercio.cedulaJuridica}</div>
          <div className="label">Número SINPE:</div>
          <div className="value">{datosComercio.numeroSINPE}</div>
          <div className="label">Correo del Comercio:</div>
          <div className="value">{datosComercio.correoComercio}</div>
          <div className="label">Tipo de ID:</div>
          <div className="value">{datosComercio.tipoID}</div>
          <div className="label">Provincia:</div>
          <div className="value">{datosComercio.provincia}</div>
          <div className="label">Cantón:</div>
          <div className="value">{datosComercio.canton}</div>
          <div className="label">Distrito:</div>
          <div className="value">{datosComercio.distrito}</div>
          <div className="label">Imagen:</div>
          <div className="value">{datosComercio.imagen}</div>
        </div>
      </div>
    );
  };
// Componente para registrar el afiliado
const RegistrarAfiliado = () => {
    const [activeSection, setActiveSection] = useState("agregarAdministrador");
    const [email, setEmail] = useState(""); // Cambié "correo" a "email"
    const [datosAdministrador, setDatosAdministrador] = useState({});
    const [datosComercio, setDatosComercio] = useState({});
    const [isCreatingAccount, setIsCreatingAccount] = useState(false); // Mover aquí el estado
    const [verificationStatus, setVerificationStatus] = useState(""); // Estado para mostrar el estado de la verificación
  
    // Cargar el estado del localStorage al montar el componente
    useEffect(() => {
      const storedActiveSection = localStorage.getItem("activeSection");
      if (storedActiveSection) {
        setActiveSection(storedActiveSection);
      }
  
      const storedEmail = localStorage.getItem("email"); // Cambié "correo" a "email"
      if (storedEmail) {
        setEmail(storedEmail); // Cargar email desde localStorage
      }
  
      const storedDatosAdministrador = localStorage.getItem("datosAdministrador");
      if (storedDatosAdministrador) {
        setDatosAdministrador(JSON.parse(storedDatosAdministrador));
      }
  
      const storedDatosComercio = localStorage.getItem("datosComercio");
      if (storedDatosComercio) {
        setDatosComercio(JSON.parse(storedDatosComercio));
      }
  
      const storedIsCreatingAccount = localStorage.getItem("isCreatingAccount");
      if (storedIsCreatingAccount) {
        setIsCreatingAccount(JSON.parse(storedIsCreatingAccount));
      }
  
      const storedVerificationStatus = localStorage.getItem("verificationStatus");
      if (storedVerificationStatus) {
        setVerificationStatus(storedVerificationStatus);
      }
    }, []); // Solo se ejecuta una vez al montar el componente
  
    // Guardar el estado en el localStorage cuando cambia
    useEffect(() => {
      localStorage.setItem("activeSection", activeSection);
      localStorage.setItem("email", email);  // Guardar el email en localStorage
      localStorage.setItem("datosAdministrador", JSON.stringify(datosAdministrador));
      localStorage.setItem("datosComercio", JSON.stringify(datosComercio));
      localStorage.setItem("isCreatingAccount", JSON.stringify(isCreatingAccount));
      localStorage.setItem("verificationStatus", verificationStatus);
    }, [activeSection, email, datosAdministrador, datosComercio, isCreatingAccount, verificationStatus]); // Guardar todo el estado cuando cambia
  
    return (
      <div className="app-container">
        <nav className="nav-menu-afiliado">
          <ul>
            <li
              onClick={() => setActiveSection("agregarAdministrador")}
              className={activeSection === "agregarAdministrador" ? "active" : ""}
            >
              Agregar Administrador
            </li>
            <li
              onClick={() => setActiveSection("agregarDatosComercio")}
              className={activeSection === "agregarDatosComercio" ? "active" : ""}
            >
              Agregar Datos del Comercio
            </li>
            <li
              onClick={() => setActiveSection("finalizar")}
              className={activeSection === "finalizar" ? "active" : ""}
            >
              Finalizar
            </li>
          </ul>
        </nav>
  
        <div className="content">
          {activeSection === "agregarAdministrador" && (
            <>
              {console.log("Sección: Agregar Administrador", {
                setCorreo: setEmail,
                setDatosAdministrador,
                datosAdministrador,
                isCreatingAccount,
                setIsCreatingAccount,
                setVerificationStatus,
                email
              })}
              <AgregarAdministrador 
                setCorreo={setEmail} 
                setDatosAdministrador={setDatosAdministrador} 
                datosAdministrador={datosAdministrador} 
                isCreatingAccount={isCreatingAccount} 
                setIsCreatingAccount={setIsCreatingAccount} 
                setVerificationStatus={setVerificationStatus} 
                email={email} // Pasar "email" en vez de "correo"
              />
            </>
          )}
          {activeSection === "agregarDatosComercio" && (
            <>
              {console.log("Sección: Agregar Datos del Comercio", {
                correoAdmin: email,
                setDatosComercio,
                datosComercio
              })}
              <AgregarDatosComercio correoAdmin={email} setDatosComercio={setDatosComercio} datosComercio={datosComercio} />
            </>
          )}
          {activeSection === "finalizar" && (
            <>
              {console.log("Sección: Finalizar", {
                datosAdministrador,
                datosComercio,
                verificationStatus,
                isCreatingAccount,
                email
              })}
              <Finalizar datosAdministrador={datosAdministrador} datosComercio={datosComercio} verificationStatus={verificationStatus} isCreatingAccount={isCreatingAccount} email={email} />
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default RegistrarAfiliado;
  