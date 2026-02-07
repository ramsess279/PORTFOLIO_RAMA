import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building, Award, Briefcase, GraduationCap, BookOpen, ScrollText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Experience = () => {
  const experiences = [
    {
      type: "stage",
      title: "Développement Fullstack - Gestion de Flotte Automobile",
      company: "Multimédia, TGI",
      location: "Dakar, Sénégal",
      period: "Juin 2024 - Juillet 2024",
      duration: "2 mois",
      description: "Développement d'une application complète de gestion de flotte automobile avec interface multi-rôles. Conception et implémentation de fonctionnalités avancées pour la gestion des véhicules, conducteurs et missions. Technologies utilisées : PHP, MySQL, HTML5, CSS3, JavaScript.",
      achievements: [
        "Interface multi-utilisateurs avec rôles différenciés",
        "Système de suivi GPS intégré",
        "Rapports automatisés de maintenance",
        "Optimisation des performances pour 500+ véhicules"
      ],
      technologies: ["PHP", "MySQL", "HTML5", "CSS3", "JavaScript", "Bootstrap"],
      icon: Briefcase
    },
    {
      type: "formation",
      title: "Formation Développement Web Fullstack - Sonatel Academy",
      company: "Sonatel Academy",
      location: "Dakar, Sénégal",
      period: "Février 2024 - Décembre 2024",
      duration: "11 mois",
      description: "Formation intensive en développement web fullstack avec réalisation de 7 projets professionnels. Apprentissage des meilleures pratiques de développement, participation à des compétitions et déploiement de projets en production.",
      achievements: [
        "+ de 10 projets professionnels réalisés et déployés",
        "Participation à des compétitions de développement",
        "Maîtrise des technologies modernes fullstack",
        "Développement d'applications complexes avec APIs"
      ],
      technologies: ["React", "Node.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "PHP", "MySQL" , "Zod" , "Express" , "vite"],
      icon: ScrollText
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stage": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "formation": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "projet": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-primary/20 text-primary border-primary/30";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "stage": return "Stage";
      case "formation": return "Formation";
      case "projet": return "Projet";
      default: return "Expérience";
    }
  };

  const isMobile = useIsMobile();

  return (
    <div className={`min-h-screen py-20 ${isMobile ? 'px-2' : 'px-4'}`}>
      <div className={`container mx-auto ${isMobile ? 'max-w-full' : 'max-w-6xl'}`}>
        {/* Timeline */}
        <div className="relative">
          {/* Ligne verticale de la timeline */}
          {!isMobile && <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20"></div>}

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const IconComponent = exp.icon;
              return (
                <div key={index} className="relative flex items-start animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  {/* Point de la timeline */}
                  {!isMobile && <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-background border-4 border-primary/30 rounded-full shadow-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>}

                  {/* Contenu de l'expérience */}
                  <Card className={`${isMobile ? 'p-4' : 'ml-8 p-8'} glass hover-glow rounded-2xl flex-1 animate-scale-in relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />

                    <div className="relative z-10">
                      {/* En-tête */}
                      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {exp.title}
                            </h3>
                            <Badge variant="secondary" className={`text-xs ${getTypeColor(exp.type)}`}>
                              {getTypeLabel(exp.type)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              <span className="font-medium text-primary">{exp.company}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{exp.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{exp.period} • {exp.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {exp.description}
                      </p>

                      {/* Réalisations */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          Réalisations clés
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start gap-2 text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-3">Technologies utilisées</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Projets Réalisés", value: "10+", icon: Briefcase },
            { label: "Mois de Formation", value: "24+", icon: Calendar },
            { label: "Technologies", value: "12+", icon: Award },
            { label: "Stages Effectués", value: "1+", icon: Building }
          ].map((stat, index) => (
            <Card key={index} className="glass hover-glow p-6 rounded-xl text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <stat.icon className="h-6 w-6 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;