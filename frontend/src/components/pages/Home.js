import React, { useEffect, useState } from "react";
import "../../App.css";
import HeroSection from "../HeroSection";
import GoalsSection from "../GoalsSection";
import { useAuth } from "../../AuthContext"; // Importa el hook useAuth
import HeroSectionAdmin from "../HeroSectionAdmin";
import HeroSectionNL from "../HeroSectionNL";
import HeroSectionCom from "../HeroSectionComercio";
import GoalsSectionNL from "../GoalsSectionNL";
import { Element, scroller } from "react-scroll"; // Importa react-scroll

function Home() {
  const { user } = useAuth(); // Obtén el usuario desde el AuthContext
  const [lastScrollDirection, setLastScrollDirection] = useState(null);  // Estado para almacenar la última dirección del scroll
  const [currentSection, setCurrentSection] = useState("hero");  // Estado para saber en qué sección estamos
  const [scrollUpCount, setScrollUpCount] = useState(0);  // Contador para scroll hacia arriba

  useEffect(() => {
    const handleWheel = (event) => {
      if (event.deltaY > 0) {
        // Scroll hacia abajo: vamos a la siguiente sección
        if (currentSection !== "goals") {
          scroller.scrollTo('goals', {
            duration: 50,
            delay: 0,
            smooth: 'easeInOutQuart',
          });
          setCurrentSection("goals"); // Actualiza la sección actual
          setLastScrollDirection("down");
        }
      } else if (event.deltaY < 0) {
        // Scroll hacia arriba: queremos ir a la sección anterior
        if (currentSection === "goals" && scrollUpCount < 1) {
          // Si estamos en goals y no hemos hecho scroll hacia arriba antes, primero regresa a goals
          scroller.scrollTo('goals', {
            duration: 50,
            delay: 0,
            smooth: 'easeInOutQuart',
          });
          setScrollUpCount(1); // Primera vez que hacemos scroll hacia arriba
        } else if (currentSection === "goals" && scrollUpCount === 1) {
          // Si ya hemos hecho scroll hacia arriba una vez, ahora sí vamos a "hero"
          scroller.scrollTo('hero', {
            duration: 50,
            delay: 0,
            smooth: 'easeInOutQuart',
          });
          setCurrentSection("hero"); // Actualiza la sección actual
          setScrollUpCount(0); // Reinicia el contador para permitir el comportamiento normal
        } else if (currentSection === "hero") {
          // Si estamos en "hero", podemos seguir el comportamiento normal
          scroller.scrollTo('hero', {
            duration: 50,
            delay: 0,
            smooth: 'easeInOutQuart',
          });
        }
        setLastScrollDirection("up");
      }
    };

    // Añadir el listener para el scroll
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Limpiar el listener cuando el componente se desmonta
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSection, scrollUpCount]); // Dependemos de `currentSection` y `scrollUpCount` para gestionar la lógica

  return (
    <>
      {user ? (
        <>
          {user.role === "admin" && <HeroSectionAdmin />}
          {user.role === "afiliado" && <div>Sección para Afiliados</div>}
          {user.role === "client" && (
            <Element name="hero">
              <HeroSection />
            </Element>
          )}
          {user.role === "comercio_admin" && (
          <Element name="hero">
            <HeroSectionCom />
          </Element>)}
          {user.role === "comercio" && (
          <Element name="hero">
            <HeroSectionCom />
          </Element>)}
          <Element name="goals" className="section-goals">
            <GoalsSection />
          </Element>
        </>
      ) : (
        <>
          
          <Element name="hero">
            <HeroSectionNL />
          </Element>
          <Element name="goals" className="section-goals">
            <GoalsSectionNL />
          </Element>
        </>
      )}
    </>
  );
}

export default Home;
