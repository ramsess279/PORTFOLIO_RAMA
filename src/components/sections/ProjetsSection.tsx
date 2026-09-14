import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useReveal } from "@/hooks/useReveal";
import projectsData from "@/data/projects.json";

const ProjetsSection = () => {
  const ref = useReveal<HTMLElement>();
  const projects = projectsData.projects
    .filter((project) => !project.commented)
    .sort((a, b) => a.id === -1 ? -1 : b.id === -1 ? 1 : a.id - b.id);

  return (
    <section ref={ref} className="project-archive">
      <div className="section-shell">
        <Link to="/#projets" className="archive-back"><ArrowLeft /> Retour à la sélection</Link>
        <header className="archive-header">
          <p className="section-index">Archive — {String(projects.length).padStart(2, "0")} projets</p>
          <h1>Des produits pensés<br /><em>jusqu’au détail.</em></h1>
          <p>Applications métier, produits e-commerce et expériences de marque — une sélection de projets conçus et développés de bout en bout.</p>
        </header>

        <div className="archive-grid">
          {projects.map((project, index) => {
            const hasDemo = project.demo && project.demo !== "#";
            const content = (
              <>
                <div className="archive-media">
                  {project.id === -1 ? (
                    <div className="naatal-cover" aria-hidden="true"><div className="naatal-grid" /><span className="naatal-kicker">Sénégal · Civic technology</span><strong>Naatal<br />vote</strong><div className="naatal-ballot"><span /><span /><span /></div><span className="naatal-domain">Domain-driven<br />by design.</span></div>
                  ) : (
                    <img src={project.media[0]?.src || "/placeholder.svg"} alt="" loading={index > 1 ? "lazy" : "eager"} />
                  )}
                  <span className="archive-count">{String(index + 1).padStart(2, "0")}</span>
                  {hasDemo && <span className="archive-open">Visiter le produit <ArrowUpRight /></span>}
                </div>
                <div className="archive-copy">
                  <div><p>{project.technologies.slice(0, 3).join(" · ")}</p><h2>{project.title}</h2></div>
                  <span><Clock /> {project.duration}</span>
                </div>
                <p className="archive-description">{project.description}</p>
              </>
            );

            return <Link className="archive-card reveal-blur" to={`/projects/${project.id}`} key={project.id}>{content}</Link>;
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjetsSection;
