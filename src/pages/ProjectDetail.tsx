import { useEffect, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Braces, ChevronLeft, ChevronRight, Clock, ExternalLink, Pause, Play } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useReveal } from "@/hooks/useReveal";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

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

type TechnicalProfile = {
  role: string;
  problem: string;
  architecture: string;
  decisions: string[];
  contributions: string[];
  outcome: string;
  nextStep: string;
  layers: string[];
  tradeoff: string;
};

const technicalProfiles: Record<number, TechnicalProfile> = {
  [-1]: {
    role: "Architecture back-end",
    problem: "Transformer un processus de vote sensible en règles métier explicites, sans laisser le framework dicter le fonctionnement du domaine.",
    architecture: "Le domaine reste au centre. Les cas d’usage orchestrent les règles, tandis que Spring Boot et PostgreSQL restent accessibles par des ports et des adaptateurs.",
    decisions: ["DDD pour nommer et isoler le métier", "Architecture hexagonale pour limiter le couplage", "PostgreSQL pour une persistance relationnelle robuste"],
    contributions: ["Modélisation du domaine électoral", "Définition des cas d’usage et des contrats", "Implémentation de l’API avec Spring Boot", "Conception de la couche de persistance"],
    outcome: "Un socle back-end structuré, lisible et prêt à évoluer sans mélanger les règles métier avec l’infrastructure.",
    nextStep: "Finaliser les scénarios métier, renforcer la sécurité et préparer le déploiement.",
    layers: ["Entrées API", "Cas d’usage", "Domaine", "Adaptateurs SQL"],
    tradeoff: "Privilégier une structure métier plus exigeante au départ pour gagner en testabilité et en évolutivité.",
  },
  0: {
    role: "Développement full-stack",
    problem: "Livrer en trois jours une boutique réellement utilisable, du catalogue jusqu’au suivi des commandes, avec un espace d’administration cohérent.",
    architecture: "Une interface React consomme une API REST Node.js / Express. MongoDB porte les données du catalogue, du panier et des commandes.",
    decisions: ["Découpage par parcours utilisateur", "API REST pour séparer interface et logique", "Composants réutilisables pour livrer vite sans dupliquer"],
    contributions: ["Catalogue, catégories et recherche", "Panier et création de commande", "Gestion des produits et des stocks", "Tableau de bord et indicateurs"],
    outcome: "Un MVP e-commerce complet, navigable et mis en ligne en 72 heures.",
    nextStep: "Industrialiser les tests et consolider le paiement, la sécurité et l’observabilité.",
    layers: ["React UI", "API REST", "Node / Express", "MongoDB"],
    tradeoff: "Limiter le périmètre aux parcours essentiels pour garantir une livraison complète en 72 heures.",
  },
  1: {
    role: "Développement full-stack",
    problem: "Rendre lisibles des processus RH multi-rôles : authentification, gestion des employés, paie et pilotage depuis un même produit.",
    architecture: "Le front React dialogue avec une API Node.js / Express. Prisma structure l’accès aux données et TypeScript sécurise les contrats entre les couches.",
    decisions: ["Contrôle d’accès fondé sur les rôles", "Schéma de données centralisé avec Prisma", "Modules métier séparés pour faire évoluer le produit"],
    contributions: ["Authentification et autorisations", "Gestion des employés", "Modules de paie", "Dashboard et indicateurs RH"],
    outcome: "Un workflow RH multi-rôles regroupé dans une application déployée et démontrable.",
    nextStep: "Approfondir les tests d’intégration et automatiser davantage les opérations sensibles.",
    layers: ["React", "API Express", "Modules RH", "Prisma / Data"],
    tradeoff: "Centraliser le schéma de données tout en maintenant des modules métier clairement séparés.",
  },
  9: {
    role: "Développement front-end",
    problem: "Organiser une grande richesse de contenus touristiques sans perdre l’utilisateur, sur mobile comme sur desktop.",
    architecture: "Next.js structure les pages et les parcours, React compose l’interface et Tailwind CSS garantit un système responsive cohérent.",
    decisions: ["Hiérarchie de contenu orientée découverte", "Composants réutilisables par destination", "Responsive pensé dès la structure des pages"],
    contributions: ["Pages de destinations", "Navigation et parcours de découverte", "Informations pratiques et guide", "Intégration responsive puis déploiement"],
    outcome: "Une expérience éditoriale responsive, claire et disponible en ligne.",
    nextStep: "Enrichir la recherche, les filtres et les données de contenu.",
    layers: ["Next.js", "Composants", "Contenus", "Vercel"],
    tradeoff: "Favoriser une navigation éditoriale lisible avant d’ajouter des fonctions de recherche avancée.",
  },
};

const buildFallbackProfile = (description: string): TechnicalProfile => ({
  role: "Conception & développement",
  problem: description,
  architecture: "Une architecture choisie selon les contraintes du produit, avec une séparation claire entre interface, logique métier et données.",
  decisions: ["Découpage fonctionnel clair", "Composants et services réutilisables", "Stack adaptée au périmètre du projet"],
  contributions: ["Analyse du besoin", "Conception de la solution", "Développement des fonctionnalités", "Validation et livraison"],
  outcome: "Une solution fonctionnelle qui transforme un besoin concret en expérience numérique utilisable.",
  nextStep: "Poursuivre l’industrialisation, les tests et la mesure des usages.",
  layers: ["Interface", "Services", "Métier", "Données"],
  tradeoff: "Concentrer l’effort sur la valeur centrale du produit avant les optimisations secondaires.",
});

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
                <video src={item.src} controls playsInline preload={index === active ? "metadata" : "none"} poster={poster} onPlay={() => setPaused(true)} />
              ) : (
                <img src={item.src} alt={`${title} — aperçu ${index + 1}`} loading={index > 1 ? "lazy" : "eager"} decoding="async" />
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
  const { content } = usePortfolioContent();
  const project = content.projects.find((item) => String(item.id) === projectId);

  useEffect(() => {
    document.body.classList.add("project-page-open");
    return () => document.body.classList.remove("project-page-open");
  }, []);

  if (!project) return <Navigate to="/projects" replace />;

  const identity = identities[project.id] || { ...fallbackIdentity, name: project.title.split(/\s[-–]\s/)[0] };
  const hasDemo = Boolean(project.demo && project.demo !== "#");
  const media = project.media.filter((item) => item.src !== "/placeholder.svg");
  const technicalProfile = technicalProfiles[project.id] || buildFallbackProfile(project.description);
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
          <div><Braces /><span>Rôle</span><strong>{technicalProfile.role}</strong></div>
          <div><ArrowUpRight /><span>Statut</span><strong>{hasDemo ? "Disponible en ligne" : "Prototype / projet privé"}</strong></div>
        </div>

        <section id="probleme" className="case-story reveal-blur">
          <p className="section-index">01 — Problème & périmètre</p>
          <div><h2>Le besoin derrière<br /><em>le code.</em></h2><p>{technicalProfile.problem}</p></div>
        </section>

        <section id="architecture" className="case-engineering reveal-blur">
          <div className="case-engineering__intro">
            <p className="section-index">02 — Architecture & décisions</p>
            <h2>Des choix techniques<br />qui servent <em>le produit.</em></h2>
            <p>{technicalProfile.architecture}</p>
          </div>
          <ol>{technicalProfile.decisions.map((decision, index) => <li key={decision}><small>{String(index + 1).padStart(2, "0")}</small><span>{decision}</span></li>)}</ol>
          <div className="case-flow" aria-label="Flux d’architecture">{technicalProfile.layers.map((layer, index) => <span key={layer}>{layer}{index < technicalProfile.layers.length - 1 && <ArrowRight />}</span>)}</div>
          <p className="case-tradeoff"><strong>Compromis assumé</strong>{technicalProfile.tradeoff}</p>
        </section>

        <section id="contribution" className="case-contributions reveal-blur">
          <div><p className="section-index">03 — Ma contribution</p><h2>Ce que j’ai<br /><em>développé.</em></h2></div>
          <ul>{technicalProfile.contributions.map((contribution) => <li key={contribution}><ArrowRight /><span>{contribution}</span></li>)}</ul>
        </section>

        <section id="stack" className="case-stack reveal-blur">
          <p className="section-index">04 — Stack technique</p>
          <div>{project.technologies.map((technology, index) => <span key={technology}><small>{String(index + 1).padStart(2, "0")}</small>{technology}</span>)}</div>
        </section>

        <section id="resultat" className="case-outcome reveal-blur">
          <p className="section-index">05 — Livraison & suite</p>
          <div><span>Résultat</span><p>{technicalProfile.outcome}</p></div>
          <div><span>Prochaine étape</span><p>{technicalProfile.nextStep}</p></div>
        </section>

        <section className="case-next reveal-blur">
          <span>La suite</span><h2>Découvrir les autres<br />études de cas.</h2><Link to="/projects">Voir tous les projets <ArrowRight /></Link>
        </section>

        <footer className="case-footer reveal-blur"><p>Un projet similaire en tête ?</p><a href={`mailto:${content.identity.email}`}>Parlons-en <ArrowUpRight /></a></footer>
      </div>
    </article>
  );
};

export default ProjectDetail;
