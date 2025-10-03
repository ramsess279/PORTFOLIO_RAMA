import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";

const ProjetsSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 2;

  const projets = [
    {
      titre: "Esite",
      tech: ["HTML", "CSS"],
      description: "Site vitrine pour la vente de colliers et accessoires. Interface élégante et responsive pour présenter les produits.",
      duree: "1 semaine",
      referent: "Birame Baila Wane - +221 XX XXX XX XX | WhatsApp",
      image: "/placeholder.svg",
      demo: "#", // À ajouter plus tard
      difficulty: 1
    },
    {
      titre: "Gestion apprenant",
      tech: ["PHP", "HTML", "CSS"],
      description: "Application complète de gestion des apprenants de l'ODC. Système de suivi des étudiants avec fonctionnalités CRUD.",
      duree: "3 semaines",
      referent: "Aly Tall Niang - +221 XX XXX XX XX | WhatsApp",
      image: "/placeholder.svg",
      demo: "#", // À ajouter plus tard
      difficulty: 2
    },
    {
      titre: "Todolist",
      tech: ["Node.js", "Express", "Prisma", "Zod", "TypeScript", "React", "JavaScript", "Tailwind"],
      description: "Application monolithique distribuée avec API backend et frontend interactif. Gestion des tâches avec authentification.",
      duree: "4 semaines",
      referent: "Birame Baila Wane - +221 XX XXX XX XX | WhatsApp",
      image: "/placeholder.svg",
      demo: "#", // À ajouter plus tard
      difficulty: 3
    },
    {
      titre: "Maxit (Version Personnelle)",
      tech: ["React", "JavaScript", "Tailwind", "PHP", "SOLID", "OOP", "MVC"],
      description: "Version personnelle et améliorée du site de shopping Maxit SA. Développement avec ma touche personnelle, intégrant des fonctionnalités innovantes et une expérience utilisateur optimisée.",
      duree: "5 semaines",
      referent: "Aly Tall Niang - +221 XX XXX XX XX | WhatsApp",
      image: "/placeholder.svg",
      demo: "#", // À ajouter plus tard
      difficulty: 4
    },
    {
      titre: "Shopping card",
      tech: ["React", "JavaScript", "Tailwind", "PHP", "SOLID", "OOP", "MVC"],
      description: "Site de shopping inspiré de Maxit SA avec intégration d'APIs (AppWofoyal pour paiements électricité, AppDaff pour vérification cartes d'identité). Projet de compétition avec modélisation complète.",
      duree: "6 semaines",
      referent: "Aly Tall Niang - +221 XX XXX XX XX | WhatsApp",
      image: "/placeholder.svg",
      demo: "#", // À ajouter plus tard
      difficulty: 5
    },
    {
      titre: "GP Monde",
      tech: ["TypeScript", "Tailwind", "HTML", "PHP"],
      description: "Application de livraison internationale utilisant les voies maritime, aérienne et routière. Système complet de gestion logistique avec suivi en temps réel et optimisation des trajets.",
      duree: "8 semaines",
      referent: "Birame Baila Wane - +221 XX XXX XX XX | WhatsApp",
      image: "/placeholder.svg",
      demo: "#", // À ajouter plus tard
      difficulty: 6
    },
    {
      titre: "Gestion d'Entreprise",
      tech: ["React", "JavaScript", "Tailwind", "Zod", "Prisma", "Express", "Node.js", "TypeScript"],
      description: "Application monolithique distribuée permettant aux chefs d'entreprise de créer leurs comptes et de gérer leurs employés et leurs salaires. Système complet de gestion RH avec fonctionnalités avancées.",
      duree: "1 semaine",
      referent: "Aly Tall Niang - +221 XX XXX XX XX | WhatsApp",
      image: "/placeholder.svg",
      demo: "#", // À ajouter plus tard
      difficulty: 7
    }
  ].sort((a, b) => a.difficulty - b.difficulty); // Tri par difficulté croissante

  const totalPages = Math.ceil(projets.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = projets.slice(startIndex, startIndex + projectsPerPage);


  return (
    <section className="min-h-screen flex items-center justify-center py-20 pb-32 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-5xl font-bold text-center mb-16 text-foreground animate-fade-in">
          Projets Professionnels - Sonatel Academy
        </h2>
        {/* Container avec flèches de navigation */}
        <div className="relative">
          {/* Flèche gauche */}
          {currentPage > 1 && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 animate-slide-left" style={{ left: '-120px' }}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="glass bg-background/90 backdrop-blur-sm border-primary/40 transition-all duration-300"
              >
                <ChevronLeft className="h-10 w-10 text-primary" />
              </Button>
            </div>
          )}

          {/* Grille des projets */}
          <div className="grid md:grid-cols-2 gap-8">
            {currentProjects.map((projet, index) => (
              <Card
                key={index}
                className="glass hover-glow p-6 rounded-2xl animate-scale-in group cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  {/* Image */}
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img
                      src={projet.image}
                      alt={projet.titre}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Titre et lien demo */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {projet.titre}
                    </h3>
                    <a href={projet.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-45 duration-300" />
                    </a>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {projet.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4">
                    {projet.description}
                  </p>

                  {/* Durée */}
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Durée: {projet.duree}</span>
                  </div>

                  {/* Référent */}
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Référent: {projet.referent}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Flèche droite */}
          {currentPage < totalPages && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 animate-slide-right" style={{ right: '-120px' }}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="glass bg-background/90 backdrop-blur-sm border-primary/40 transition-all duration-300"
              >
                <ChevronRight className="h-10 w-10 text-primary" />
              </Button>
            </div>
          )}
        </div>

        {/* Indicateur de page */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass bg-background/50 backdrop-blur-sm">
              <span className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjetsSection;
