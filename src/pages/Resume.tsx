import { useEffect, useState } from "react";
import { loadResumeDraft } from "@/lib/resumeDraftStorage";
import { ArrowLeft, Download } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";
import { ResumeDocument } from "@/components/ResumeDocument";
import { PdfResume } from "@/components/PdfResume";
import type { PortfolioContent } from "@/types/portfolio";

const Resume = () => {
  const { content: published } = usePortfolioContent();
  const [params] = useSearchParams();
  const preview = params.get("preview") === "1";
  const [previewResume, setPreviewResume] = useState<PortfolioContent["resume"] | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  useEffect(() => {
    let active = true;
    if (preview) void loadResumeDraft().then((resume) => { if (active) setPreviewResume(resume); })
      .catch(() => undefined).finally(() => { if (active) setPreviewReady(true); });
    return () => { active = false; };
  }, [preview]);
  let content = published;
  if (preview) {
    try { const saved = sessionStorage.getItem("rg-cv-preview"); if (saved) content = JSON.parse(saved) as PortfolioContent; } catch { /* Use the durable PDF draft below. */ }
    if (!previewReady) return <p>Chargement du brouillon du CV…</p>;
    if (previewResume) content = { ...content, resume: previewResume };
  }
  const imported = content.resume.mode === "imported" && Boolean(content.resume.url);
  return <div className="resume-page">
    <div className="resume-toolbar"><Link to={preview ? "/admin" : "/"}><ArrowLeft />{preview ? "Retour à l’admin · Brouillon" : "Retour au portfolio"}</Link>{imported && <a className="cv-download-button" href={content.resume.url} download={content.resume.fileName || "CV_Ramatoulaye_Gueye.pdf"}><Download /> Télécharger mon CV (PDF)</a>}{!imported && <button type="button" onClick={() => window.print()}><Download /> Télécharger / imprimer en PDF</button>}</div>
    {imported ? <PdfResume url={content.resume.url} fileName={content.resume.fileName} showDownload={false} /> : <ResumeDocument content={content} />}
  </div>;
};
export default Resume;
