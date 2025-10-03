import { useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import FormationsSection from "@/components/sections/FormationsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import CompetencesSection from "@/components/sections/CompetencesSection";
import ProjetsSection from "@/components/sections/ProjetsSection";
import QualitesSection from "@/components/sections/QualitesSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");

  const sections = {
    hero: <HeroSection />,
    formations: <FormationsSection />,
    experience: <ExperienceSection />,
    competences: <CompetencesSection />,
    projets: <ProjetsSection />,
    qualites: <QualitesSection />,
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden cursor-none">
      <CustomCursor />
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="md:ml-64 transition-all duration-300">
        <div className="section-transition">
          {sections[activeSection as keyof typeof sections]}
        </div>
      </main>
    </div>
  );
};

export default Index;
