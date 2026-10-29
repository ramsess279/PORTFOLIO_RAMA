export type PortfolioSection = "manifesto" | "projects" | "method" | "expertise" | "skills" | "experience" | "education" | "about" | "contact";

export type ProjectMedia = { type: "image" | "video" | string; src: string };

export type PortfolioProject = {
  id: number;
  title: string;
  technologies: string[];
  description: string;
  fullDescription?: string;
  duration: string;
  referent?: string;
  media: ProjectMedia[];
  demo?: string;
  difficulty?: number;
  commented?: boolean;
  featured?: boolean;
  cvSummary?: string;
};

export type PortfolioContent = {
  version: 2;
  identity: {
    name: string;
    role: string;
    location: string;
    email: string;
    githubUrl: string;
    linkedinUrl: string;
  };
  hero: {
    availability: string;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    titleAccent: string;
    introduction: string;
  };
  manifesto: string;
  process: { num: string; verb: string; title: string; text: string }[];
  expertise: { num: string; title: string; text: string }[];
  skillGroups: { title: string; items: string[] }[];
  experiences: { period: string; title: string; place: string; text: string }[];
  education: { period: string; title: string; place: string }[];
  about: {
    title: string;
    accent: string;
    paragraphs: string[];
  };
  contact: {
    eyebrow: string;
    title: string;
    accent: string;
    introduction: string;
  };
  appearance: {
    accentColor: string;
    accentLightColor: string;
  };
  sections: Record<PortfolioSection, boolean>;
  resume: {
    mode?: "generated" | "imported";
    url: string;
    fileName: string;
    updatedAt: string;
  };
  cv: {
    headline: string;
    summary: string;
    phone: string;
    website: string;
    skills: string[];
    languages: string[];
    interests: string[];
    selectedProjectIds: number[];
    experiences: { period: string; title: string; place: string; bullets: string[] }[];
    education: { period: string; title: string; place: string }[];
  };
  projects: PortfolioProject[];
};
