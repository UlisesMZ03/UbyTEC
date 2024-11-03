import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

function App() {
  const getInfo = () => {
    axios
      .get("https://localhost:5555/api/Users")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postInfo = () => {
    axios
      .post("https://localhost:5555/api/Users", {
        "Nombre": "Guz",
        "Apellidos": "Guz",
        "Region": "San José",
        "CorreoElectronico": "Guz@example.com",
        "Contraseña": "password123",
        "DireccionEntrega": "Calle Falsa 123",
        "Dispositivos": []
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const putInfo = () => {
    axios
      .put("https://localhost:5555/api/Users/6", {
        name: "Gabriel",
        lastName: "Guzman",
        region: "Costa Rica",
        email: "guz@gmail.com",
        password: "abcd",
        address: "Cartago",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteInfo = () => {
    axios
      .delete("https://localhost:5555/api/Users/6")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h1>API Test</h1>
      <div>
        <button onClick={getInfo}>Get</button>
      </div>
      <div>
        <button onClick={postInfo}>Post</button>
      </div>
      <div>
        <button onClick={putInfo}>Put</button>
      </div>
      <div>
        <button onClick={deleteInfo}>Delete</button>
      </div>
    </>
  );
}

export default App;
