import { Lightbulb, Users, BookOpen } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const values = [
  {
    num: "01",
    title: "Innovation",
    desc: "Toujours à la recherche de solutions créatives et modernes.",
    icon: Lightbulb,
  },
  {
    num: "02",
    title: "Collaboration",
    desc: "Le travail d'équipe est essentiel pour réussir de grands projets.",
    icon: Users,
  },
  {
    num: "03",
    title: "Apprentissage continu",
    desc: "Le développement est un voyage sans fin d'apprentissage.",
    icon: BookOpen,
  },
];

const stats = [
  { value: "2+", label: "Années d'expérience" },
  { value: "15+", label: "Projets réalisés" },
  { value: "8+", label: "Technologies maîtrisées" },
  { value: "100%", label: "Passionnée par le code" },
];

const interests = [
  "Veille technologique (nouveaux frameworks, outils IA)",
  "Design & créativité (identité visuelle, expérience utilisateur)",
  "Jeux de réflexion et de stratégie",
  "Musique",
];

const goals = [
  "Évoluer vers un rôle d'architecte logiciel / tech lead",
  "Approfondir le Domain-Driven Design et l'architecture hexagonale sur des projets réels",
  "Renforcer la double compétence Développement / Business Analyst",
  "Explorer le développement assisté par l'IA (agents, outils de vibecoding)",
  "Contribuer à des projets à impact social, comme Naatalvote",
  "Partager mes connaissances et mentorer d'autres développeurs",
];

const About = () => {
  const ref = useReveal();

  return (
    <div ref={ref} className="pt-28 pb-24">
      {/* Intro */}
      <section className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-start">
          <div className="reveal-blur order-2 md:order-1">
            <span className="inline-block text-xs tracking-[0.22em] uppercase text-primary mb-4">
              Qui suis-je
            </span>
            <h1 className="text-4xl md:text-5xl font-normal leading-tight mb-8">
              Une seule personne,
              <br />
              <em className="accent-italic">plusieurs métiers</em>.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-5">
              Développeuse Full Stack et Business Analyst, je prends en charge un projet de bout en
              bout : à partir d'un cahier des charges, je conçois, je développe, je mets en production
              et j'assure la maintenance. Je combine expertise technique, analyse du besoin métier et
              sens du détail.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Portée par une forte capacité d'apprentissage et une réelle curiosité technologique,
              j'évolue constamment à travers des projets concrets, l'adoption des bonnes pratiques
              et le partage de connaissances au sein de la communauté.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-border mt-10">
              {stats.map((stat) => (
                <div key={stat.label} className="border-b border-r last:border-r-0 border-border py-6 pr-4">
                  <div className="text-2xl font-display text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-blur order-1 md:order-2 mx-auto md:mx-0">
            <img
              src="/avatar-rg.png"
              alt="Ramatoulaye Gueye"
              className="w-56 sm:w-64 md:w-80 h-auto"
              style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.35))" }}
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 mt-28 md:mt-36">
        <h2 className="text-3xl md:text-4xl font-normal text-center mb-14">Mes valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border">
          {values.map((value, i) => (
            <div
              key={value.title}
              className="pillar-card reveal-blur border-b md:border-r border-border md:last:border-r-0 p-8 hover:bg-muted/40 transition-colors text-center md:text-left"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="text-sm text-primary font-display block mb-3">{value.num}</span>
              <value.icon className="pillar-icon h-6 w-6 text-primary mb-3.5 opacity-85 mx-auto md:mx-0" strokeWidth={1.4} />
              <h3 className="text-xl mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beyond code */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 mt-28 md:mt-36">
        <h2 className="text-3xl md:text-4xl font-normal text-center mb-14">En dehors du code</h2>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="reveal-blur">
            <h3 className="text-lg mb-5 text-primary">Centres d'intérêt</h3>
            <ul className="space-y-3">
              {interests.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground border-b border-border/60 pb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal-blur">
            <h3 className="text-lg mb-5 text-primary">Objectifs</h3>
            <ul className="space-y-3">
              {goals.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground border-b border-border/60 pb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
