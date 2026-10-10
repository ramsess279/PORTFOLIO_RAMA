import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import type { PortfolioContent } from "@/types/portfolio";

GlobalWorkerOptions.workerSrc = workerUrl;

export type ResumeImport = {
  file: File;
  text: string;
  identity: Partial<PortfolioContent["identity"]>;
  cv: Partial<PortfolioContent["cv"]>;
  detected: string[];
};

const section = (text: string, start: RegExp, ends: RegExp[]) => {
  const match = start.exec(text);
  if (!match) return "";
  const tail = text.slice(match.index + match[0].length);
  const end = ends.map((pattern) => pattern.exec(tail)?.index).filter((value): value is number => value !== undefined).sort((a, b) => a - b)[0];
  return tail.slice(0, end ?? tail.length).trim();
};

export const importResumePdf = async (file: File, current: PortfolioContent): Promise<ResumeImport> => {
  const pdf = await getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines = new Map<number, { x: number; value: string }[]>();
    content.items.forEach((item) => {
      if (!("str" in item) || !item.str.trim()) return;
      const y = Math.round(item.transform[5] / 3) * 3;
      lines.set(y, [...(lines.get(y) || []), { x: item.transform[4], value: item.str.trim() }]);
    });
    pages.push([...lines.entries()].sort((a, b) => b[0] - a[0]).map(([, words]) => words.sort((a, b) => a.x - b.x).map((word) => word.value).join(" ")).join("\n"));
  }

  const text = pages.join("\n").replace(/\n{3,}/g, "\n\n");
  if (text.trim().length < 40) throw new Error("Ce PDF semble être une image scannée. Utilisez un PDF contenant du texte ou complétez le CV manuellement.");
  const identity: ResumeImport["identity"] = {};
  const cv: ResumeImport["cv"] = {};
  const detected: string[] = [];
  const email = text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0];
  const phone = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0];
  const linkedin = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/i)?.[0];
  const github = text.match(/https?:\/\/(?:www\.)?github\.com\/[^\s]+/i)?.[0];
  if (email) { identity.email = email; detected.push("e-mail"); }
  if (phone) { cv.phone = phone.trim(); detected.push("téléphone"); }
  if (linkedin) { identity.linkedinUrl = linkedin; detected.push("LinkedIn"); }
  if (github) { identity.githubUrl = github; detected.push("GitHub"); }

  const profile = section(text, /(?:PROFIL|RÉSUMÉ|A PROPOS|À PROPOS)\s*\n/i, [/(?:EXPÉRIENCES?|PARCOURS|FORMATIONS?|COMPÉTENCES?)\s*\n/i]);
  if (profile.length > 45) { cv.summary = profile.replace(/\n/g, " ").slice(0, 900); detected.push("profil"); }

  const catalogue = [...new Set([...current.cv.skills, ...current.skillGroups.flatMap((group) => group.items), ...current.projects.flatMap((project) => project.technologies)])];
  const skills = catalogue.filter((skill) => new RegExp(`(^|[^A-Za-z])${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-z]|$)`, "i").test(text));
  if (skills.length) { cv.skills = skills; detected.push(`${skills.length} compétences`); }

  const languageBlock = section(text, /LANGUES?\s*\n/i, [/(?:CENTRES? D['’]INTÉRÊT|COMPÉTENCES?|FORMATIONS?|PROJETS?)\s*\n/i]);
  if (languageBlock) { cv.languages = languageBlock.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 8); detected.push("langues"); }
  return { file, text, identity, cv, detected };
};
