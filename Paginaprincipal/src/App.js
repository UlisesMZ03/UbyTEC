// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Registrarse from "./components/pages/Registrarse";
import AdminDashboard from "./components/pages/AdminDashboard";
import ClientView from "./components/pages/ClientView";
import OnlineStore from "./components/pages/OnlineStore";
import ManageStore from "./components/pages/ManageStore";
import ProfileManagement from "./components/pages/ProfileManagement";
import DeviceReports from "./components/pages/DeviceReports";
import UserProfilePage from './components/pages/UserProfilePage';
import ProductDetails from './components/pages/ProductDetails';
import DeliveryHome from './components/pages/DeliveryHome';
import RestaurantDetail from "./components/pages/RestaurantDetail";
import CarritoPage from "./components/pages/CarritoPage";
import CheckOut from './components/pages/CheckOut';
import { AuthProvider } from "./AuthContext";  // Asegúrate de que el contexto esté correctamente configurado
import { CartProvider } from "./CartContext";  // Importa el proveedor del carrito de compras
import ArticleSection from "./components/ArticleSection";  // Importa el footer aquí
import PrivateRoute from './components/PrivateRoute';  // Importamos el componente PrivateRoute
import RegistroComercio from "./components/pages/RegistroComercio";
import PedidoPage from "./components/pages/Pedidos";
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div id="root">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registrarse" element={<Registrarse />} />
                
                {/* Ruta protegida para Admin */}
                <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} role="admin" />} />
                
                {/* Ruta protegida para Cliente */}
                <Route path="/client" element={<PrivateRoute element={<ClientView />} role="client" />} />
                <Route path="/pedidos" element={<PrivateRoute element={<PedidoPage />} role="client" />} />
                <Route path="/tienda" element={<OnlineStore />} />
                <Route path="/producto/:id" element={<ProductDetails />} />
                
                {/* Ruta protegida para gestionar la tienda */}
                <Route path="/gestionar-tienda" element={<PrivateRoute element={<ManageStore />} role="admin" />} />
                
                <Route path="/profile" element={<ProfileManagement />} />
                <Route path="/reports" element={<DeviceReports />} />
                <Route path="/user-profile" element={<UserProfilePage />} />
                
                {/* Ruta protegida para Delivery */}
                <Route path="/delivery" element={<PrivateRoute element={<DeliveryHome />} role="client" />} />
                
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/carrito" element={<PrivateRoute element={<CarritoPage />} role="client" />} />
                <Route path="/checkout" element={<PrivateRoute element={<CheckOut />} role="client" />} />
                <Route path="/rcomercio" element={<RegistroComercio />} />

              </Routes>
            </div>
            <ArticleSection /> {/* El footer siempre estará al final */}
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
