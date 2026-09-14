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

const normalizeContent = (saved?: Partial<PortfolioContent> | null): PortfolioContent => ({
  ...defaultPortfolioContent,
  ...saved,
  identity: { ...defaultPortfolioContent.identity, ...saved?.identity },
  hero: { ...defaultPortfolioContent.hero, ...saved?.hero },
  contact: { ...defaultPortfolioContent.contact, ...saved?.contact },
  appearance: { ...defaultPortfolioContent.appearance, ...saved?.appearance },
  sections: { ...defaultPortfolioContent.sections, ...saved?.sections },
  resume: { ...defaultPortfolioContent.resume, ...saved?.resume },
  cv: {
    ...defaultPortfolioContent.cv,
    ...saved?.cv,
    experiences: saved?.cv?.experiences || defaultPortfolioContent.cv.experiences,
    education: saved?.cv?.education || defaultPortfolioContent.cv.education,
  },
  process: saved?.process || defaultPortfolioContent.process,
  expertise: saved?.expertise || defaultPortfolioContent.expertise,
  skillGroups: saved?.skillGroups || defaultPortfolioContent.skillGroups,
  experiences: saved?.experiences || defaultPortfolioContent.experiences,
  education: saved?.education || defaultPortfolioContent.education,
  about: { ...defaultPortfolioContent.about, ...saved?.about },
  projects: saved?.projects || defaultPortfolioContent.projects,
});

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

const hashPassword = async (password: string, salt: string) => {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("");
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
  const salt = crypto.randomUUID();
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
