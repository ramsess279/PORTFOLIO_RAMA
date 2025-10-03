import { Card } from "@/components/ui/card";
import { FaGraduationCap } from "react-icons/fa";

const Education = () => {
  const formations = [
    {
      titre: "Développement FullStack Web/Mobile",
      etablissement: "Orange Digital Center",
      periode: "2025 - En cours"
    },
    {
      titre: "Licence 2 IDA",
      etablissement: "Université Cheikh Hamidou Kane",
      periode: "2022 - En cours"
    },
    {
      titre: "DST en Génie Informatique",
      etablissement: "ESP",
      periode: "2022 - En cours"
    },
    {
      titre: "Bac S2",
      etablissement: "Complexe Symbiose",
      periode: "2021 - 2022"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-5xl font-bold text-center mb-16 text-foreground animate-fade-in">
          Formation
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {formations.map((formation, index) => (
            <Card
              key={index}
              className="glass hover-glow p-6 rounded-2xl animate-scale-in group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative flex flex-col items-center">
                {/* Icone graduation cap */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 shadow-xl border-4 border-primary/30">
                  <FaGraduationCap className="text-primary" style={{ width: '2.5rem', height: '2.5rem' }} />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {formation.titre}
                </h3>
                <p className="text-primary font-bold mb-1 text-lg md:text-xl">
                  {formation.etablissement}
                </p>
                <p className="text-muted-foreground text-base md:text-lg">
                  {formation.periode}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;