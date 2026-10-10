import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

const SeoManager = () => {
  const { pathname } = useLocation();
  const { content } = usePortfolioContent();
  useEffect(() => {
    const project = pathname.startsWith("/projects/") ? content.projects.find((item) => pathname.endsWith(`/${item.id}`)) : undefined;
    const titles: Record<string, string> = { "/": "Ramatoulaye Gueye — Développeuse full-stack", "/projects": "Projets techniques — Ramatoulaye Gueye", "/cv": "CV — Ramatoulaye Gueye", "/skills": "Compétences techniques — Ramatoulaye Gueye", "/experience": "Expériences — Ramatoulaye Gueye", "/education": "Formations — Ramatoulaye Gueye", "/about": "À propos — Ramatoulaye Gueye", "/contact": "Contact — Ramatoulaye Gueye" };
    const title = project ? `${project.title} — Étude de cas` : titles[pathname] || "Ramatoulaye Gueye — Portfolio";
    const description = project?.description || content.hero.introduction;
    document.title = title;
    const setMeta = (selector: string, attribute: string, value: string) => { let node = document.querySelector<HTMLMetaElement>(selector); if (!node) { node = document.createElement("meta"); document.head.appendChild(node); } node.setAttribute(attribute, value); };
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", window.location.href);
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = window.location.href.split("#")[0];
  }, [content, pathname]);
  return null;
};

export default SeoManager;
