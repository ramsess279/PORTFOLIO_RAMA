import { ArrowDown, ArrowRight, ArrowUpRight, Github, Linkedin, MapPin, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "@/hooks/useReveal";
import projectsData from "@/data/projects.json";

const featuredIds = [-1, 0, 1, 9];
const projectMeta: Record<number, { index: string; type: string; accent: string }> = {
  [-1]: { index: "01", type: "Civic tech · Architecture", accent: "Un système de vote pensé autour du métier et de la confiance." },
  0: { index: "02", type: "E-commerce · Fullstack", accent: "Une boutique pensée et livrée en 72 heures." },
  1: { index: "03", type: "SaaS RH · Produit métier", accent: "Des processus RH complexes rendus simples." },
  9: { index: "04", type: "Travel · Expérience digitale", accent: "Le Sénégal raconté comme une destination vivante." },
};

const process = [
  { num: "01", verb: "Comprendre", title: "Le besoin avant la solution", text: "J’écoute, je questionne et je transforme les enjeux métier en objectifs, parcours et priorités clairs." },
  { num: "02", verb: "Concevoir", title: "Donner une forme à l’idée", text: "Architecture, user flows, maquettes et prototype : chaque décision prépare un produit cohérent et utile." },
  { num: "03", verb: "Construire", title: "Développer avec méthode", text: "Du front au back, je crée des interfaces robustes, accessibles et maintenables avec une vision produit." },
  { num: "04", verb: "Livrer", title: "Aller jusqu’au réel", text: "Déploiement, validation, documentation et amélioration continue : le projet ne s’arrête pas à la démo." },
];

const expertise = [
  ["01", "Product thinking", "Cahier des charges, ateliers, user stories, UML, priorisation MoSCoW et méthodes Agile."],
  ["02", "Engineering", "React, TypeScript, Node.js, PHP, Java, Spring Boot, API REST, PostgreSQL et Docker."],
  ["03", "Design & expérience", "Figma, direction visuelle, prototypes, design responsive et micro-interactions utiles."],
  ["04", "IA & automatisation", "Agents, outils d’assistance et workflows IA intégrés avec discernement au processus produit."],
];

const Home = () => {
  const revealRef = useReveal<HTMLDivElement>();
  const portraitRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const featured = featuredIds.map((id) => projectsData.projects.find((project) => project.id === id)).filter((project): project is (typeof projectsData.projects)[number] => Boolean(project));

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 160);
    return () => window.clearTimeout(timer);
  }, []);

  const handlePortraitMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!portraitRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = portraitRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    portraitRef.current.style.setProperty("--portrait-x", `${x * 10}deg`);
    portraitRef.current.style.setProperty("--portrait-y", `${y * -7}deg`);
  };

  const resetPortrait = () => {
    portraitRef.current?.style.setProperty("--portrait-x", "0deg");
    portraitRef.current?.style.setProperty("--portrait-y", "0deg");
  };

  return (
    <div id="top" ref={revealRef} className={`portfolio-home ${loaded ? "is-loaded" : ""}`}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />

        <div className="hero-copy">
          <div className="availability hero-reveal"><span className="availability__dot" /> Disponible pour de nouvelles opportunités</div>
          <p className="eyebrow hero-reveal">Fullstack Developer · Business Analyst</p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-line"><span>Du besoin</span></span>
            <span className="hero-line"><span>au produit</span></span>
            <span className="hero-line hero-line--accent"><span>livré.</span></span>
          </h1>
          <p className="hero-intro hero-reveal">Je transforme des problématiques métier en expériences numériques utiles, élégantes et prêtes à vivre dans le monde réel.</p>
          <div className="hero-actions hero-reveal">
            <a className="button-primary" href="#projets">Découvrir mes projets <ArrowDown /></a>
            <a className="text-link" href="#methode">Ma façon de travailler <ArrowRight /></a>
          </div>
        </div>

        <div className="hero-visual hero-reveal">
          <div className="portrait-halo" aria-hidden="true" />
          <div ref={portraitRef} className="portrait-stage" onPointerMove={handlePortraitMove} onPointerLeave={resetPortrait}>
            <span className="portrait-label portrait-label--top">Designing with intent</span>
            <img src="/avatar-rg.png" alt="Portrait illustré de Ramatoulaye Gueye" />
            <span className="portrait-label portrait-label--bottom"><Sparkles /> Based in Dakar</span>
          </div>
          <span className="hero-signature" aria-hidden="true">RG</span>
        </div>

        <div className="hero-foot hero-reveal">
          <span><MapPin /> Dakar, Sénégal</span><span className="hero-foot__line" /><span>2026 · Portfolio sélectionné</span>
        </div>
      </section>

      <section className="manifesto section-shell" aria-label="Manifeste">
        <p className="manifesto-index reveal-blur">01 — Manifeste</p>
        <p className="manifesto-copy reveal-blur">Je ne me contente pas d’écrire du code. Je relie <em>les personnes</em>, <em>les enjeux métier</em> et <em>la technologie</em> pour créer des produits qui ont du sens — du premier échange jusqu’à la mise en production.</p>
      </section>

      <section id="projets" className="projects-showcase section-shell">
        <header className="section-heading reveal-blur">
          <div><p className="section-index">02 — Sélection</p><h2>Projets<br /><em>choisis.</em></h2></div>
          <p>Quatre projets, quatre univers, une même exigence : comprendre avant de construire.</p>
        </header>
        <div className="project-list">
          {featured.map((project, index) => {
            const meta = projectMeta[project.id];
            return (
              <article className="project-story reveal-blur" key={project.id}>
                <Link to="/projects" className="project-media" aria-label={`Découvrir ${project.title}`}>
                  {project.id === -1 ? <NaatalCover /> : <img src={project.media[0]?.src || "/placeholder.svg"} alt="" loading={index > 1 ? "lazy" : "eager"} />}
                  <span className="project-open">Voir le projet <ArrowUpRight /></span><span className="project-number">{meta.index}</span>
                </Link>
                <div className="project-content">
                  <p className="project-type">{meta.type}</p><h3>{project.title.split(" - ")[0].split(" – ")[0]}</h3><p className="project-accent">{meta.accent}</p>
                  <div className="project-tags">{project.technologies.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="projects-more reveal-blur"><Link to="/projects">Voir toutes les réalisations <ArrowUpRight /></Link></div>
      </section>

      <section id="methode" className="method-section">
        <div className="section-shell">
          <header className="method-intro reveal-blur"><p className="section-index">03 — Ma méthode</p><h2>Une idée n’est forte<br />que lorsqu’elle devient <em>réelle.</em></h2></header>
          <div className="process-grid">
            {process.map((step) => (
              <article className="process-card reveal-blur" key={step.num}><div className="process-top"><span>{step.num}</span><span className="process-dot" /></div><p className="process-verb">{step.verb}</p><h3>{step.title}</h3><p>{step.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="expertise-section section-shell">
        <div className="expertise-sticky reveal-blur"><p className="section-index">04 — Expertise</p><h2>Une vision<br /><em>à 360°.</em></h2><p>Le produit, la technique et l’expérience réunis dans une même démarche.</p></div>
        <div className="expertise-list">
          {expertise.map(([num, title, text]) => <article className="expertise-item reveal-blur" key={num}><span>{num}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight /></article>)}
        </div>
      </section>

      <section id="apropos" className="about-section section-shell">
        <div className="about-portrait reveal-blur"><span className="about-portrait__word" aria-hidden="true">curieuse</span><img src="/photo_ramaa.png" alt="Ramatoulaye Gueye" loading="lazy" /></div>
        <div className="about-copy reveal-blur">
          <p className="section-index">05 — Derrière l’écran</p><h2>Développeuse par métier.<br /><em>Créatrice par nature.</em></h2>
          <p>Je suis Ramatoulaye, développeuse Fullstack et Business Analyst basée à Dakar. Ma force est de pouvoir circuler entre les conversations métier, la conception et le code sans perdre le fil du produit.</p>
          <p>J’aime les problèmes complexes, les interfaces qui paraissent évidentes et les technologies utilisées avec intention.</p>
          <div className="about-stats"><div><strong>15+</strong><span>projets réalisés</span></div><div><strong>2+</strong><span>années d’expérience</span></div><div><strong>4</strong><span>disciplines réunies</span></div></div>
          <div className="about-links"><Link to="/experience">Voir mon parcours <ArrowRight /></Link><Link to="/skills">Explorer mes compétences <ArrowRight /></Link></div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-glow" aria-hidden="true" />
        <div className="section-shell contact-inner reveal-blur">
          <p className="section-index">06 — Et maintenant ?</p><h2>Construisons quelque chose<br /><em>d’inoubliable.</em></h2><p>Une opportunité, un produit à imaginer ou un défi technique ? Parlons-en.</p>
          <a className="contact-email" href="mailto:ramatoulaye.rtg@gmail.com">ramatoulaye.rtg@gmail.com <ArrowUpRight /></a>
          <footer><span>© 2026 Ramatoulaye Gueye</span><div><a href="https://github.com/rama-lpb" target="_blank" rel="noreferrer"><Github /> GitHub</a><a href="https://www.linkedin.com/in/rama-gueye-" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a></div><a href="#top">Retour en haut ↑</a></footer>
        </div>
      </section>
    </div>
  );
};

const NaatalCover = () => (
  <div className="naatal-cover" aria-hidden="true">
    <div className="naatal-grid" />
    <span className="naatal-kicker">Sénégal · Civic technology</span>
    <strong>Naatal<br />vote</strong>
    <div className="naatal-ballot"><span /><span /><span /></div>
    <span className="naatal-domain">Domain-driven<br />by design.</span>
  </div>
);

export default Home;
