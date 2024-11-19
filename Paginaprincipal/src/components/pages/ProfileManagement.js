import React, { useState, useEffect } from 'react';
import "../../App.css";
import { useAuth } from "../../AuthContext";
import "./ProfileManagement.css";

export default function ProfileManagement() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    nombre: user?.nombre || "",
    apellido1: user?.apellido1 || "",
    apellido2: user?.apellido2 || "",
    correo: user?.correo || "",
    cedula: user?.cedula || "",
    telefono: user?.telefono || "",
    usuario: user?.usuario || "",
    region: user?.region || "",
    direccionesEntrega: user?.direccionesEntrega || []
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar la edición de campos

  // Estados relacionados con las contraseñas
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados relacionados con las direcciones
  const [selectedAddressIndex, setSelectedAddressIndex] = useState("");
  const [newAddress, setNewAddress] = useState({
    calle: "",
    ciudad: "",
    codigoPostal: "",
    pais: ""
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [activeSection, setActiveSection] = useState("profileSettings");

  useEffect(() => {
    if (user) {
      setProfile({
        nombre: user.nombre || "",
        apellido1: user.apellido1 || "",
        apellido2: user.apellido2 || "",
        correo: user.correo || "",
        cedula: user.cedula || "",
        telefono: user.telefono || "",
        usuario: user.usuario || "",
        region: user.region || "",
        direccionesEntrega: user.direccionesEntrega || []
      });
      setLoading(false);
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:5555/api/users/${user.userId}/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          Id: user.userId,
          Nombre: profile.nombre,
          Apellido1: profile.apellido1,
          Apellido2: profile.apellido2,
          Cedula: profile.cedula,
          Telefono: profile.telefono,
          Usuario: profile.usuario,
          Region: profile.region,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Perfil actualizado con éxito");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al conectarse con la API:", error);
      setErrorMessage("Error al conectarse con la API");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        const response = await fetch(`https://localhost:5555/api/users/${user.userId}/updatePassword`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            CurrentPassword: currentPassword,
            NewPassword: newPassword,
          }),
        });

        if (response.ok) {
          alert("Contraseña actualizada con éxito");
        } else {
          const data = await response.json();
          alert(data.message || "Error al actualizar la contraseña");
        }
      } catch (error) {
        console.error("Error al conectarse con la API:", error);
        alert("Error al conectarse con la API");
      }
    } else {
      alert("Las contraseñas no coinciden");
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setSelectedAddressIndex(value);
    if (value === "add") {
      setIsAddingAddress(true);
      setNewAddress({ calle: "", ciudad: "", codigoPostal: "", pais: "" });
      setIsEditingAddress(false);
    } else {
      const address = profile.direccionesEntrega[value];
      setNewAddress(address || { calle: "", ciudad: "", codigoPostal: "", pais: "" });
      setIsAddingAddress(false);
      setIsEditingAddress(false);
    }
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:5555/api/users/${user.userId}/addAddress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        const addedAddress = await response.json();
        setProfile({
          ...profile,
          direccionesEntrega: [...profile.direccionesEntrega, addedAddress],
        });
        setNewAddress({ calle: "", ciudad: "", codigoPostal: "", pais: "" });
        setIsAddingAddress(false);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Error al agregar la dirección");
      }
    } catch (error) {
      console.error("Error al conectarse con la API:", error);
      setErrorMessage("Error al conectarse con la API");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:5555/api/users/${user.userId}/updateAddress/${newAddress.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        setProfile((prevProfile) => {
          const updatedAddresses = prevProfile.direccionesEntrega.map((direccion) =>
            direccion.id === newAddress.id ? newAddress : direccion
          );
          return { ...prevProfile, direccionesEntrega: updatedAddresses };
        });
        setSelectedAddressIndex("");
        setNewAddress({ calle: "", ciudad: "", codigoPostal: "", pais: "" });
        setIsEditingAddress(false);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Error al actualizar la dirección");
      }
    } catch (error) {
      console.error("Error al conectarse con la API:", error);
      setErrorMessage("Error al conectarse con la API");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Verificar el rol del usuario
  const isAdmin = user.role === 'admin';
  const isClient = user.role === 'client';
  // Cambiar la clase de la barra de navegación según la sección activa
  const navClass = activeSection === "profileSettings" ? "" : "nav-up";

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-3 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt="Profile" />
            <span className="font-weight-bold">{user.nombre}</span>
            <span className="text-black-50">{user.userId}</span>
          </div>
        </div>
        <div className="col-md-5 border-right">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-right" style={{ fontWeight: 'bold' }}>Perfil</h3>


            </div>

            <div className="nav">
              <ul className="links">
                <li className={`profileSettings-active ${activeSection === "profileSettings" ? "active" : ""}`}>
                  <a className="btn" onClick={() => setActiveSection("profileSettings")}>General</a>
                </li>
                <li className={`direcciones-inactive ${activeSection === "direcciones" ? "active" : ""}`}>
                  <a className="btn" onClick={() => setActiveSection("direcciones")}>Direcciones</a>
                </li>
                <li className={`seguridad-inactive ${activeSection === "seguridad" ? "active" : ""}`}>
                  <a className="btn" onClick={() => setActiveSection("seguridad")}>Seguridad</a>
                </li>
              </ul>
            </div>

            {/* Sección de Perfil */}
            {activeSection === "profileSettings" && (
              <div className="general">
              <form onSubmit={handleProfileSubmit}>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label className="labels">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="nombre"
                      name="nombre"
                      value={profile.nombre}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="labels">Apellido 1</label>
                    <input
                      type="text"
                      className="form-control"
                      name="apellido1"
                      value={profile.apellido1}
                      placeholder="Apellido 1"
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="labels">Apellido 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="apellido2"
                      value={profile.apellido2}
                      placeholder="Apellido 2"
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                      <label className="labels">Usuario</label>
                      <input
                        type="text"
                        className="form-control"
                        name="usuario"
                        value={profile.usuario}
                        placeholder="Usuario"
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                      />
                    </div>
                </div>

                {isClient && (
                  <>
                    <div className="mt-3">
                      <label className="labels">Cédula</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cedula"
                        value={profile.cedula}
                        placeholder="Cédula"
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="mt-3">
                      <label className="labels">Teléfono</label>
                      <input
                        type="text"
                        className="form-control"
                        name="telefono"
                        value={profile.telefono}
                        placeholder="Teléfono"
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </>
                )}

                <div className="mt-3">
                  <label className="labels">Email ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="enter email id"
                    value={profile.correo}
                    disabled
                  />
                </div>

                <div className="mt-5 text-center">
                  <button 
                    className="btn btn-primary profile-button" 
                    type="button"
                    onClick={() => setIsEditing(!isEditing)} // Cambiar el estado de edición
                  >
                    {isEditing ? 'Guardar Perfil' : 'Editar Perfil'}
                  </button>
                </div>
              </form>
              </div>
            )}

            {/* Sección de Seguridad */}
            {activeSection === "seguridad" && (
              <div className='seguridad'>
                <h5>Cambiar Contraseña</h5>
              <form onSubmit={handlePasswordChange}>
                <div className="row mt-2">
                  <div className="segu">
                    <label className="labels">Contraseña Actual</label>
                    <input
                      type="password"
                      className="form-control"
                      name="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="segu">
                    <label className="labels">Nueva Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="segu">
                    <label className="labels">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <button className="btn btn-primary profile-button" type="submit" disabled={!isEditing}>Cambiar Contraseña</button>
                </div>
              </form>
              </div>
            )}

            {/* Sección de Direcciones */}
            {activeSection === "direcciones" && (
              <div className='direcciones'>
              <div>
                Direcciones
                <select className="form-control mb-3" onChange={handleAddressChange} value={selectedAddressIndex}>
                  <option value="">Seleccione una dirección</option>
                  {profile.direccionesEntrega.map((direccion, index) => (
                    <option key={index} value={index}>
                      {direccion.calle}, {direccion.ciudad}, {direccion.codigoPostal}, {direccion.pais}
                    </option>
                  ))}
                  <option value="add">Agregar nueva dirección</option>
                </select>

                {selectedAddressIndex !== "" && (
                  <div className="table-responsive mb-3">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Calle</th>
                          <th>Ciudad</th>
                          <th>Código Postal</th>
                          <th>País</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ backgroundColor: "#f8f9fa" }}>
                          <td>{newAddress.calle}</td>
                          <td>{newAddress.ciudad}</td>
                          <td>{newAddress.codigoPostal}</td>
                          <td>{newAddress.pais}</td>
                        </tr>
                      </tbody>
                    </table>
                    <button className="btn btn-secondary" onClick={() => setIsEditingAddress(true)}>Editar Dirección</button>
                  </div>
                )}

                {isAddingAddress && (
                  <form onSubmit={handleAddAddressSubmit} className="mt-4">
                    <h5>Agregar Nueva Dirección</h5>
                    <div className="form-group">
                      <label>Calle</label>
                      <input
                        type="text"
                        className="form-control"
                        name="calle"
                        value={newAddress.calle}
                        onChange={handleNewAddressChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Ciudad</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ciudad"
                        value={newAddress.ciudad}
                        onChange={handleNewAddressChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Código Postal</label>
                      <input
                        type="text"
                        className="form-control"
                        name="codigoPostal"
                        value={newAddress.codigoPostal}
                        onChange={handleNewAddressChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>País</label>
                      <input
                        type="text"
                        className="form-control"
                        name="pais"
                        value={newAddress.pais}
                        onChange={handleNewAddressChange}
                      />
                    </div>
                    <button className="btn btn-secondary" type="submit">Agregar Dirección</button>
                  </form>
                )}
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
