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
    eyebrow: "FULL-STACK DEVELOPER · REACT · TYPESCRIPT · JAVA",
    titleLine1: "Du besoin",
    titleLine2: "au produit",
    titleAccent: "livré.",
    introduction: "Je conçois et développe des applications web complètes, du front-end à l’API, avec une attention particulière portée à l’architecture, à la qualité du code et aux besoins métier.",
  },
  manifesto: "J’écris du code pour construire des produits qui fonctionnent vraiment. Du front-end au back-end, je transforme les besoins métier en applications robustes, maintenables et prêtes pour la production.",
  process: [
    { num: "01", verb: "Comprendre", title: "Le besoin avant la solution", text: "J’écoute, je questionne et je transforme les enjeux métier en objectifs, parcours et priorités clairs." },
    { num: "02", verb: "Concevoir", title: "Donner une forme à l’idée", text: "Architecture, user flows, maquettes et prototype : chaque décision prépare un produit cohérent et utile." },
    { num: "03", verb: "Construire", title: "Développer avec méthode", text: "Du front au back, je crée des interfaces robustes, accessibles et maintenables avec une vision produit." },
    { num: "04", verb: "Livrer", title: "Aller jusqu’au réel", text: "Déploiement, validation, documentation et amélioration continue : le projet ne s’arrête pas à la démo." },
  ],
  expertise: [
    { num: "01", title: "Full-stack engineering", text: "React, TypeScript, Node.js, PHP, Java, Spring Boot, API REST, PostgreSQL et Docker." },
    { num: "02", title: "Architecture & qualité", text: "SOLID, MVC, architecture hexagonale, DDD, validation, tests et conception d’API maintenables." },
    { num: "03", title: "Design & expérience", text: "Figma, direction visuelle, prototypes, design responsive et micro-interactions utiles." },
    { num: "04", title: "Analyse métier", text: "Recueil du besoin, cahier des charges, user stories, UML, BPMN et priorisation produit." },
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
    { period: "2025 — Aujourd’hui", title: "Développeuse Full-stack", place: "Digital Media Mobile · Dakar", text: "Conception et développement d’applications métier, intégration d’API, modélisation des données, mise en production et maintenance applicative." },
    { period: "2024", title: "Développeuse Full-stack — Gestion de flotte", place: "Multimédia, TGI · Dakar", text: "Développement d’une application multi-rôles pour gérer les véhicules, conducteurs, missions, suivi GPS et rapports de maintenance." },
    { period: "2024", title: "Développement web full-stack intensif", place: "Sonatel Academy · Dakar", text: "Onze mois de pratique, plus de dix applications et API réalisées, testées et déployées." },
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
      "Je suis Ramatoulaye, développeuse full-stack basée à Dakar. Je construis des applications web complètes, de l’interface à l’API et à la base de données, avec une attention particulière portée à l’architecture et à la qualité du code.",
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
    headline: "Développeuse Full-stack · React, TypeScript & Java",
    summary: "Développeuse full-stack basée à Dakar, je conçois des applications web de bout en bout : interfaces React, API, logique métier et bases de données. J’accorde une attention particulière à l’architecture, à la qualité du code et à la mise en production. Ma maîtrise de l’analyse métier me permet de transformer un besoin complexe en solution technique claire et maintenable.",
    phone: "",
    website: "",
    skills: ["React", "TypeScript", "JavaScript", "Node.js", "Express", "Java", "Spring Boot", "PHP", "Symfony", "API REST", "PostgreSQL", "Docker", "Git"],
    languages: ["Français — courant", "Anglais — professionnel"],
    interests: ["Design produit", "Intelligence artificielle", "Innovation numérique"],
    experiences: [
      { period: "2025 — Aujourd’hui", title: "Développeuse Full-stack", place: "Digital Media Mobile · Dakar", bullets: ["Conception et développement d’applications métier, de l’interface jusqu’aux services back-end.", "Modélisation des données, intégration d’API et préparation des mises en production.", "Traduction des besoins fonctionnels en fonctionnalités techniques maintenables."] },
      { period: "2024", title: "Développeuse Full-stack — Gestion de flotte", place: "Multimédia, TGI · Dakar", bullets: ["Développement d’une application web multi-rôles pour la gestion d’une flotte.", "Implémentation des modules véhicules, conducteurs, missions et maintenance."] },
      { period: "2024", title: "Développeuse Full-stack en formation intensive", place: "Sonatel Academy · Dakar", bullets: ["Réalisation de plus de dix applications web et API en onze mois de pratique intensive.", "Mise en œuvre de CRUD, authentification, architectures MVC et déploiements applicatifs."] },
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
