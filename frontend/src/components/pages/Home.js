import React from "react";
import "../../App.css";
import HeroSection from "../HeroSection";
import ArticleSection from '../ArticleSection';
import GoalsSection from '../GoalsSection';
import AdminDashboard from "./AdminDashboard";
import { useAuth } from "../../AuthContext"; // Importa el hook useAuth
import HeroSectionAdmin from "../HeroSectionAdmin";
import HeroSectionNL from "../HeroSectionNL";
import GoalsSectionNL from "../GoalsSectionNL"
function Home() {
  const { user } = useAuth(); // Obtén el usuario desde el AuthContext

  return (
    <>
      {user ? (
        // Si el usuario está logueado
        <>
          
          
          {user.role === "admin" && <HeroSectionAdmin />}  {/* Solo para administradores */}
          
          {user.role === "afiliado" && <div>Sección para Afiliados</div>} {/* Solo para afiliados */}
          {user.role === "client" && <HeroSection />} {/* Solo para clientes */}
          <GoalsSection />
        </>
      ) : (
        // Si el usuario no está logueado
        <>
        
        <HeroSectionNL /> 
        <GoalsSectionNL />
        </>
      )}
    </>
  );
}

export default Home;
