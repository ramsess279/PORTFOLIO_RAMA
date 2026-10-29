import type { PortfolioContent } from "@/types/portfolio";
export const resumeRubrics = { experience: "Expériences", education: "Formations", skills: "Compétences", programming: "Langages informatiques", languages: "Langues parlées", projects: "Projets", profile: "Profil", interests: "Centres d’intérêt" };
export type ResumeRubric = keyof typeof resumeRubrics;
export type ResumeSuggestion = { title: string; source: string; parts: { label: string; text: string }[] };
const normalized = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export const detectResumeRubric = (text: string): ResumeRubric | null => {
  const value = normalized(text);
  if (/experience|parcours professionnel/.test(value)) return "experience";
  if (/formation|education|diplome/.test(value)) return "education";
  if (/langage|programming/.test(value)) return "programming";
  if (/langue|languages/.test(value)) return "languages";
  if (/competence|stack|skills/.test(value)) return "skills";
  if (/projet|project/.test(value)) return "projects";
  if (/profil|a propos|resume|objectif/.test(value)) return "profile";
  if (/interet|loisir/.test(value)) return "interests";
  return null;
};
export const getResumeSuggestions = (content: PortfolioContent, rubric: ResumeRubric): ResumeSuggestion[] => {
  switch (rubric) {
    case "experience": return content.experiences.map((item) => ({ title: item.place, source: "Portfolio · Expériences", parts: [{ label: "Poste", text: item.title }, { label: "Période", text: item.period }, { label: "Entreprise", text: item.place }, { label: "Missions", text: item.text }] }));
    case "education": return content.education.map((item) => ({ title: item.title, source: "Portfolio · Formations", parts: [{ label: "Diplôme", text: item.title }, { label: "Période", text: item.period }, { label: "Établissement", text: item.place }] }));
    case "skills": return content.skillGroups.map((item) => ({ title: item.title, source: "Portfolio · Compétences", parts: [{ label: "Technologies", text: item.items.join(" · ") }] }));
    case "programming": return content.skillGroups.filter((item) => /langage|language/i.test(item.title)).map((item) => ({ title: item.title, source: "Portfolio · Compétences", parts: [{ label: "Langages", text: item.items.join(" · ") }] }));
    case "languages": return content.cv.languages.filter(Boolean).map((text) => ({ title: text, source: "Informations CV enregistrées · Niveau à vérifier", parts: [{ label: "Langue et niveau", text }] }));
    case "projects": return content.projects.filter((item) => !item.commented).map((item) => ({ title: item.title, source: "Portfolio · Projets", parts: [{ label: "Projet", text: item.title }, { label: "Résumé", text: item.cvSummary || item.description }, { label: "Technologies", text: item.technologies.join(" · ") }] }));
    case "profile": return [{ title: "Présentation professionnelle", source: "Portfolio · À propos", parts: [{ label: "Titre", text: content.identity.role }, { label: "Présentation", text: content.about.paragraphs[0] || content.hero.introduction }, { label: "Version CV enregistrée", text: content.cv.summary }] }];
    case "interests": return [{ title: "Centres d’intérêt", source: "Informations CV enregistrées", parts: [{ label: "Intérêts", text: content.cv.interests.join(" · ") }] }];
  }
};

/** Headings must match the whole label: a job mentioning “full-stack” is not a skills heading. */
export const detectResumeHeading = (text: string): ResumeRubric | null => {
  const label = normalized(text).replace(/\s*[-–—]\s*suite$/, "").replace(/^[\d\s.\-–—:]+|[\s:]+$/g, "").trim();
  const headings: [ResumeRubric, RegExp][] = [
    ["experience", /^(experiences?( professionnelles?)?|parcours( professionnel)?|professional experience|work experience|employment)$/],
    ["education", /^(formations?( et diplomes?)?|education|diplomes?|parcours academique)$/],
    ["programming", /^(langages?( informatiques?| de programmation)?|programming languages)$/],
    ["languages", /^(langues?( parlees?)?|languages)$/],
    ["skills", /^(competences?( techniques?)?|stack( technique)?|skills|technical skills)$/],
    ["projects", /^(projets?( techniques?| personnels?| professionnels?)?|projects)$/],
    ["profile", /^(profil( professionnel)?|a propos|resume|objectifs?|summary|profile)$/],
    ["interests", /^(centres? d['’ ]interet|loisirs?|interests)$/],
  ];
  return headings.find(([, pattern]) => pattern.test(label))?.[0] ?? null;
};
