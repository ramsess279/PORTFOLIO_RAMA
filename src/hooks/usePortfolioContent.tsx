import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultPortfolioContent } from "@/data/portfolioContent";
import { loadPortfolioContent } from "@/lib/portfolioRepository";
import type { PortfolioContent } from "@/types/portfolio";

type PortfolioContextValue = {
  content: PortfolioContent;
  setContent: (content: PortfolioContent) => void;
  loading: boolean;
  reload: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

const hexToHsl = (hex: string) => {
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) return null;
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const delta = max - min;
  if (delta) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }
  return `${Math.round((h + 360) % 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState(defaultPortfolioContent);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    setContent(await loadPortfolioContent());
    setLoading(false);
  };

  useEffect(() => { void reload(); }, []);

  useEffect(() => {
    const root = document.documentElement;
    const primary = hexToHsl(content.appearance.accentColor);
    const light = hexToHsl(content.appearance.accentLightColor);
    if (primary) root.style.setProperty("--primary", primary);
    if (light) root.style.setProperty("--primary-light", light);
  }, [content.appearance]);

  const value = useMemo(() => ({ content, setContent, loading, reload }), [content, loading]);
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export const usePortfolioContent = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolioContent doit être utilisé dans PortfolioProvider");
  return context;
};
