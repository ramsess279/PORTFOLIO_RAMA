import { Card } from "@/components/ui/card";
 import educationData from "@/data/education.json";

const FormationsSection = () => {
  const formations = educationData.educations;

  return (
    <section className="min-h-screen flex items-center justify-center py-20 pb-32 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-5xl font-bold text-center mb-16 text-foreground animate-fade-in">
          Formations
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {formations.map((formation, index) => (
            <Card
              key={index}
              className="glass hover-glow p-6 rounded-2xl animate-scale-in group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative flex flex-col items-center">
                {/* Image de formation (avatar générique, à remplacer si besoin) */}
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-primary/20 flex items-center justify-center mb-4 border-4 border-primary/30 hover:scale-105 transition-transform duration-300">
                  <svg className="w-12 h-12 md:w-16 md:h-16 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {formation.title}
                </h3>
                <p className="text-primary font-bold mb-1 text-lg md:text-xl">
                  {formation.institution}
                </p>
                <p className="text-muted-foreground text-base md:text-lg">
                  {formation.period}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FormationsSection;
