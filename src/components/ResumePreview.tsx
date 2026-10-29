import { useEffect, useRef, useState } from "react";
import { ResumeDocument } from "./ResumeDocument";
import type { PortfolioContent } from "@/types/portfolio";

export const ResumePreview = ({ content }: { content: PortfolioContent }) => {
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(.5);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / (210 * 96 / 25.4))));
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={container} className="resume-preview"><div className="resume-page" style={{ zoom: scale, padding: 0, minHeight: 0, width: "210mm" }}><ResumeDocument content={content} /></div></div>;
};
