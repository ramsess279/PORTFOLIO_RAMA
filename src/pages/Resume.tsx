import { ArrowLeft, Download, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

const Resume = () => {
  const { content } = usePortfolioContent();
  const { cv, identity } = content;

  return <div className="resume-page">
    <div className="resume-toolbar"><Link to="/"><ArrowLeft /> Retour au portfolio</Link><button type="button" onClick={() => window.print()}><Download /> Télécharger / imprimer en PDF</button></div>
    <article className="resume-document">
      <header className="resume-header"><div className="resume-monogram">RG</div><div><p>Curriculum vitæ</p><h1>{identity.name}</h1><h2>{cv.headline}</h2></div></header>
      <div className="resume-layout">
        <aside className="resume-side">
          <section><h3>Contact</h3><a href={`mailto:${identity.email}`}><Mail />{identity.email}</a>{cv.phone && <span><Phone />{cv.phone}</span>}<span><MapPin />{identity.location}</span>{cv.website && <span>{cv.website}</span>}<a href={identity.githubUrl}><Github />GitHub</a><a href={identity.linkedinUrl}><Linkedin />LinkedIn</a></section>
          <section><h3>Compétences</h3><div className="resume-tags">{cv.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
          <section><h3>Langues</h3>{cv.languages.map((language) => <p key={language}>{language}</p>)}</section>
          <section><h3>Centres d’intérêt</h3>{cv.interests.map((interest) => <p key={interest}>{interest}</p>)}</section>
        </aside>
        <main className="resume-main">
          <section className="resume-profile"><p className="resume-label">Profil</p><p>{cv.summary}</p></section>
          <section><p className="resume-label">Expériences professionnelles</p><div className="resume-timeline">{cv.experiences.map((item, index) => <article key={index}><time>{item.period}</time><div><h3>{item.title}</h3><strong>{item.place}</strong><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></article>)}</div></section>
          <section><p className="resume-label">Formation</p><div className="resume-education">{cv.education.map((item, index) => <article key={index}><time>{item.period}</time><div><h3>{item.title}</h3><strong>{item.place}</strong></div></article>)}</div></section>
        </main>
      </div>
    </article>
  </div>;
};

export default Resume;
