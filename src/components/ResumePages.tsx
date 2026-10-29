import { useEffect, useRef, useState } from "react";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import "@/lib/resumeImport";
export const ResumePages = ({ url, activePage, onSelect }: { url: string; activePage: number; onSelect: (page: number) => void }) => {
  const activeRef = useRef(activePage);
  activeRef.current = activePage;
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  useEffect(() => {
    let disposed = false;
    const task = getDocument({ url });
    const renders: { cancel: () => void }[] = [];
    setError(""); setCount(0);
    if (container.current) container.current.replaceChildren();
    task.promise.then(async (pdf) => {
      setCount(pdf.numPages);
      for (let number = 1; number <= pdf.numPages && !disposed; number++) {
        const page = await pdf.getPage(number);
        if (disposed || !container.current) return;
        const button = document.createElement("button");
        button.type = "button"; button.className = "cv-page-thumbnail";
        button.dataset.page = String(number); button.setAttribute("aria-current", String(activeRef.current === number)); button.setAttribute("aria-label", `Modifier la page ${number}`);
        button.onclick = () => onSelect(number);
        const canvas = document.createElement("canvas");
        const viewport = page.getViewport({ scale: .5 });
        canvas.width = viewport.width; canvas.height = viewport.height;
        const label = document.createElement("span"); label.textContent = `Page ${number}`;
        button.append(canvas, label); container.current.append(button);
        const render = page.render({ canvas, viewport }); renders.push(render); await render.promise;
      }
    }).catch(() => { if (!disposed) setError("Impossible d’afficher toutes les pages."); });
    return () => { disposed = true; renders.forEach((render) => render.cancel()); void task.destroy(); };
  }, [url, onSelect]);
  useEffect(() => { container.current?.querySelectorAll<HTMLButtonElement>("button").forEach((button) => button.setAttribute("aria-current", String(Number(button.dataset.page) === activePage))); }, [activePage, count]);
  return <section className="cv-all-pages"><h4>Tout mon CV · {count || "…"} pages</h4><p>Chaque page est visible ci-dessous. Cliquez sur celle à modifier.</p>{error && <p role="alert">{error}</p>}<div ref={container} className="cv-all-pages__grid" /></section>;
};
