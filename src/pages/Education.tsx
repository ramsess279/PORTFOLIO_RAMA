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
      periode: "2022 - 2024"
    },
    {
      titre: "Bac S2",
      etablissement: "Complexe Symbiose",
      periode: "2021 - 2022"
    }
  ];

  return (
    <div className="flex justify-center pt-24 pb-6 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <div className="grid md:grid-cols-2 gap-6 justify-center">
          {formations.map((formation, index) => (
            <Card
              key={index}
              className="glass hover-glow p-6 rounded-2xl animate-scale-in group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative flex flex-col items-center">
                {/* Icone graduation cap */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 shadow-xl border-2 border-primary/30">
                  <FaGraduationCap className="text-white/70" style={{ width: '2rem', height: '2rem' }} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/80 mb-2">
                  {formation.titre}
                </h3>
                <p className="text-primary font-bold mb-1 text-lg md:text-xl">
                  {formation.etablissement}
                </p>
                <p className="text-white/70 text-base md:text-lg">
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