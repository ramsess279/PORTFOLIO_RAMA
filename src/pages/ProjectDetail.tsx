import { ArrowLeft, ArrowUpRight, Clock, ExternalLink, Layers3 } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import projectsData from "@/data/projects.json";
import { useReveal } from "@/hooks/useReveal";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const ref = useReveal<HTMLElement>();
  const project = projectsData.projects.find((item) => String(item.id) === projectId);

  if (!project) return <Navigate to="/projects" replace />;

  const hasDemo = Boolean(project.demo && project.demo !== "#");
  const media = project.media.filter((item) => item.src !== "/placeholder.svg");

  return (
    <article ref={ref} className="case-study">
      <div className="section-shell">
        <Link to="/projects" className="archive-back"><ArrowLeft /> Tous les projets</Link>

        <header className="case-header">
          <div>
            <p className="section-index">Étude de projet — {project.duration}</p>
            <h1>{project.title}</h1>
          </div>
          <div className="case-summary">
            <p>{project.fullDescription || project.description}</p>
            <div className="case-actions">
              {hasDemo ? (
                <a className="button-primary" href={project.demo} target="_blank" rel="noreferrer">Voir le projet en ligne <ExternalLink /></a>
              ) : (
                <span className="project-status"><span /> Projet non déployé — présentation disponible ici</span>
              )}
            </div>
          </div>
        </header>

        <div className="case-facts">
          <div><Clock /><span>Durée</span><strong>{project.duration}</strong></div>
          <div><Layers3 /><span>Technologies</span><strong>{project.technologies.length} utilisées</strong></div>
          <div><ArrowUpRight /><span>Statut</span><strong>{hasDemo ? "Disponible en ligne" : "Prototype / projet privé"}</strong></div>
        </div>

        <section className="case-story reveal-blur">
          <p className="section-index">01 — Le projet</p>
          <div><h2>Transformer une idée<br />en expérience <em>concrète.</em></h2><p>{project.description}</p></div>
        </section>

        <section className="case-stack reveal-blur">
          <p className="section-index">02 — Stack & savoir-faire</p>
          <div>{project.technologies.map((technology, index) => <span key={technology}><small>{String(index + 1).padStart(2, "0")}</small>{technology}</span>)}</div>
        </section>

        <section className="case-gallery">
          <header className="reveal-blur"><p className="section-index">03 — Aperçu du produit</p><h2>{media.length ? `${media.length} vues du projet.` : "Projet en construction."}</h2><p>{media.length ? "Les captures et démonstrations restent consultables ici, même lorsqu’un produit n’est pas publiquement déployé." : "Les premières captures seront ajoutées à mesure que le produit prendra forme."}</p></header>

          {media.length ? (
            <div className="case-media-grid">
              {media.map((item, index) => (
                <figure className={`case-media reveal-blur ${index % 3 === 0 ? "case-media--wide" : ""}`} key={`${item.src}-${index}`}>
                  {item.type === "video" ? (
                    <video src={item.src} controls playsInline preload="metadata" poster={project.media.find((candidate) => candidate.type === "image" && candidate.src !== "/placeholder.svg")?.src} />
                  ) : (
                    <img src={item.src} alt={`${project.title} — capture ${index + 1}`} loading={index > 1 ? "lazy" : "eager"} />
                  )}
                  <figcaption>{item.type === "video" ? "Démonstration vidéo" : `Vue ${String(index + 1).padStart(2, "0")}`}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="case-placeholder reveal-blur"><span>RG</span><p>La documentation visuelle de ce projet arrive prochainement.</p></div>
          )}
        </section>

        <footer className="case-footer reveal-blur">
          <p>Un projet similaire en tête ?</p><a href="mailto:ramatoulaye.rtg@gmail.com">Parlons-en <ArrowUpRight /></a>
        </footer>
      </div>
    </article>
  );
};

export default ProjectDetail;
