import { useEffect, useRef, useState } from "react";
import { getDocument, type PDFDocumentProxy } from "pdfjs-dist/legacy/build/pdf.mjs";
import "@/lib/resumeImport";

// Render the published pages directly, without the browser PDF viewer or its
// annotation controls. The downloadable document remains the original PDF.
const ReadOnlyPage = ({ pdf, number, visibleText }: { pdf: PDFDocumentProxy; number: number; visibleText?: string }) => {
  const paper = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    const element = paper.current;
    if (!element) return;
    let disposed = false;
    let generation = 0;
    let previousWidth = 0;
    let render: { cancel: () => void } | undefined;
    setError(false);
    void pdf.getPage(number).then((page) => {
      if (disposed) return;
      if (visibleText !== undefined) setText(visibleText);
      else void page.getTextContent().then((content) => {
        if (!disposed) setText(content.items.flatMap((item) => "str" in item ? [item.str] : []).join(" "));
      }).catch(() => undefined);
      const draw = async () => {
        const width = Math.round(element.getBoundingClientRect().width);
        if (!width || width === previousWidth || disposed) return;
        previousWidth = width;
        const current = ++generation;
        render?.cancel();
        const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width * Math.min(window.devicePixelRatio || 1, 2) });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        canvas.setAttribute("aria-hidden", "true");
        const task = page.render({ canvas, viewport });
        render = task;
        try {
          await task.promise;
          if (!disposed && current === generation) element.replaceChildren(canvas);
        } catch (reason) {
          if (!disposed && current === generation && !(reason instanceof Error && reason.name === "RenderingCancelledException")) setError(true);
        }
      };
      observer = new ResizeObserver(() => { void draw(); });
      observer.observe(element);
      void draw();
    }).catch(() => { if (!disposed) setError(true); });
    let observer: ResizeObserver | undefined;
    return () => { disposed = true; generation++; observer?.disconnect(); render?.cancel(); };
  }, [pdf, number, visibleText]);
  return <figure className="pdf-reader-page" aria-label={`Page ${number} sur ${pdf.numPages}`}>
    <div ref={paper} className="pdf-reader-page__paper" />
    <figcaption className="sr-only">Page {number} sur {pdf.numPages}. {text}</figcaption>
    {error && <p role="alert">Impossible d’afficher la page {number}. Vous pouvez télécharger le PDF pour la consulter.</p>}
  </figure>;
};

export const PdfResume = ({ url, fileName, showDownload = true }: { url: string; fileName: string; showDownload?: boolean }) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [visibleTexts, setVisibleTexts] = useState<Record<number, string>>({});
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    setPdf(null); setError(false);
    let task: ReturnType<typeof getDocument> | undefined;
    void (async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("PDF inaccessible");
      const data = await response.arrayBuffer();
      const { PDFDocument, PDFName, PDFString, PDFHexString } = await import("pdf-lib");
      const source = await PDFDocument.load(data);
      const metadata = source.catalog.get(PDFName.of("RGResumeText"));
      const texts: Record<number, string> = {};
      if (metadata instanceof PDFString || metadata instanceof PDFHexString) {
        try {
          const pages = JSON.parse(metadata.decodeText()) as Record<string, { text: string }[]>;
          for (const [number, rows] of Object.entries(pages)) if (Array.isArray(rows)) texts[Number(number)] = rows.map((row) => row.text).join(" ");
        } catch { /* Ordinary PDFs use their extracted text instead. */ }
      }
      if (!active) return;
      setVisibleTexts(texts);
      task = getDocument({ data: new Uint8Array(data) });
      const document = await task.promise;
      if (active) setPdf(document);
    })().catch(() => { if (active) setError(true); });
    return () => { active = false; void task?.destroy(); };
  }, [url]);
  return <div className="pdf-resume pdf-resume--readonly">
    {showDownload && <a className="button-primary" href={url} download={fileName || "cv.pdf"}>Télécharger mon CV (PDF)</a>}
    {error ? <p role="alert">Impossible de charger le CV. Vous pouvez télécharger le PDF pour le consulter.</p> : pdf ? Array.from({ length: pdf.numPages }, (_, index) => <ReadOnlyPage key={index + 1} pdf={pdf} number={index + 1} visibleText={visibleTexts[index + 1]} />) : <p role="status">Chargement du CV…</p>}
  </div>;
};
