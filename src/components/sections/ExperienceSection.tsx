import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ExperienceSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 pb-32 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-5xl font-bold text-center mb-16 text-foreground animate-fade-in">
          Expérience
        </h2>
        <Card className="glass hover-glow p-8 rounded-2xl animate-scale-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Développement Web
                </h3>
                <p className="text-primary font-medium">
                  Multimédia, TGI
                </p>
              </div>
              <Badge variant="secondary" className="text-sm bg-primary/20 text-primary border-primary/30">
                Juin 2024 - Juillet 2024
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Développement d'un projet de gestion d'une flotte automobile avec interface multi-rôles.
              Conception et implémentation de fonctionnalités avancées pour la gestion des véhicules,
              des conducteurs et des missions.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ExperienceSection;
