import { useEffect, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Clock, ExternalLink, Layers3, Pause, Play } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import projectsData from "@/data/projects.json";
import { useReveal } from "@/hooks/useReveal";

type Media = { type: string; src: string };

const identities: Record<number, { name: string; suffix?: string; discipline: string; bg: string; surface: string; ink: string; accent: string; soft: string }> = {
  [-1]: { name: "Naatalvote", discipline: "Civic tech · Sénégal", bg: "#06271d", surface: "#0d382b", ink: "#f5ecd1", accent: "#e1c66f", soft: "#a7c4b6" },
  0: { name: "MiniBloom", suffix: "STORE", discipline: "E-commerce · Enfance", bg: "#f8eee8", surface: "#fff9f5", ink: "#412f40", accent: "#d96f83", soft: "#806b79" },
  1: { name: "GESS", suffix: "ENTREPRISE", discipline: "SaaS · Ressources humaines", bg: "#09162d", surface: "#102344", ink: "#f3f6fb", accent: "#5fa9f5", soft: "#a8b8cf" },
  9: { name: "Sénégal", suffix: "TRAVEL", discipline: "Voyage · Culture", bg: "#143d32", surface: "#205345", ink: "#fff4da", accent: "#efa73e", soft: "#b9d1c7" },
  10: { name: "Murafa", suffix: "CRÉATION", discipline: "Studio · Création", bg: "#25152e", surface: "#3a2146", ink: "#fbf1ff", accent: "#e79bcc", soft: "#cbb1d3" },
  11: { name: "Luxury Jet", discipline: "Aviation · Expérience premium", bg: "#111111", surface: "#202020", ink: "#f8f3e9", accent: "#c8a56a", soft: "#bdb5a7" },
};

const fallbackIdentity = { name: "RG Studio", discipline: "Produit numérique", bg: "#18070d", surface: "#2a0e18", ink: "#fff7f9", accent: "#ed3b70", soft: "#cfabb7" };

const ProjectCarousel = ({ media, title }: { media: Media[]; title: string }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const poster = media.find((item) => item.type === "image")?.src;

  useEffect(() => setActive(0), [title]);

  useEffect(() => {
    if (paused || reducedMotion || media.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % media.length), 4800);
    return () => window.clearInterval(timer);
  }, [media.length, paused, reducedMotion]);

  const previous = () => setActive((current) => (current - 1 + media.length) % media.length);
  const next = () => setActive((current) => (current + 1) % media.length);

  if (!media.length) {
    return <div className="project-carousel project-carousel--empty"><span>En construction</span><strong>Les premières vues arrivent bientôt.</strong></div>;
  }

  return (
    <section className="project-carousel" aria-label={`Galerie de ${title}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translate3d(-${active * 100}%, 0, 0)` }}>
          {media.map((item, index) => (
            <figure className="carousel-slide" key={`${item.src}-${index}`} aria-hidden={index !== active}>
              {item.type === "video" ? (
                <video src={item.src} controls playsInline preload="metadata" poster={poster} onPlay={() => setPaused(true)} />
              ) : (
                <img src={item.src} alt={`${title} — aperçu ${index + 1}`} loading={index > 1 ? "lazy" : "eager"} />
              )}
            </figure>
          ))}
        </div>
      </div>

      <div className="carousel-toolbar">
        <div className="carousel-count"><strong>{String(active + 1).padStart(2, "0")}</strong><span>/ {String(media.length).padStart(2, "0")}</span></div>
        <div className="carousel-dots" aria-label="Choisir une vue">
          {media.map((_, index) => <button key={index} type="button" aria-label={`Afficher la vue ${index + 1}`} aria-current={index === active} onClick={() => setActive(index)}><span /></button>)}
        </div>
        <div className="carousel-controls">
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Reprendre le défilement" : "Mettre le défilement en pause"}>{paused ? <Play /> : <Pause />}</button>
          <button type="button" onClick={previous} aria-label="Vue précédente"><ChevronLeft /></button>
          <button type="button" onClick={next} aria-label="Vue suivante"><ChevronRight /></button>
        </div>
      </div>
      {!paused && !reducedMotion && <span key={active} className="carousel-progress" />}
    </section>
  );
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  const ref = useReveal<HTMLElement>();
  const project = projectsData.projects.find((item) => String(item.id) === projectId);

  useEffect(() => {
    document.body.classList.add("project-page-open");
    return () => document.body.classList.remove("project-page-open");
  }, []);

  if (!project) return <Navigate to="/projects" replace />;

  const identity = identities[project.id] || { ...fallbackIdentity, name: project.title.split(/\s[-–]\s/)[0] };
  const hasDemo = Boolean(project.demo && project.demo !== "#");
  const media = project.media.filter((item) => item.src !== "/placeholder.svg");
  const themeStyle = {
    "--case-bg": identity.bg,
    "--case-surface": identity.surface,
    "--case-ink": identity.ink,
    "--case-accent": identity.accent,
    "--case-soft": identity.soft,
  } as CSSProperties;

  return (
    <article ref={ref} className="case-study project-world" style={themeStyle}>
      <section className="case-identity">
        <div className="section-shell">
          <Link to="/projects" className="case-back"><ArrowLeft /> Tous les projets</Link>

          <header className="identity-header">
            <div className="project-wordmark" aria-label={`Identité ${identity.name}`}>
              <span>{identity.discipline}</span>
              <strong>{identity.name}</strong>
              {identity.suffix && <small>{identity.suffix}</small>}
            </div>
            <div className="identity-title">
              <p>Étude de projet · {project.duration}</p>
              <h1>{project.title}</h1>
            </div>
            <div className="identity-summary">
              <p>{project.fullDescription || project.description}</p>
              {hasDemo ? <a href={project.demo} target="_blank" rel="noreferrer">Explorer le projet en ligne <ExternalLink /></a> : <span><i /> Projet privé ou non déployé</span>}
            </div>
          </header>

          <ProjectCarousel media={media} title={project.title} />
        </div>
      </section>

      <div className="case-body section-shell">
        <div className="case-facts">
          <div><Clock /><span>Durée</span><strong>{project.duration}</strong></div>
          <div><Layers3 /><span>Technologies</span><strong>{project.technologies.length} utilisées</strong></div>
          <div><ArrowUpRight /><span>Statut</span><strong>{hasDemo ? "Disponible en ligne" : "Prototype / projet privé"}</strong></div>
        </div>

        <section className="case-story reveal-blur">
          <p className="section-index">01 — Vision</p>
          <div><h2>Une identité pensée<br />pour une expérience <em>cohérente.</em></h2><p>{project.description}</p></div>
        </section>

        <section className="case-stack reveal-blur">
          <p className="section-index">02 — Stack & savoir-faire</p>
          <div>{project.technologies.map((technology, index) => <span key={technology}><small>{String(index + 1).padStart(2, "0")}</small>{technology}</span>)}</div>
        </section>

        <section className="case-next reveal-blur">
          <span>La suite</span><h2>Découvrir les autres<br />univers du portfolio.</h2><Link to="/projects">Voir tous les projets <ArrowRight /></Link>
        </section>

        <footer className="case-footer reveal-blur"><p>Un projet similaire en tête ?</p><a href="mailto:ramatoulaye.rtg@gmail.com">Parlons-en <ArrowUpRight /></a></footer>
      </div>
    </article>
  );
};

export default ProjectDetail;
