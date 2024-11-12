import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import ClienteDashboard from "./components/pages/ClientDashboard";
import Register from "./components/pages/Register";
import CommerceLogin from "./components/pages/CommerceLogin";
import CommerceRegister from "./components/pages/CommerceRegister";
import CommerceDashboard from "./components/pages/CommerceDashboard";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/cliente" exact element={<ClienteDashboard />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/registerCommerce" exact element={<CommerceRegister />} />
          <Route path="/LoginCommerce" exact element={<CommerceLogin />} />
          <Route path="/CommerceDashboard" exact element={<CommerceDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
