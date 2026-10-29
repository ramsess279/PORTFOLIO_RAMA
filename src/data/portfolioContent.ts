import publishedResumeUrl from "@/assets/cv-published.pdf?url";
import { dmmMissions } from "@/lib/resumeExperienceContent";
import projectsData from "@/data/projects.json";
import type { PortfolioContent, PortfolioProject } from "@/types/portfolio";

export const defaultPortfolioContent: PortfolioContent = {
  version: 2,
  identity: {
    name: "Ramatoulaye Gueye",
    role: "Développeuse Full-stack",
    location: "Dakar, Sénégal",
    email: "ramatoulaye.rtg@gmail.com",
    githubUrl: "https://github.com/rama-lpb",
    linkedinUrl: "https://www.linkedin.com/in/rama-gueye-",
  },
  hero: {
    availability: "Disponible pour de nouvelles opportunités",
    eyebrow: "DÉVELOPPEUSE FULL-STACK · DE L’IDÉE À LA PRODUCTION",
    titleLine1: "Je développe",
    titleLine2: "des applications",
    titleAccent: "full-stack.",
    introduction: "Je développe des applications web de bout en bout : interfaces React, API métier, bases de données et déploiement. Mon objectif : un code clair, testable et prêt pour la production.",
  },
  manifesto: "Je transforme des besoins métier en systèmes fonctionnels. Je structure le front-end, conçois les API, modélise les données et pousse chaque fonctionnalité jusqu’à une version utilisable, maintenable et déployable.",
  process: [
    { num: "01", verb: "Cadrer", title: "Transformer le besoin en logique", text: "Je clarifie les règles métier, les utilisateurs, les données et les critères d’acceptation avant d’écrire le code." },
    { num: "02", verb: "Architecturer", title: "Poser des fondations solides", text: "Je définis les responsabilités, les flux, le modèle de données et les contrats d’API qui feront tenir l’application." },
    { num: "03", verb: "Développer", title: "Construire par itérations", text: "J’implémente le front-end et le back-end en composants et modules lisibles, réutilisables et testables." },
    { num: "04", verb: "Déployer", title: "Aller jusqu’à la production", text: "Je valide les parcours, corrige les erreurs, documente et prépare une livraison fiable et maintenable." },
  ],
  expertise: [
    { num: "01", title: "Front-end engineering", text: "Interfaces React et TypeScript, composants réutilisables, gestion d’état, responsive design et accessibilité." },
    { num: "02", title: "Back-end & API", text: "Services Node.js, Express, Java, Spring Boot, PHP et Symfony avec authentification, validation et logique métier." },
    { num: "03", title: "Data & architecture", text: "PostgreSQL, MySQL, Prisma, modélisation relationnelle, SOLID, MVC, DDD et architecture hexagonale." },
    { num: "04", title: "Qualité & livraison", text: "Git, Docker, tests, gestion des erreurs, documentation technique et préparation à la mise en production." },
  ],
  skillGroups: [
    { title: "Langages", items: ["JavaScript", "TypeScript", "Java", "PHP", "C", "HTML", "CSS"] },
    { title: "Front & Back", items: ["React", "Node.js", "Express", "Symfony", "Spring Boot", "Tailwind CSS"] },
    { title: "Data & qualité", items: ["PostgreSQL", "MySQL", "Prisma", "Zod", "JUnit", "API REST"] },
    { title: "Architecture", items: ["POO", "SOLID", "MVC", "Architecture hexagonale", "DDD", "UML"] },
    { title: "Outils & DevOps", items: ["Git", "GitHub", "Docker", "Maven", "Gradle"] },
    { title: "Conception & documentation", items: ["Figma", "Documentation technique"] },
  ],
  experiences: [
    { period: "2025 — Aujourd’hui", title: "Développeuse Full-stack", place: "Digital Media Mobile · Dakar", text: dmmMissions.join("; ") },
    { period: "2024", title: "Développeuse Full-stack — Gestion de flotte", place: "Multimédia, TGI · Dakar", text: "Conception d’une application multi-rôles ; développement des modules véhicules, conducteurs, missions et maintenance ; intégration du suivi GPS et génération de rapports automatisés." },
    { period: "2025", title: "Développement web full-stack intensif", place: "Sonatel Academy · Dakar", text: "Conception et livraison de plus de dix applications et API : CRUD, authentification, validation, architectures MVC, travail en équipe, documentation et déploiement." },
  ],
  education: [
    { period: "2026 — En cours", title: "Licence 3 Développement Web/Mobile & Génie Logiciel", place: "ESP 221" },
    { period: "2025", title: "Développement FullStack Web/Mobile", place: "Orange Digital Center" },
    { period: "2022 — 2025", title: "Licence 2 IDA", place: "Université Cheikh Hamidou Kane" },
    { period: "2022 — 2024", title: "DST en Génie Informatique", place: "ESP" },
    { period: "2021 — 2022", title: "Baccalauréat S2", place: "Complexe Symbiose" },
  ],
  about: {
    title: "Développeuse full-stack.",
    accent: "Du code à la production.",
    paragraphs: [
      "Je suis Ramatoulaye, développeuse full-stack basée à Dakar. Je construis des applications web complètes, de l’interface à l’API et à la base de données, avec une attention particulière portée à l’architecture et à la qualité du code.",
      "J’aime les problèmes complexes, les interfaces qui paraissent évidentes et les technologies utilisées avec intention.",
    ],
  },
  contact: {
    eyebrow: "10 — Et maintenant ?",
    title: "Un produit à construire",
    accent: "ou un défi technique ?",
    introduction: "Je suis disponible pour une opportunité full-stack, une collaboration produit ou un projet technique ambitieux.",
  },
  appearance: {
    accentColor: "#ee2b5b",
    accentLightColor: "#f05279",
  },
  sections: {
    manifesto: true,
    projects: true,
    method: true,
    expertise: true,
    skills: true,
    experience: true,
    education: true,
    about: true,
    contact: true,
  },
  resume: { mode: "imported", url: publishedResumeUrl, fileName: "CV_Ramatoulaye_Gueye.pdf", updatedAt: "2026-10-29" },
  cv: {
    headline: "Développeuse full-stack · Applications web & logiciels métier",
    summary: "Développeuse full-stack basée à Dakar, je conçois des applications web de bout en bout : interfaces React, API, logique métier et bases de données. J’accorde une attention particulière à l’architecture, à la qualité du code et à la mise en production. Je privilégie un code clair, testable et maintenable, de la conception au déploiement.",
    phone: "",
    website: "",
    skills: ["React", "TypeScript", "JavaScript", "Node.js", "Express", "Java", "Spring Boot", "PHP", "Symfony", "API REST", "PostgreSQL", "Docker", "Git"],
    languages: ["Français — bilingue", "Espagnol — intermédiaire", "Anglais — notions"],
    interests: ["Architecture logicielle", "Intelligence artificielle", "Innovation numérique"],
    experiences: [
      { period: "2025 — Aujourd’hui", title: "Développeuse Full-stack", place: "Digital Media Mobile · Dakar", bullets: dmmMissions },
      { period: "2024", title: "Développeuse Full-stack — Gestion de flotte", place: "Multimédia, TGI · Dakar", bullets: ["Développement d’une application web multi-rôles pour la gestion d’une flotte.", "Implémentation des modules véhicules, conducteurs, missions et maintenance."] },
      { period: "2025", title: "Développeuse Full-stack en formation intensive", place: "Sonatel Academy · Dakar", bullets: ["Réalisation de plus de dix applications web et API en onze mois de pratique intensive.", "Mise en œuvre de CRUD, authentification, architectures MVC et déploiements applicatifs."] },
    ],
    education: [
      { period: "2026 — En cours", title: "Licence 3 Développement Web/Mobile & Génie Logiciel", place: "ESP 221" },
      { period: "2025", title: "Développement FullStack Web/Mobile", place: "Orange Digital Center" },
      { period: "2022 — 2024", title: "DST en Génie Informatique", place: "ESP" },
    ],
    selectedProjectIds: [-1, 1, 0],
  },
  projects: (projectsData.projects as PortfolioProject[]).map((project) => ({
    ...project,
    featured: [-1, 0, 1, 9].includes(project.id),
  })),
};
