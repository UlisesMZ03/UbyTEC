import React from "react";
import "../../App.css";
import HeroSection from "../HeroSection";
import ArticleSection from '../ArticleSection';
import GoalsSection from '../GoalsSection';

function Home() {
  return (
    <>
      <HeroSection />
      <GoalsSection />
      <ArticleSection />
    </>
  );
}

export default Home;
