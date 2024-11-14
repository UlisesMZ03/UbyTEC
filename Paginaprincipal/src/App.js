import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Registrarse from "./components/pages/Registrarse";
import AdminDashboard from "./components/pages/AdminDashboard";
import ClientView from "./components/pages/ClientView";
import OnlineStore from "./components/pages/OnlineStore";
import ManageStore from "./components/pages/ManageStore";
import { AuthProvider } from "./AuthContext";
import ProfileManagement from "./components/pages/ProfileManagement";
import DeviceReports from "./components/pages/DeviceReports";
import UserProfilePage from './components/pages/UserProfilePage';
import ProductDetails from './components/pages/ProductDetails';
import DeliveryHome from './components/pages/DeliveryHome';
import RestaurantDetail from "./components/pages/RestaurantDetail";
import CarritoPage from "./components/pages/CarritoPage";
import CheckOut from './components/pages/CheckOut';
import { CartProvider } from "./CartContext"; // Importa CartProvider
import ArticleSection from "./components/ArticleSection"; // Importa el footer aquí

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider> {/* Envolvemos la aplicación con CartProvider */}
          <Router>
            <div id="root">
              <Navbar />
              <div className="main-content">
                <Routes>
                  <Route path="/" exact element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registrarse" element={<Registrarse />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/client" element={<ClientView />} />
                  <Route path="/tienda" element={<OnlineStore />} />
                  <Route path="/producto/:id" element={<ProductDetails />} />
                  <Route path="/gestionar-tienda" element={<ManageStore />} />
                  <Route path="/profile" element={<ProfileManagement />} />
                  <Route path="/reports" element={<DeviceReports />} />
                  <Route path="/user-profile" element={<UserProfilePage />} />
                  <Route path="/delivery" element={<DeliveryHome />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                  <Route path="/carrito" element={<CarritoPage />} />
                  <Route path="/checkout" element={<CheckOut />} />
                </Routes>
              </div>
              <ArticleSection /> {/* El footer siempre estará al final */}
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
