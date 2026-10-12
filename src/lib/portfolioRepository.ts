import { defaultPortfolioContent } from "@/data/portfolioContent";
import type { PortfolioContent } from "@/types/portfolio";

const STORAGE_KEY = "rg-portfolio-content-v1";
const LOCAL_PASSWORD_KEY = "rg-portfolio-admin-password-v1";
const LOCAL_SESSION_KEY = "rg-portfolio-admin-session";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
let clientPromise: Promise<import("@supabase/supabase-js").SupabaseClient> | null = null;

const getSupabase = async () => {
  if (!hasSupabaseConfig) return null;
  clientPromise ||= import("@supabase/supabase-js").then(({ createClient }) => createClient(supabaseUrl!, supabaseAnonKey!));
  return clientPromise;
};

export const cmsMode = hasSupabaseConfig ? "cloud" : "local";

const normalizeContent = (saved?: Partial<PortfolioContent> | null): PortfolioContent => {
  const legacy = saved?.version !== 2;
  const identity = { ...defaultPortfolioContent.identity, ...saved?.identity };
  const hero = { ...defaultPortfolioContent.hero, ...saved?.hero };
  const cv = {
    ...defaultPortfolioContent.cv,
    ...saved?.cv,
    experiences: saved?.cv?.experiences || defaultPortfolioContent.cv.experiences,
    education: saved?.cv?.education || defaultPortfolioContent.cv.education,
    selectedProjectIds: saved?.cv?.selectedProjectIds || defaultPortfolioContent.cv.selectedProjectIds,
  };
  let manifesto = saved?.manifesto || defaultPortfolioContent.manifesto;
  let expertise = saved?.expertise || defaultPortfolioContent.expertise;
  let experiences = saved?.experiences || defaultPortfolioContent.experiences;
  let about = { ...defaultPortfolioContent.about, ...saved?.about };
  const projects = (saved?.projects || defaultPortfolioContent.projects).map((project) => {
    const projectDefaults = defaultPortfolioContent.projects.find((item) => item.id === project.id);
    const obsoleteBuiltInCopy = (project.id === 0 && project.description.startsWith("Je vous présente MiniBloom"))
      || (project.id === 1 && project.description.includes("architecture monolithique distribuée"))
      || (project.id === 9 && project.description.startsWith("Application de voyage interactive"))
      || (project.id === 10 && project.description.startsWith("Site vitrine pour une agence"))
      || (project.id === 11 && project.description.startsWith("Plateforme de services de jets"));
    return { ...projectDefaults, ...project, description: obsoleteBuiltInCopy ? projectDefaults?.description || project.description : project.description, fullDescription: obsoleteBuiltInCopy ? projectDefaults?.fullDescription : project.fullDescription, cvSummary: project.cvSummary || projectDefaults?.cvSummary };
  });

  if (legacy) {
    if (identity.role === "Fullstack Developer · Business Analyst") identity.role = defaultPortfolioContent.identity.role;
    if (hero.eyebrow === "Fullstack Developer · Business Analyst") hero.eyebrow = defaultPortfolioContent.hero.eyebrow;
    if (hero.introduction === "Je transforme des problématiques métier en expériences numériques utiles, élégantes et prêtes à vivre dans le monde réel.") hero.introduction = defaultPortfolioContent.hero.introduction;
    if (["Développeuse Fullstack & Business Analyst", "Développeuse Full-stack · React, TypeScript & Java"].includes(cv.headline)) cv.headline = defaultPortfolioContent.cv.headline;
    if (cv.summary === "Je transforme les besoins métier en produits numériques utiles, robustes et élégants, de l’analyse jusqu’à la mise en production.") cv.summary = defaultPortfolioContent.cv.summary;
    if (manifesto === "Je ne me contente pas d’écrire du code. Je relie les personnes, les enjeux métier et la technologie pour créer des produits qui ont du sens — du premier échange jusqu’à la mise en production.") manifesto = defaultPortfolioContent.manifesto;
    if (expertise[0]?.title === "Product thinking") expertise = defaultPortfolioContent.expertise;
    if (experiences[0]?.title === "Développeuse Fullstack & Business Analyst") experiences = defaultPortfolioContent.experiences;
    if (about.paragraphs?.[0]?.startsWith("Je suis Ramatoulaye, développeuse Fullstack et Business Analyst")) about = defaultPortfolioContent.about;
  }

  // Preserve genuine admin customizations while upgrading the previous built-in
  // copy to the more explicitly developer-focused direction.
  if (hero.titleLine1 === "Du besoin" && hero.titleLine2 === "au produit" && hero.titleAccent === "livré.") {
    Object.assign(hero, defaultPortfolioContent.hero);
  }
  if (["DÉVELOPPEUSE FULL-STACK · REACT · NODE · JAVA", "FULL-STACK DEVELOPER · REACT · TYPESCRIPT · JAVA"].includes(hero.eyebrow)) {
    hero.eyebrow = defaultPortfolioContent.hero.eyebrow;
  }
  if (manifesto === "J’écris du code pour construire des produits qui fonctionnent vraiment. Du front-end au back-end, je transforme les besoins métier en applications robustes, maintenables et prêtes pour la production.") {
    manifesto = defaultPortfolioContent.manifesto;
  }
  if (expertise[0]?.title === "Full-stack engineering") expertise = defaultPortfolioContent.expertise;
  if (saved?.process?.[0]?.verb === "Comprendre" && saved.process[1]?.verb === "Concevoir") saved.process = defaultPortfolioContent.process;
  if (saved?.skillGroups?.[5]?.title === "Design & produit") saved.skillGroups = defaultPortfolioContent.skillGroups;
  if (about.title === "Développeuse par métier." && about.accent === "Créatrice par nature.") about = defaultPortfolioContent.about;
  if (experiences[0]?.text === "Conception et développement d’applications métier, intégration d’API, modélisation des données, mise en production et maintenance applicative.") {
    experiences = defaultPortfolioContent.experiences;
  }

  const contact = { ...defaultPortfolioContent.contact, ...saved?.contact };
  if (contact.eyebrow === "09 — Et maintenant ?" && contact.title === "Construisons quelque chose") Object.assign(contact, defaultPortfolioContent.contact);

  return ({
  ...defaultPortfolioContent,
  ...saved,
  version: 2,
  identity,
  hero,
  manifesto,
  contact,
  appearance: { ...defaultPortfolioContent.appearance, ...saved?.appearance },
  sections: { ...defaultPortfolioContent.sections, ...saved?.sections },
  resume: { ...defaultPortfolioContent.resume, ...saved?.resume },
  cv,
  process: saved?.process || defaultPortfolioContent.process,
  expertise,
  skillGroups: saved?.skillGroups || defaultPortfolioContent.skillGroups,
  experiences,
  education: saved?.education || defaultPortfolioContent.education,
  about,
  projects,
  });
};

export const loadPortfolioContent = async (): Promise<PortfolioContent> => {
  const supabase = await getSupabase();
  if (supabase) {
    const { data, error } = await supabase.from("portfolio_content").select("content").eq("id", "main").maybeSingle();
    if (!error && data?.content) return normalizeContent(data.content as Partial<PortfolioContent>);
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeContent(JSON.parse(saved)) : defaultPortfolioContent;
  } catch {
    return defaultPortfolioContent;
  }
};

export const savePortfolioContent = async (content: PortfolioContent) => {
  const supabase = await getSupabase();
  if (supabase) {
    const { error } = await supabase.from("portfolio_content").upsert({ id: "main", content, updated_at: new Date().toISOString() });
    if (error) throw error;
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
};

export const uploadResume = async (file: File): Promise<string> => {
  const supabase = await getSupabase();
  if (supabase) {
    const safeName = `cv/ramatoulaye-gueye-${Date.now()}.pdf`;
    const { error } = await supabase.storage.from("portfolio-assets").upload(safeName, file, { upsert: true, contentType: "application/pdf" });
    if (error) throw error;
    return supabase.storage.from("portfolio-assets").getPublicUrl(safeName).data.publicUrl;
  }

  if (file.size > 2_500_000) throw new Error("En mode local, le PDF doit peser moins de 2,5 Mo.");
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Le CV n’a pas pu être lu."));
    reader.readAsDataURL(file);
  });
};

const sha256Fallback = (value: string) => {
  const constants = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const rotateRight = (word: number, bits: number) => (word >>> bits) | (word << (32 - bits));
  const bytes = new TextEncoder().encode(value);
  const paddedLength = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  new DataView(padded.buffer).setUint32(paddedLength - 4, bytes.length * 8, false);

  const hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const words = new Uint32Array(64);
  const view = new DataView(padded.buffer);
  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let index = 0; index < 16; index += 1) words[index] = view.getUint32(offset + index * 4, false);
    for (let index = 16; index < 64; index += 1) {
      const s0 = rotateRight(words[index - 15], 7) ^ rotateRight(words[index - 15], 18) ^ (words[index - 15] >>> 3);
      const s1 = rotateRight(words[index - 2], 17) ^ rotateRight(words[index - 2], 19) ^ (words[index - 2] >>> 10);
      words[index] = (words[index - 16] + s0 + words[index - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 64; index += 1) {
      const sum1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temporary1 = (h + sum1 + choice + constants[index] + words[index]) >>> 0;
      const sum0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temporary2 = (sum0 + majority) >>> 0;
      h = g; g = f; f = e; e = (d + temporary1) >>> 0; d = c; c = b; b = a; a = (temporary1 + temporary2) >>> 0;
    }
    [a, b, c, d, e, f, g, h].forEach((word, index) => { hash[index] = (hash[index] + word) >>> 0; });
  }
  return hash.map((word) => word.toString(16).padStart(8, "0")).join("");
};

const createSalt = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
};

const hashPassword = async (password: string, salt: string) => {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("");
  }
  return sha256Fallback(`${salt}:${password}`);
};

export const getAdminAuthState = async (): Promise<"setup" | "login" | "authenticated"> => {
  const supabase = await getSupabase();
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    return data.session ? "authenticated" : "login";
  }
  if (!window.localStorage.getItem(LOCAL_PASSWORD_KEY)) return "setup";
  return window.sessionStorage.getItem(LOCAL_SESSION_KEY) === "active" ? "authenticated" : "login";
};

export const setupLocalAdminPassword = async (password: string) => {
  if (hasSupabaseConfig) throw new Error("Utilisez l’authentification Supabase.");
  if (password.length < 8) throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
  const salt = createSalt();
  const hash = await hashPassword(password, salt);
  window.localStorage.setItem(LOCAL_PASSWORD_KEY, JSON.stringify({ salt, hash }));
  window.sessionStorage.setItem(LOCAL_SESSION_KEY, "active");
};

export const signInAdmin = async (email: string, password: string) => {
  const supabase = await getSupabase();
  if (!supabase) {
    const saved = window.localStorage.getItem(LOCAL_PASSWORD_KEY);
    if (!saved) throw new Error("Créez d’abord votre mot de passe.");
    const { salt, hash } = JSON.parse(saved) as { salt: string; hash: string };
    if (await hashPassword(password, salt) !== hash) throw new Error("Mot de passe incorrect.");
    window.sessionStorage.setItem(LOCAL_SESSION_KEY, "active");
    return { local: true };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOutAdmin = async () => {
  const supabase = await getSupabase();
  if (supabase) await supabase.auth.signOut();
  else window.sessionStorage.removeItem(LOCAL_SESSION_KEY);
};
