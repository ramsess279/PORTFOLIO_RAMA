import projectsData from "@/data/projects.json";
import type { PortfolioContent, PortfolioProject } from "@/types/portfolio";

export const defaultPortfolioContent: PortfolioContent = {
  version: 1,
  identity: {
    name: "Ramatoulaye Gueye",
    role: "Fullstack Developer · Business Analyst",
    location: "Dakar, Sénégal",
    email: "ramatoulaye.rtg@gmail.com",
    githubUrl: "https://github.com/rama-lpb",
    linkedinUrl: "https://www.linkedin.com/in/rama-gueye-",
  },
  hero: {
    availability: "Disponible pour de nouvelles opportunités",
    eyebrow: "Fullstack Developer · Business Analyst",
    titleLine1: "Du besoin",
    titleLine2: "au produit",
    titleAccent: "livré.",
    introduction: "Je transforme des problématiques métier en expériences numériques utiles, élégantes et prêtes à vivre dans le monde réel.",
  },
  manifesto: "Je ne me contente pas d’écrire du code. Je relie les personnes, les enjeux métier et la technologie pour créer des produits qui ont du sens — du premier échange jusqu’à la mise en production.",
  process: [
    { num: "01", verb: "Comprendre", title: "Le besoin avant la solution", text: "J’écoute, je questionne et je transforme les enjeux métier en objectifs, parcours et priorités clairs." },
    { num: "02", verb: "Concevoir", title: "Donner une forme à l’idée", text: "Architecture, user flows, maquettes et prototype : chaque décision prépare un produit cohérent et utile." },
    { num: "03", verb: "Construire", title: "Développer avec méthode", text: "Du front au back, je crée des interfaces robustes, accessibles et maintenables avec une vision produit." },
    { num: "04", verb: "Livrer", title: "Aller jusqu’au réel", text: "Déploiement, validation, documentation et amélioration continue : le projet ne s’arrête pas à la démo." },
  ],
  expertise: [
    { num: "01", title: "Product thinking", text: "Cahier des charges, ateliers, user stories, UML, priorisation MoSCoW et méthodes Agile." },
    { num: "02", title: "Engineering", text: "React, TypeScript, Node.js, PHP, Java, Spring Boot, API REST, PostgreSQL et Docker." },
    { num: "03", title: "Design & expérience", text: "Figma, direction visuelle, prototypes, design responsive et micro-interactions utiles." },
    { num: "04", title: "IA & automatisation", text: "Agents, outils d’assistance et workflows IA intégrés avec discernement au processus produit." },
  ],
  skillGroups: [
    { title: "Langages", items: ["JavaScript", "TypeScript", "Java", "PHP", "C", "HTML", "CSS"] },
    { title: "Front & Back", items: ["React", "Node.js", "Express", "Symfony", "Spring Boot", "Tailwind CSS"] },
    { title: "Data & qualité", items: ["PostgreSQL", "MySQL", "Prisma", "Zod", "JUnit", "API REST"] },
    { title: "Architecture", items: ["POO", "SOLID", "MVC", "Architecture hexagonale", "DDD", "UML", "BPMN"] },
    { title: "Outils & DevOps", items: ["Git", "GitHub", "Docker", "Maven", "Gradle", "Jira", "Notion"] },
    { title: "Design & produit", items: ["Figma", "Canva", "Illustrator", "User stories", "MoSCoW", "Agile / Scrum"] },
  ],
  experiences: [
    { period: "2025 — Aujourd’hui", title: "Développeuse Fullstack & Business Analyst", place: "Digital Media Mobile · Dakar", text: "Recueil du besoin, cahier des charges, conception, développement, mise en production et maintenance applicative." },
    { period: "2024", title: "Développement Fullstack — Gestion de flotte", place: "Multimédia, TGI · Dakar", text: "Application multi-rôles pour gérer les véhicules, conducteurs, missions, suivi GPS et rapports de maintenance." },
    { period: "2024", title: "Formation intensive Fullstack", place: "Sonatel Academy · Dakar", text: "Onze mois de pratique, plus de dix projets réalisés et déployés, APIs et applications complexes." },
  ],
  education: [
    { period: "2026 — En cours", title: "Licence 3 Développement Web/Mobile & Génie Logiciel", place: "ESP 221" },
    { period: "2025", title: "Développement FullStack Web/Mobile", place: "Orange Digital Center" },
    { period: "2022 — 2025", title: "Licence 2 IDA", place: "Université Cheikh Hamidou Kane" },
    { period: "2022 — 2024", title: "DST en Génie Informatique", place: "ESP" },
    { period: "2021 — 2022", title: "Baccalauréat S2", place: "Complexe Symbiose" },
  ],
  about: {
    title: "Développeuse par métier.",
    accent: "Créatrice par nature.",
    paragraphs: [
      "Je suis Ramatoulaye, développeuse Fullstack et Business Analyst basée à Dakar. Ma force est de pouvoir circuler entre les conversations métier, la conception et le code sans perdre le fil du produit.",
      "J’aime les problèmes complexes, les interfaces qui paraissent évidentes et les technologies utilisées avec intention.",
    ],
  },
  contact: {
    eyebrow: "09 — Et maintenant ?",
    title: "Construisons quelque chose",
    accent: "d’inoubliable.",
    introduction: "Une opportunité, un produit à imaginer ou un défi technique ? Parlons-en.",
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
  resume: { url: "", fileName: "", updatedAt: "" },
  cv: {
    headline: "Développeuse Fullstack & Business Analyst",
    summary: "Je transforme les besoins métier en produits numériques utiles, robustes et élégants, de l’analyse jusqu’à la mise en production.",
    phone: "",
    website: "",
    skills: ["React", "TypeScript", "Node.js", "Java", "Spring Boot", "PHP", "PostgreSQL", "Docker", "Figma", "UML", "Agile / Scrum"],
    languages: ["Français — courant", "Anglais — professionnel"],
    interests: ["Design produit", "Intelligence artificielle", "Innovation numérique"],
    experiences: [
      { period: "2025 — Aujourd’hui", title: "Développeuse Fullstack & Business Analyst", place: "Digital Media Mobile · Dakar", bullets: ["Analyse des besoins et rédaction de cahiers des charges.", "Conception, développement et mise en production d’applications métier.", "Collaboration avec les équipes produit et parties prenantes."] },
      { period: "2024", title: "Développement Fullstack — Gestion de flotte", place: "Multimédia, TGI · Dakar", bullets: ["Conception d’une application multi-rôles de gestion de flotte.", "Gestion des véhicules, missions, conducteurs et rapports de maintenance."] },
      { period: "2024", title: "Formation intensive Fullstack", place: "Sonatel Academy · Dakar", bullets: ["Onze mois de pratique intensive et plus de dix projets réalisés.", "Développement d’API et d’applications web complexes."] },
    ],
    education: [
      { period: "2026 — En cours", title: "Licence 3 Développement Web/Mobile & Génie Logiciel", place: "ESP 221" },
      { period: "2025", title: "Développement FullStack Web/Mobile", place: "Orange Digital Center" },
      { period: "2022 — 2024", title: "DST en Génie Informatique", place: "ESP" },
    ],
  },
  projects: (projectsData.projects as PortfolioProject[]).map((project) => ({
    ...project,
    featured: [-1, 0, 1, 9].includes(project.id),
  })),
};
