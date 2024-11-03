import React, { useState, useEffect } from 'react';
import "../../App.css";
import { useAuth } from "../../AuthContext";
import "./ProfileManagement.css";

export default function ProfileManagement() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    region: "",
    direccionesEntrega: []
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito
  const [selectedAddressIndex, setSelectedAddressIndex] = useState("");
  const [newAddress, setNewAddress] = useState({
    calle: "",
    ciudad: "",
    codigoPostal: "",
    pais: ""
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activeSection, setActiveSection] = useState("profileSettings");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user && user.userId) {
          const response = await fetch(`https://localhost:5555/api/users/${user.userId}/details`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            }
          });

          const data = await response.json();

          if (response.ok) {
            setProfile({
              nombre: data.nombre,
              apellidos: data.apellidos,
              email: data.correoElectronico,
              region: data.region,
              direccionesEntrega: data.direccionesEntrega
            });
            setLoading(false);
          } else {
            setErrorMessage(data.message || "Error al obtener los datos del usuario");
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error al conectarse con la API:", error);
        setErrorMessage("Error al conectarse con la API");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
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
          Apellidos: profile.apellidos,
          Region: profile.region,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Perfil actualizado con éxito");
      } else {
        const data = await response.json();
        console.error("Error en la respuesta de la API:", data); // Agregado para depuración
        setErrorMessage(data.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al conectarse con la API:", error);
      setErrorMessage("Error al conectarse con la API");
    }
  };


  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-3 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt="Profile" />
            <span className="font-weight-bold">{profile.nombre}</span>
            <span className="text-black-50">{profile.email}</span>
          </div>
        </div>
        <div className="col-md-5 border-right">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Profile Management</h4>
            </div>

            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeSection === "profileSettings" ? "active" : ""}`} 
                  onClick={() => setActiveSection("profileSettings")}
                >
                  Profile Settings
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeSection === "direcciones" ? "active" : ""}`} 
                  onClick={() => setActiveSection("direcciones")}
                >
                  Direcciones
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeSection === "seguridad" ? "active" : ""}`} 
                  onClick={() => setActiveSection("seguridad")}
                >
                  Seguridad
                </a>
              </li>
            </ul>

            {activeSection === "profileSettings" && (
              <form onSubmit={handleProfileSubmit}>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label className="labels">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="first name"
                      name="nombre"
                      value={profile.nombre}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="labels">Surname</label>
                    <input
                      type="text"
                      className="form-control"
                      name="apellidos"
                      value={profile.apellidos}
                      placeholder="surname"
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="labels">Email ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="enter email id"
                    value={profile.email}
                    disabled
                  />
                </div>
                <div className="mt-3">
                  <label className="labels">Region</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="enter region"
                    name="region"
                    value={profile.region}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="mt-5 text-center">
                  <button className="btn btn-primary profile-button" type="submit">Guardar Perfil</button>
                  <button className="btn btn-secondary profile-button" type="button" onClick={handleProfileSubmit}>Actualizar Datos</button>
                </div>
                {errorMessage && <div className="text-danger">{errorMessage}</div>}
                {successMessage && <div className="text-success">{successMessage}</div>}
              </form>
            )}

            {activeSection === "direcciones" && (
              <div>
                <h4>Direcciones</h4>
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

                {isEditingAddress && (
                  <div className="mt-4">
                    <h5>Editar Dirección</h5>
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
                    <button className="btn btn-secondary" onClick={handleAddressSubmit}>Actualizar Dirección</button>
                  </div>
                )}
              </div>
            )}

            {activeSection === "seguridad" && (
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-secondary" type="submit">Actualizar Contraseña</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
