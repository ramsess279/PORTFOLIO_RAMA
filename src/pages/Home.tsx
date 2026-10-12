import { ArrowDown, ArrowRight, ArrowUpRight, Braces, Database, Download, Github, Linkedin, Server, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "@/hooks/useReveal";
import { useTheme } from "@/hooks/useTheme";
import projectsData from "@/data/projects.json";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

const featuredIds = [-1, 0, 1, 9];
const projectMeta: Record<number, { index: string; type: string; accent: string; role: string; architecture: string; result: string }> = {
  [-1]: { index: "01", type: "Civic tech · Back-end", accent: "Un système de vote pensé autour du métier et de la confiance.", role: "Architecture & API", architecture: "DDD · Hexagonal", result: "Métier isolé et testable" },
  0: { index: "02", type: "E-commerce · Full-stack", accent: "Une boutique fonctionnelle conçue et livrée en 72 heures.", role: "Front + Back", architecture: "React · REST API", result: "MVP livré en 72 h" },
  1: { index: "03", type: "SaaS RH · Full-stack", accent: "Des processus RH complexes transformés en modules métier clairs.", role: "Full-stack", architecture: "Node · Prisma", result: "Workflow multi-rôles" },
  9: { index: "04", type: "Travel · Front-end", accent: "Une expérience responsive structurée autour de contenus et parcours riches.", role: "Front-end", architecture: "Next.js · React", result: "UX responsive" },
};

const engineeringPillars = [
  { icon: Braces, label: "Front-end", value: "React · TypeScript" },
  { icon: Server, label: "Back-end", value: "Node · Java · PHP" },
  { icon: Database, label: "Data", value: "PostgreSQL · Prisma" },
  { icon: Terminal, label: "Delivery", value: "Git · Docker · CI" },
];

const dialoguePhrases = [
  "Bonjour, je suis Ramatoulaye.",
  "Je conçois, je développe, je livre.",
  "Du besoin métier à la production.",
  "Je m’adapte à chaque projet.",
];

const Home = () => {
  const revealRef = useReveal<HTMLDivElement>();
  const portraitRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { content } = usePortfolioContent();
  const [loaded, setLoaded] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [evaporating, setEvaporating] = useState(false);
  const configuredFeatured = content.projects.filter((project) => project.featured && !project.commented).slice(0, 4);
  const featuredRank = (id: number) => {
    const rank = featuredIds.indexOf(id);
    return rank === -1 ? featuredIds.length : rank;
  };
  const featured = configuredFeatured.length
    ? [...configuredFeatured].sort((a, b) => featuredRank(a.id) - featuredRank(b.id))
    : featuredIds.map((id) => projectsData.projects.find((project) => project.id === id)).filter((project): project is (typeof projectsData.projects)[number] => Boolean(project));

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 160);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded || evaporating) return;
    const phrase = dialoguePhrases[phraseIndex];
    if (charIndex < phrase.length) {
      const timer = window.setTimeout(() => setCharIndex((current) => current + 1), 42);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setEvaporating(true), 1900);
    return () => window.clearTimeout(timer);
  }, [loaded, phraseIndex, charIndex, evaporating]);

  useEffect(() => {
    if (!evaporating) return;
    const timer = window.setTimeout(() => {
      setEvaporating(false);
      setCharIndex(0);
      setPhraseIndex((current) => (current + 1) % dialoguePhrases.length);
    }, 520);
    return () => window.clearTimeout(timer);
  }, [evaporating]);

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
        <img className="hero-watermark" src={theme === "dark" ? "/branding/logo-a-lavishly-yours-dark.png" : "/branding/logo-a-lavishly-yours-light.png"} alt="" aria-hidden="true" />

        <div className="hero-copy">
          <div className="availability hero-reveal"><span className="availability__dot" /> {content.hero.availability}</div>
          <p className="eyebrow hero-reveal">{content.hero.eyebrow}</p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-line"><span>{content.hero.titleLine1}</span></span>
            <span className="hero-line"><span>{content.hero.titleLine2}</span></span>
            <span className="hero-line hero-line--accent"><span>{content.hero.titleAccent}</span></span>
          </h1>
          <p className="hero-intro hero-reveal">{content.hero.introduction}</p>
          <div className="hero-actions hero-reveal">
            <a className="button-primary" href="#projets">Voir mes projets techniques <ArrowDown /></a>
            <a className="text-link" href="#competences">Explorer ma stack <ArrowRight /></a>
            <Link className="text-link resume-link" to="/cv">Voir mon CV <Download /></Link>
          </div>
        </div>

        <div className="hero-visual hero-reveal">
          <div className="portrait-halo" aria-hidden="true" />
          <div ref={portraitRef} className="portrait-stage" onPointerMove={handlePortraitMove} onPointerLeave={resetPortrait}>
            <img src="/avatar-rg.png" alt="Portrait illustré de Ramatoulaye Gueye" />
            <div className="hero-dialogue" aria-live="polite">
              <span>Ramatoulaye Gueye</span>
              <p className={evaporating ? "is-evaporating" : ""}>{dialoguePhrases[phraseIndex].slice(0, charIndex)}<i /></p>
              <small>continuer ▸</small>
            </div>
            <div className="hero-code-card hero-system-map" aria-label="Architecture applicative de bout en bout">
              <div className="hero-code-card__bar"><span /><span /><span /><code>request.flow</code></div>
              <div className="hero-system-map__flow">
                <span><Braces />UI</span><i /><span><Server />API</span><i /><span><Database />DATA</span>
              </div>
              <p>Je relie interface, logique métier et données dans un système cohérent.</p>
              <div className="hero-code-card__status"><Terminal /> conception → code → livraison <b>● prêt</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className="engineering-strip section-shell" aria-label="Expertise technique">
        <header className="engineering-strip__intro reveal-blur"><span>01 — Engineering</span><strong>De l’interface à la production.</strong></header>
        <div className="engineering-strip__grid">
          {engineeringPillars.map(({ icon: Icon, label, value }, index) => (
            <article className="engineering-pillar reveal-blur" key={label}>
              <span>0{index + 1}</span><Icon /><div><small>{label}</small><strong>{value}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto section-shell" aria-label="Manifeste" hidden={!content.sections.manifesto}>
        <p className="manifesto-index reveal-blur">02 — Code & produit</p>
        <p className="manifesto-copy reveal-blur">{content.manifesto}</p>
        <div className="manifesto-principles reveal-blur" aria-label="Principes de développement">
          <span><code>01</code> Code maintenable</span>
          <span><code>02</code> Architecture claire</span>
          <span><code>03</code> Interfaces accessibles</span>
          <span><code>04</code> Livraison continue</span>
        </div>
      </section>

      <section id="projets" className="projects-showcase section-shell" hidden={!content.sections.projects}>
        <header className="section-heading reveal-blur">
          <div><p className="section-index">03 — Études de cas</p><h2>Projets<br /><em>techniques.</em></h2></div>
          <p>Des applications documentées par leurs choix de stack, leur architecture et les problèmes résolus.</p>
        </header>
        <div className="project-list">
          {featured.map((project, index) => {
            const meta = projectMeta[project.id];
            return (
              <article className="project-story reveal-blur" key={project.id}>
                <Link to={`/projects/${project.id}`} className="project-media" aria-label={`Découvrir ${project.title}`}>
                  {project.id === -1 ? <NaatalCover /> : <img src={project.media[0]?.src || "/placeholder.svg"} alt="" loading={index > 1 ? "lazy" : "eager"} />}
                  <span className="project-open">Voir le projet <ArrowUpRight /></span><span className="project-number">{meta.index}</span>
                </Link>
                <div className="project-content">
                  <p className="project-type">{meta.type}</p><h3>{project.title.split(" - ")[0].split(" – ")[0]}</h3><p className="project-accent">{meta.accent}</p>
                  <div className="project-tags">{project.technologies.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <dl className="project-engineering">
                    <div><dt>Rôle</dt><dd>{meta.role}</dd></div>
                    <div><dt>Architecture</dt><dd>{meta.architecture}</dd></div>
                    <div><dt>Résultat</dt><dd>{meta.result}</dd></div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
        <div className="projects-more reveal-blur"><Link to="/projects">Voir toutes les réalisations <ArrowUpRight /></Link></div>
      </section>

      <section id="methode" className="method-section" hidden={!content.sections.method}>
        <div className="section-shell">
          <header className="method-intro reveal-blur"><p className="section-index">04 — Ma méthode</p><h2>Une idée n’est forte<br />que lorsqu’elle devient <em>réelle.</em></h2></header>
          <div className="process-grid">
            {content.process.map((step) => (
              <article className="process-card reveal-blur" key={step.num}><div className="process-top"><span>{step.num}</span><span className="process-dot" /></div><p className="process-verb">{step.verb}</p><h3>{step.title}</h3><p>{step.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="expertise-section section-shell" hidden={!content.sections.expertise}>
        <div className="expertise-sticky reveal-blur"><p className="section-index">05 — Expertise</p><h2>Une ingénierie<br /><em>complète.</em></h2><p>Front-end, back-end, data et architecture réunis dans une même démarche de développement.</p></div>
        <div className="expertise-list">
          {content.expertise.map(({ num, title, text }) => <article className="expertise-item reveal-blur" key={num}><span>{num}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight /></article>)}
        </div>
      </section>

      <section id="competences" className="skills-section" hidden={!content.sections.skills}>
        <div className="section-shell">
          <header className="skills-heading reveal-blur"><p className="section-index">06 — Stack technique</p><h2>Des technologies qui<br /><em>travaillent ensemble.</em></h2><p>Je choisis une stack cohérente avec les contraintes du produit — jamais l’inverse.</p></header>
          <div className="skills-proof reveal-blur" aria-label="Aperçu des compétences">
            <span><strong>6</strong> domaines complémentaires</span>
            <span><strong>35+</strong> technologies & pratiques</span>
            <span><strong>360°</strong> du besoin à la production</span>
          </div>
          <div className="skills-grid">
            {content.skillGroups.map((group, index) => (
              <article className="skill-group reveal-blur" key={group.title}><span>0{index + 1}</span><strong className="skill-group__count">{group.items.length} compétences</strong><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>
            ))}
          </div>
        </div>
      </section>

      <section id="experiences" className="experience-section" hidden={!content.sections.experience}>
        <div className="section-shell journey-layout">
          <header className="journey-heading reveal-blur"><p className="section-index">07 — Expériences</p><h2>Le terrain comme<br /><em>meilleure école.</em></h2><p>Des missions centrées sur la conception, le développement et la mise en production d’applications.</p></header>
          <div className="journey-column journey-column--experience">{content.experiences.map((item, index) => <article className="journey-item reveal-blur" key={`${item.period}-${item.title}`}><span className="journey-number">0{index + 1}</span><time>{item.period}</time><div><h4>{item.title}</h4><strong>{item.place}</strong><p>{item.text}</p></div></article>)}</div>
          <div className="journey-links reveal-blur"><Link to="/experience">Voir toutes mes expériences <ArrowRight /></Link></div>
        </div>
      </section>

      <section id="formations" className="education-section section-shell" hidden={!content.sections.education}>
        <header className="journey-heading reveal-blur"><p className="section-index">08 — Formations</p><h2>Apprendre pour<br /><em>mieux construire.</em></h2><p>Un apprentissage continu en développement web, mobile et génie logiciel.</p></header>
        <div className="education-list">{content.education.map(({ period, title, place }, index) => <article className="education-item reveal-blur" key={`${period}-${title}`}><span>0{index + 1}</span><time>{period}</time><h3>{title}</h3><strong>{place}</strong></article>)}</div>
        <div className="journey-links reveal-blur"><Link to="/education">Voir toutes mes formations <ArrowRight /></Link><Link to="/skills">Compétences détaillées <ArrowRight /></Link></div>
      </section>

      <section id="apropos" className="about-section section-shell" hidden={!content.sections.about}>
        <div className="about-portrait reveal-blur"><span className="about-portrait__word" aria-hidden="true">curieuse</span><img src="/portrait-rama-illustrated.png" alt="Portrait illustré de Ramatoulaye Gueye" loading="lazy" /></div>
        <div className="about-copy reveal-blur">
          <p className="section-index">09 — Derrière le code</p><h2>{content.about.title}<br /><em>{content.about.accent}</em></h2>
          {content.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="about-stats"><div><strong>15+</strong><span>projets réalisés</span></div><div><strong>2+</strong><span>années d’expérience</span></div><div><strong>3</strong><span>couches applicatives</span></div></div>
          <div className="about-links"><Link to="/experience">Voir mon parcours <ArrowRight /></Link><Link to="/skills">Explorer mes compétences <ArrowRight /></Link></div>
        </div>
      </section>

      <section className="public-resume section-shell" aria-label="Curriculum vitæ">
        <div className="public-resume__mark" aria-hidden="true">CV</div>
        <div className="public-resume__copy reveal-blur">
          <p className="section-index">Profil — En un coup d’œil</p>
          <h2>Mon parcours.<br /><em>Un seul document.</em></h2>
          <p>Expériences, compétences, formation et réalisations clés réunies dans une version claire, concise et prête à partager.</p>
        </div>
        <Link className="public-resume__action reveal-blur" to="/cv"><span>Profil complet</span><strong>Consulter mon CV</strong><small>Version dynamique · PDF</small><i><Download /></i></Link>
      </section>

      <section id="contact" className="contact-section" hidden={!content.sections.contact}>
        <div className="contact-glow" aria-hidden="true" />
        <div className="section-shell contact-inner reveal-blur">
          <p className="section-index">{content.contact.eyebrow}</p><h2>{content.contact.title}<br /><em>{content.contact.accent}</em></h2><p>{content.contact.introduction}</p>
          <div className="contact-channels">
            <a className="contact-channel contact-channel--email" href={`mailto:${content.identity.email}`}><span>E-mail</span><strong>{content.identity.email}</strong><ArrowUpRight /></a>
            <a className="contact-channel" href={content.identity.githubUrl} target="_blank" rel="noreferrer"><span><Github /> GitHub</span><strong>@rama-lpb</strong><ArrowUpRight /></a>
            <a className="contact-channel" href={content.identity.linkedinUrl} target="_blank" rel="noreferrer"><span><Linkedin /> LinkedIn</span><strong>{content.identity.name}</strong><ArrowUpRight /></a>
          </div>
          <footer><a href="#top">Retour en haut ↑</a></footer>
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
