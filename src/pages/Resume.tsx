import { ArrowLeft, Download, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

const Resume = () => {
  const { content } = usePortfolioContent();
  const { cv, identity } = content;
  const selectedProjects = cv.selectedProjectIds.map((id) => content.projects.find((project) => project.id === id)).filter(Boolean);
  const stackGroups = [
    { label: "Front-end", items: cv.skills.filter((skill) => ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "TailwindCSS"].includes(skill)) },
    { label: "Back-end", items: cv.skills.filter((skill) => ["Node.js", "Express", "Java", "Spring Boot", "PHP", "Symfony", "API REST"].includes(skill)) },
    { label: "Data & outils", items: cv.skills.filter((skill) => !["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "TailwindCSS", "Node.js", "Express", "Java", "Spring Boot", "PHP", "Symfony", "API REST"].includes(skill)) },
  ].filter((group) => group.items.length);
  const compactLink = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  return <div className="resume-page">
    <div className="resume-toolbar"><Link to="/"><ArrowLeft /> Retour au portfolio</Link><button type="button" onClick={() => window.print()}><Download /> Télécharger / imprimer en PDF</button></div>
    <article className="resume-document">
      <header className="resume-header"><div className="resume-monogram">RG</div><div><p>Curriculum vitæ</p><h1>{identity.name}</h1><h2>{cv.headline}</h2></div></header>
      <div className="resume-layout">
        <aside className="resume-side">
          <section><h3>Contact</h3><a href={`mailto:${identity.email}`}><Mail />{identity.email}</a>{cv.phone && <span><Phone />{cv.phone}</span>}<span><MapPin />{identity.location}</span>{cv.website && <a href={cv.website}>{compactLink(cv.website)}</a>}<a href={identity.githubUrl}><Github />{compactLink(identity.githubUrl)}</a><a href={identity.linkedinUrl}><Linkedin />{compactLink(identity.linkedinUrl)}</a></section>
          <section><h3>Stack technique</h3><div className="resume-stack">{stackGroups.map((group) => <div key={group.label}><strong>{group.label}</strong><div className="resume-tags">{group.items.map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}</div></section>
          <section><h3>Langues</h3>{cv.languages.map((language) => <p key={language}>{language}</p>)}</section>
          <section><h3>Centres d’intérêt</h3>{cv.interests.map((interest) => <p key={interest}>{interest}</p>)}</section>
        </aside>
        <main className="resume-main">
          <section className="resume-profile"><p className="resume-label">Profil</p><p>{cv.summary}</p></section>
          <section><p className="resume-label">Expériences professionnelles</p><div className="resume-timeline">{cv.experiences.map((item, index) => <article key={index}><time>{item.period}</time><div><h3>{item.title}</h3><strong>{item.place}</strong><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></article>)}</div></section>
          <section><p className="resume-label">Projets techniques sélectionnés</p><div className="resume-projects">{selectedProjects.map((project) => project && <article key={project.id}><div><h3>{project.title}</h3>{project.demo && project.demo !== "#" && <a href={project.demo}>Voir le projet ↗</a>}</div><strong>{project.technologies.slice(0, 5).join(" · ")}</strong><p>{project.cvSummary || `${project.description.split(".")[0]}.`}</p></article>)}</div></section>
          <section><p className="resume-label">Formation</p><div className="resume-education">{cv.education.map((item, index) => <article key={index}><time>{item.period}</time><div><h3>{item.title}</h3><strong>{item.place}</strong></div></article>)}</div></section>
        </main>
      </div>
    </article>
  </div>;
};

export default Resume;
