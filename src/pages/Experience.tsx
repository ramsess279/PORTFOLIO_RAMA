import { Calendar, MapPin, Building, Award, Briefcase, ScrollText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useReveal } from "@/hooks/useReveal";

const experiences = [
  {
    type: "stage",
    title: "Développeuse Fullstack & Business Analyst",
    company: "Digital Media Mobile",
    location: "Dakar, Sénégal",
    period: "Décembre 2025 - Aujourd'hui",
    duration: "En cours",
    description:
      "Prise en charge de projets de bout en bout : recueil du besoin et rédaction du cahier des charges, conception, développement, jusqu'à la mise en production et la maintenance applicative.",
    achievements: [] as string[],
    technologies: [] as string[],
    icon: Briefcase,
  },
  {
    type: "stage",
    title: "Développement Fullstack - Gestion de Flotte Automobile",
    company: "Multimédia, TGI",
    location: "Dakar, Sénégal",
    period: "Juin 2024 - Juillet 2024",
    duration: "2 mois",
    description:
      "Développement d'une application complète de gestion de flotte automobile avec interface multi-rôles. Conception et implémentation de fonctionnalités avancées pour la gestion des véhicules, conducteurs et missions.",
    achievements: [
      "Interface multi-utilisateurs avec rôles différenciés",
      "Système de suivi GPS intégré",
      "Rapports automatisés de maintenance",
    ],
    technologies: ["PHP", "MySQL", "HTML5", "CSS3", "JavaScript", "Bootstrap"],
    icon: Briefcase,
  },
  {
    type: "formation",
    title: "Formation Développement Web Fullstack - Sonatel Academy",
    company: "Sonatel Academy",
    location: "Dakar, Sénégal",
    period: "Février 2024 - Décembre 2024",
    duration: "11 mois",
    description:
      "Formation intensive en développement web fullstack avec réalisation de 7 projets professionnels. Apprentissage des meilleures pratiques de développement, participation à des compétitions et déploiement de projets en production.",
    achievements: [
      "10+ projets professionnels réalisés et déployés",
      "Participation à des compétitions de développement",
      "Développement d'applications complexes avec APIs",
    ],
    technologies: ["React", "Node.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "PHP", "MySQL", "Zod", "Express"],
    icon: ScrollText,
  },
];

const stats = [
  { label: "Projets réalisés", value: "10+", icon: Briefcase },
  { label: "Mois de formation", value: "24+", icon: Calendar },
  { label: "Technologies", value: "12+", icon: Award },
  { label: "Stages effectués", value: "2", icon: Building },
];

const typeLabel: Record<string, string> = {
  stage: "Stage",
  formation: "Formation",
};

const Experience = () => {
  const ref = useReveal();

  return (
    <div ref={ref} className="pt-28 pb-24 px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          eyebrow="Mon parcours"
          title={
            <>
              De la <em className="accent-italic">formation</em> au terrain
            </>
          }
        />

        <div className="space-y-14">
          {experiences.map((exp, index) => (
            <div key={index} className="reveal-blur group relative pl-8 border-l border-border transition-colors duration-300 hover:border-primary">
              <div className="absolute left-0 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-primary transition-transform duration-300 group-hover:scale-150" />
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="text-[11px] tracking-[0.14em] uppercase text-primary border border-primary/40 rounded-full px-3 py-1">
                  {typeLabel[exp.type]}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {exp.period} · {exp.duration}
                </span>
              </div>
              <h3 className="text-2xl mb-2">{exp.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-primary font-medium">
                  <Building className="h-4 w-4" /> {exp.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {exp.location}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-5">{exp.description}</p>

              {exp.achievements.length > 0 && (
                <ul className="space-y-2 mb-5">
                  {exp.achievements.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              )}

              {exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs border border-border rounded-full px-3 py-1 text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border mt-20">
          {stats.map((stat) => (
            <div key={stat.label} className="reveal-blur border-b border-r last:border-r-0 border-border py-7 pr-4 text-center md:text-left">
              <stat.icon className="h-5 w-5 text-primary mb-2 mx-auto md:mx-0" strokeWidth={1.5} />
              <div className="text-2xl font-display text-foreground mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
