import { updateResumeFromPortfolio } from "@/lib/updateResumeFromPortfolio";
import { saveResumeDraft } from "@/lib/resumeDraftStorage";
import { formatPortfolioExperience } from "@/lib/resumeExperienceContent";
import { insertResumeExperience } from "@/lib/insertResumeExperience";
import { ResumePages } from "./ResumePages";
import { ResumeSuggestions } from "./ResumeSuggestions";
import { detectResumeHeading, type ResumeRubric } from "@/lib/resumeSuggestions";
import { fitResumeText, wrapResumeBlock } from "@/lib/resumeTextLayout";
import { useCallback, useEffect, useRef, useState } from "react";
import { PDFDocument, PDFName, PDFString, PDFHexString, StandardFonts, rgb } from "pdf-lib";
import { getDocument, Util } from "pdfjs-dist/legacy/build/pdf.mjs";
import "@/lib/resumeImport";
import { toast } from "sonner";
import { uploadResume } from "@/lib/portfolioRepository";
import type { PortfolioContent } from "@/types/portfolio";

type TextRegion = { id: string; text: string; x: number; y: number; width: number; height: number; size: number };
type Correction = { id?: string; page: number; x: number; y: number; text: string; size: number; color: string; background: string; width: number; height: number; cover: boolean; textWidth?: number };
const color = (hex: string) => rgb(...([1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255) as [number, number, number]));
export const ResumePdfEditor = ({ resume, content, onSave }: { content: PortfolioContent; resume: PortfolioContent["resume"]; onSave: (resume: PortfolioContent["resume"]) => void }) => {
  const choosePage = useCallback((next: number) => { setPage(next); canvas.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, []);
  const [rubric, setRubric] = useState<ResumeRubric>("experience");
  const canvas = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [storedRegions, setStoredRegions] = useState<Record<number, TextRegion[]> | null>(null);
  const [regions, setRegions] = useState<TextRegion[]>([]);
  const [selected, setSelected] = useState<TextRegion | null>(null);
  const [mode, setMode] = useState<"edit" | "add">("edit");
  const [extraPages, setExtraPages] = useState(0);
  const [pageHeight, setPageHeight] = useState(842);
  const [blockPrepared, setBlockPrepared] = useState(false);
  const [pageWidth, setPageWidth] = useState(595);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [changes, setChanges] = useState<Correction[]>([]);
  const [text, setText] = useState("");
  const [size, setSize] = useState(11);
  const [ink, setInk] = useState("#222222");
  const [background, setBackground] = useState("#ffffff");
  const [cover, setCover] = useState(false);
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(5);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let disposed = false;
    setReady(false); setCount(0); setRegions([]); setSelected(null);
    const task = getDocument({ url: resume.url });
    let render: { cancel: () => void; promise: Promise<void> } | undefined;
    task.promise.then(async (pdf) => {
      if (disposed) return;
      setCount(pdf.numPages + extraPages);
      if (page > pdf.numPages) {
        if (!canvas.current) return;
        setPageWidth(595.28); setPageHeight(841.89);
        canvas.current.width = 595.28 * 1.3; canvas.current.height = 841.89 * 1.3;
        const context = canvas.current.getContext("2d");
        if (context) { context.fillStyle = "white"; context.fillRect(0, 0, canvas.current.width, canvas.current.height); }
        setReady(true); return;
      }
      const current = await pdf.getPage(Math.min(page, pdf.numPages));
      if (disposed || !canvas.current) return;
      const viewport = current.getViewport({ scale: 1.3 });
      setPageWidth(current.getViewport({ scale: 1 }).width); setPageHeight(current.getViewport({ scale: 1 }).height);
      const extracted = await current.getTextContent();
      if (disposed) return;
      setRegions(extracted.items.flatMap((item, index) => {
        if (!("str" in item) || !item.str.trim()) return [];
        const matrix = Util.transform(viewport.transform, item.transform);
        const fontHeight = Math.hypot(matrix[2], matrix[3]);
        const ascent = extracted.styles[item.fontName]?.ascent ?? .8;
        return [{ id: `${page}-${index}`, text: item.str, x: matrix[4] / viewport.width, y: (matrix[5] - fontHeight * ascent) / viewport.height, width: Math.max(item.width * viewport.scale / viewport.width * 100, 1), height: fontHeight / viewport.height * 100, size: fontHeight / viewport.scale }];
      }));
      canvas.current.width = viewport.width; canvas.current.height = viewport.height;
      render = current.render({ canvas: canvas.current, viewport });
      await render.promise;
      if (!disposed) setReady(true);
    }).catch((error) => { if (!disposed) toast.error(`Lecture du PDF impossible : ${error.message}`); });
    return () => { disposed = true; render?.cancel(); void task.destroy(); };
  }, [resume.url, page, extraPages]);
  useEffect(() => {
    let active = true;
    setStoredRegions(null);
    fetch(resume.url).then((response) => response.arrayBuffer()).then((data) => PDFDocument.load(data)).then((pdf) => {
      const entry = pdf.catalog.get(PDFName.of("RGResumeText"));
      if (active && (entry instanceof PDFString || entry instanceof PDFHexString)) setStoredRegions(JSON.parse(entry.decodeText()));
    }).catch(() => { /* Ordinary imported PDFs use PDF.js text detection. */ });
    return () => { active = false; };
  }, [resume.url]);
  const visibleRegions = storedRegions?.[page] ?? regions;
  const selectRegion = (region: TextRegion, editHeading = false) => {
    if (busy) return;
    const clickedHeading = detectResumeHeading(region.text);
    const heading = visibleRegions.filter((item) => item.y <= region.y && detectResumeHeading(item.text)).sort((a, b) => b.y - a.y)[0];
    const detected = clickedHeading || (heading ? detectResumeHeading(heading.text) : null);
    if (detected) setRubric(detected);
    if (clickedHeading && !editHeading) {
      setSelected(null); setText(""); setMode("edit");
      toast.info("Rubrique ouverte. Choisissez maintenant le poste, la date, l’entreprise ou la mission à modifier.");
      return;
    }
    const change = changes.find((item) => item.id === region.id);
    setSelected(region); setText(change?.text ?? region.text);
    setSize(change?.size ?? Math.round(region.size * 10) / 10);
    setWidth(change?.width ?? region.width + .5); setHeight(change?.height ?? region.height + .3);
    setCover(true); setMode("edit");
    if (change) { setInk(change.color); setBackground(change.background); }
    else {
      // Sample the background just above the selected text, avoiding its glyphs.
      const context = canvas.current?.getContext("2d");
      if (context && canvas.current) {
        const x = Math.max(0, Math.min(canvas.current.width - 1, Math.floor(region.x * canvas.current.width)));
        const y = Math.max(0, Math.min(canvas.current.height - 1, Math.floor(region.y * canvas.current.height) - 2));
        const pixel = context.getImageData(x, y, 1, 1).data;
        setBackground(`#${Array.from(pixel).slice(0, 3).map((value) => value.toString(16).padStart(2, "0")).join("")}`);
      }
    }
    inputRef.current?.focus({ preventScroll: true });
  };
  const rubricHeading = visibleRegions.find((region) => detectResumeHeading(region.text) === rubric);
  const sectionRegions = visibleRegions.filter((region) => {
    if (detectResumeHeading(region.text)) return false;
    const heading = visibleRegions.filter((item) => item.y <= region.y && detectResumeHeading(item.text)).sort((a, b) => b.y - a.y)[0];
    return heading ? detectResumeHeading(heading.text) === rubric : false;
  }).sort((a, b) => a.y - b.y || a.x - b.x);
  const applySelection = async () => {
    if (!selected) return;
    const rightNeighbor = visibleRegions.filter((region) => region.id !== selected.id && region.x > selected.x && Math.abs(region.y - selected.y) < Math.min(region.height, selected.height) / 100 * .6).sort((a, b) => a.x - b.x)[0];
    const textWidth = Math.max(selected.width, ((rightNeighbor?.x ?? .97) - selected.x) * 100 - .5);
    try {
      const metrics = await PDFDocument.create();
      const font = await metrics.embedFont(StandardFonts.Helvetica);
      const fittedSize = fitResumeText(text, size, textWidth / 100 * pageWidth, (line, fontSize) => font.widthOfTextAtSize(line, fontSize));
      const correction: Correction = { textWidth, id: selected.id, page, x: selected.x, y: selected.y, text, size: fittedSize, color: ink, background, width, height, cover: true };
    setChanges((items) => [...items.filter((item) => item.id !== selected.id), correction]);
    setSelected(null); setText("");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Ce texte ne peut pas être appliqué."); }
  };
  const placeAddition = async (x: number, y: number, targetPage = page, targetWidth = pageWidth, targetHeight = pageHeight) => {
    try {
      const metrics = await PDFDocument.create();
      const font = await metrics.embedFont(StandardFonts.Helvetica);
      const available = Math.min(width / 100 * targetWidth, targetWidth * (.96 - x));
      if (available < 40) return toast.error("Choisissez un emplacement plus à gauche.");
      const laidOut = wrapResumeBlock(text, size, available, (line, fontSize) => font.widthOfTextAtSize(line, fontSize));
      const blockHeight = laidOut.split("\n").length * size * 1.2;
      if (y * targetHeight + blockHeight > targetHeight * .96) return toast.error("Le bloc ne tient pas ici. Placez-le plus haut ou ajoutez-le sur une nouvelle page.");
      const bottom = y + blockHeight / targetHeight;
      if (targetPage === page && visibleRegions.some((region) => region.y < bottom && region.y + region.height / 100 > y && region.x < x + available / targetWidth && region.x + region.width / 100 > x)) return toast.error("Ce bloc recouvrirait du texte existant. Choisissez un espace libre ou une nouvelle page.");
      if (changes.some((item) => item.page === targetPage && item.y < bottom && item.y + Math.max(item.height / 100, item.text.split("\n").length * item.size * 1.2 / targetHeight) > y && item.x < x + available / targetWidth && item.x + (item.textWidth ?? item.width) / 100 > x)) return toast.error("Un ajout est déjà placé ici. Choisissez un autre emplacement.");
      setChanges((items) => [...items, { page: targetPage, x, y, text: laidOut, size, color: ink, background, width: available / targetWidth * 100, height: blockHeight / targetHeight * 100, cover: false }]);
      setText(""); setBlockPrepared(false);
      return true;
    } catch (error) { toast.error(error instanceof Error ? error.message : "Ajout impossible."); }
  };
  const removeCurrentPage = async () => {
    if (changes.length || extraPages) return toast.error("Enregistrez ou annulez d’abord les ajouts en attente.");
    setBusy(true);
    try {
      const response = await fetch(resume.url);
      if (!response.ok) throw new Error("PDF inaccessible.");
      const pdf = await PDFDocument.load(await response.arrayBuffer());
      if (pdf.getPageCount() <= 1) throw new Error("Le CV doit conserver au moins une page.");
      pdf.removePage(page - 1);
      const bytes = await pdf.save();
      const file = new File([new Uint8Array(bytes)], resume.fileName || "cv.pdf", { type: "application/pdf" });
      const url = await uploadResume(file);
      const nextResume: PortfolioContent["resume"] = { ...resume, url, updatedAt: new Date().toISOString() };
      await saveResumeDraft(nextResume);
      onSave(nextResume);
      toast.success("Page retirée du brouillon. Le CV public reste inchangé jusqu’à publication.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Suppression impossible."); }
    finally { setBusy(false); }
  };
  const insertAtExperienceStart = async (insertionText = text) => {
    if (changes.length || extraPages) return toast.error("Enregistrez ou annulez d’abord les retouches placées, puis insérez l’expérience.");
    setBusy(true);
    try {
      const response = await fetch(resume.url);
      if (!response.ok) throw new Error("PDF inaccessible.");
      const result = await insertResumeExperience(await response.arrayBuffer(), insertionText, content);
      const file = new File([new Uint8Array(result.bytes)], resume.fileName || "cv.pdf", { type: "application/pdf" });
      const url = await uploadResume(file);
      const nextResume: PortfolioContent["resume"] = { ...resume, url, updatedAt: new Date().toISOString(), mode: "imported" };
      await saveResumeDraft(nextResume);
      onSave(nextResume);
      toast.success("Expérience insérée en tête du parcours. Vérifiez toutes les pages avant de publier.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Insertion impossible."); }
    finally { setBusy(false); }
  };
  const syncPortfolio = async () => {
    if (changes.length || extraPages) return toast.error("Enregistrez les retouches en attente avant la mise à jour.");
    setBusy(true);
    try {
      const response = await fetch(resume.url);
      if (!response.ok) throw new Error("PDF inaccessible.");
      const bytes = await updateResumeFromPortfolio(await response.arrayBuffer(), content);
      const url = await uploadResume(new File([new Uint8Array(bytes)], "CV_Ramatoulaye_Gueye.pdf", { type: "application/pdf" }));
      const nextResume: PortfolioContent["resume"] = { url, fileName: "CV_Ramatoulaye_Gueye.pdf", mode: "imported", updatedAt: new Date().toISOString() };
      await saveResumeDraft(nextResume);
      onSave(nextResume);
      toast.success("CV actualisé depuis le portfolio et sauvegardé. Vérifiez les pages avant de publier.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Mise à jour impossible."); }
    finally { setBusy(false); }
  };
  const addOnNewPage = async () => {
    const nextPage = count + 1;
    if (await placeAddition(.08, .08, nextPage, 595.28, 841.89)) { setExtraPages((value) => value + 1); setPage(nextPage); }
  };
  const save = async () => {
    setBusy(true);
    try {
      const response = await fetch(resume.url); if (!response.ok) throw new Error("PDF inaccessible.");
      const pdf = await PDFDocument.load(await response.arrayBuffer());
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      for (let i = 0; i < extraPages; i++) pdf.addPage([595.28, 841.89]);
      for (const change of changes) {
        const target = pdf.getPage(change.page - 1);
        if (target.getRotation().angle % 360 !== 0) throw new Error("Cette page est tournée. Réimportez une version avec des pages orientées normalement pour la retoucher.");
        const { width: w, height: h } = target.getSize();
        const x = change.x * w; const top = h - change.y * h;
        if (change.cover) target.drawRectangle({ x, y: top - change.height / 100 * h, width: change.width / 100 * w, height: change.height / 100 * h, color: color(change.background) });
        const availableWidth = Math.min((change.textWidth ?? change.width) / 100 * w, w - x);
        const fittedSize = fitResumeText(change.text, change.size, availableWidth, (line, fontSize) => font.widthOfTextAtSize(line, fontSize));
        target.drawText(change.text, { x, y: top - fittedSize, size: fittedSize, font, color: color(change.color), lineHeight: fittedSize * 1.2 });
      }
      const bytes = await pdf.save();
      const file = new File([new Uint8Array(bytes)], resume.fileName || "cv.pdf", { type: "application/pdf" });
      const url = await uploadResume(file);
      const nextResume: PortfolioContent["resume"] = { ...resume, url, mode: "imported", updatedAt: new Date().toISOString() };
      await saveResumeDraft(nextResume);
      onSave(nextResume);
      setChanges([]); toast.success("Retouches appliquées au brouillon. Vérifiez le PDF puis publiez.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Retouche impossible."); }
    finally { setBusy(false); }
  };
  return <section className="pdf-editor"><div className="pdf-editor__intro"><h3>Modifier ce PDF</h3><p>Cliquez sur un texte du CV pour le sélectionner. Modifiez-le dans le panneau, puis cliquez sur « Appliquer ce texte ».</p></div>
    <div className="pdf-editor__workspace"><aside className="pdf-editor__tools">
    <div className="pdf-editor__mode"><button type="button" aria-pressed={mode === "edit"} onClick={() => { setMode("edit"); setSelected(null); setText(""); }}>Modifier un texte</button><button type="button" aria-pressed={mode === "add"} onClick={() => { setMode("add"); setSelected(null); setText(""); setCover(false); }}>Ajouter un texte</button></div>
    <div className="pdf-editor__selection">{rubricHeading && <button type="button" className="pdf-editor__rename-heading" onClick={() => selectRegion(rubricHeading, true)}>Renommer le titre « {rubricHeading.text} »</button>}<label>Texte à modifier dans cette rubrique<select value={selected?.id ?? ""} onChange={(event) => { const region = visibleRegions.find((item) => item.id === event.target.value); if (region) selectRegion(region); }}><option value="">Choisir un poste, une date, une mission…</option>{sectionRegions.map((region) => <option key={region.id} value={region.id}>{region.text}</option>)}</select></label>{!sectionRegions.length && <p>Aucun texte repéré dans cette rubrique sur la page {page}. Changez de page ou cliquez directement sur le texte du CV.</p>}<p>{selected ? `Vous modifiez : « ${selected.text} »` : "Cliquer sur un titre ouvre ses suggestions. Pour modifier une expérience, sélectionnez son texte dans le CV ou dans la liste ci-dessus."}</p></div>
    <div className="pdf-editor__fields"><label>Page<select value={page} onChange={(event) => setPage(Number(event.target.value))}>{Array.from({ length: count }, (_, i) => <option key={i} value={i + 1}>Page {i + 1} / {count}</option>)}</select></label><label>{selected ? "Texte sélectionné" : mode === "edit" ? "Sélectionnez un texte sur le CV" : "Nouveau texte"}<textarea ref={inputRef} disabled={mode === "edit" && !selected} placeholder="Ex. : Développeuse full-stack" value={text} onChange={(event) => setText(event.target.value)} /></label><label>Taille (pt)<input type="number" min={6} max={48} value={size} onChange={(event) => setSize(Math.max(6, Math.min(48, Number(event.target.value))))} /></label><label>Couleur du texte<input type="color" value={ink} onChange={(event) => setInk(event.target.value)} /></label><label>Largeur à recouvrir (%)<input type="number" min={5} max={100} value={width} onChange={(event) => setWidth(Math.max(5, Math.min(100, Number(event.target.value))))} /></label><label><input type="checkbox" checked={cover} onChange={(event) => setCover(event.target.checked)} /> Recouvrir le contenu existant</label>{cover && <><label>Couleur du fond<input type="color" value={background} onChange={(event) => setBackground(event.target.value)} /></label><label>Hauteur de la zone (%)<input type="number" min={1} max={100} value={height} onChange={(event) => setHeight(Math.max(1, Math.min(100, Number(event.target.value))))} /></label></>}</div>
    {mode === "add" && text.trim() && <div className="pdf-editor__block-ready"><strong>{blockPrepared ? "Expérience complète prête à ajouter" : "Nouveau contenu prêt à ajouter"}</strong><p>Relisez le bloc ci-dessus. L’insertion le place avant les expériences existantes et décale la suite du parcours.</p>{blockPrepared && <button type="button" disabled={busy} onClick={() => void insertAtExperienceStart()}>{busy ? "Insertion…" : "Insérer en tête du parcours professionnel"}</button>}<details><summary>Autre emplacement</summary><p>Cliquez dans un espace libre ou ajoutez une page séparée.</p><button type="button" disabled={busy || !ready} onClick={addOnNewPage}>Ajouter sur une page séparée</button></details></div>}
    {selected && <button className="pdf-editor__apply" type="button" onClick={applySelection}>Appliquer ce texte</button>}
    <ResumeSuggestions onBlock={(block) => { setText(block); setMode("add"); setSelected(null); setCover(false); setSize(11); setWidth(84); setBlockPrepared(true); toast.success("Expérience préparée. Cliquez sur « Insérer en tête du parcours professionnel »."); }} content={content} rubric={rubric} onRubric={(next) => { setRubric(next); setSelected(null); setText(""); }} selected={Boolean(selected && !detectResumeHeading(selected.text))} onUse={(suggestion, replace) => {
      setText(suggestion);
      if (!replace) { setMode("add"); setSelected(null); setCover(false); setSize(11); setWidth(70); }
      inputRef.current?.focus({ preventScroll: true });
      toast.success(replace ? "Proposition chargée : adaptez-la puis appliquez le texte." : "Ajout préparé : adaptez le texte puis cliquez dans un espace libre du CV.");
    }} />
    <p className="pdf-editor__hint">{mode === "edit" ? "Les textes modifiables se surlignent au survol. Cliquez dessus pour les sélectionner." : "Saisissez votre texte, puis cliquez dans un espace libre du CV pour le placer."}</p>
    {ready && !visibleRegions.length && <p role="status">Cette page ne contient aucun texte sélectionnable. Elle semble être une image : vous pouvez ajouter du texte, mais sa modification nécessite une reconnaissance de texte.</p>}<details className="pdf-editor__limits"><summary>Comment fonctionne une correction ?</summary><p>Activez « Recouvrir le contenu existant » pour masquer visuellement une zone. Le texte d’origine reste dans le fichier. Les ajouts utilisent Helvetica. Le déplacement des colonnes nécessite le document source.</p></details><div className="pdf-editor__actions">{(changes.length > 0 || extraPages > 0) && <button type="button" disabled={busy} onClick={() => { setChanges([]); setExtraPages(0); setPage(1); setSelected(null); setText(""); }}>Annuler tous les ajouts en attente</button>}<button type="button" disabled={!changes.length || busy} onClick={() => setChanges((items) => items.slice(0, -1))}>Annuler le dernier placement</button><button type="button" disabled={!changes.length || busy || Boolean(selected) || Boolean(text.trim() && mode === "add")} onClick={save}>{busy ? "Enregistrement…" : `3. Enregistrer les retouches (${changes.length})`}</button><p aria-live="polite">{changes.length ? "Retouches en attente : enregistrez-les avant de télécharger ou publier." : "Le document affiché est votre PDF actif."}</p></div></aside><div className="pdf-editor__paper"><div className="cv-sync-portfolio"><strong>Mettre le contenu à jour</strong><p>Le profil, les expériences, les projets et les formations sont reconstruits depuis le portfolio, en conservant la photo, les polices et les niveaux de langues du PDF d’origine. Une copie précédente reste sauvegardée sur cet appareil.</p><button type="button" disabled={busy || !!changes.length || !!extraPages} onClick={() => void syncPortfolio()}>{busy ? "Mise à jour…" : "Actualiser le CV depuis le portfolio"}</button></div><details className="cv-repair-layout"><summary>Corriger une insertion déjà enregistrée</summary><p>Le contenu des pages suivantes remonte dans les espaces libres. Les grandes marges vides sont supprimées et les expériences restent regroupées.</p>{content.experiences.map((experience, index) => <button type="button" key={index} disabled={busy} onClick={() => void insertAtExperienceStart(formatPortfolioExperience(experience))}>Harmoniser le CV avec {experience.place}</button>)}</details><ResumePages url={resume.url} activePage={page} onSelect={choosePage} />{extraPages > 0 && <p>Les {extraPages} pages ajoutées seront incluses dans cette vue après enregistrement.</p>}<nav className="cv-page-navigation" aria-label="Pages du CV"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>← Précédente</button><strong>Page {page} / {count}</strong><button type="button" disabled={page >= count} onClick={() => setPage((value) => value + 1)}>Suivante →</button></nav><details className="cv-manage-page"><summary>Gérer la page {page}</summary><p>Pour retirer l’ancienne page DMM isolée, sélectionnez-la ci-dessus puis utilisez ce bouton.</p><button type="button" disabled={busy || count <= 1} onClick={removeCurrentPage}>Retirer la page {page} du brouillon</button></details><div className="pdf-editor__paper-label">{resume.fileName} · Page {page} sur {count || "…"}</div><div className="pdf-editor__canvas" onClick={(event) => { if (mode !== "add" || !ready || !text.trim() || busy) return; const rect = event.currentTarget.getBoundingClientRect(); void placeAddition((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height); }}><canvas ref={canvas} />{mode === "edit" && visibleRegions.map((region) => <button type="button" key={region.id} className={`pdf-text-region ${selected?.id === region.id ? "is-selected" : ""}`} aria-label={`Modifier : ${region.text}`} title={detectResumeHeading(region.text) ? `Ouvrir la rubrique : ${region.text}` : `Modifier : ${region.text}`} style={{ left: `${region.x * 100}%`, top: `${region.y * 100}%`, width: `${region.width}%`, height: `${region.height}%` }} onClick={(event) => { event.stopPropagation(); selectRegion(region); }} />)}{changes.filter((change) => change.page === page).map((change, i) => <span key={i} style={{ left: `${change.x * 100}%`, top: `${change.y * 100}%`, width: `${change.width}%`, whiteSpace: "pre", height: change.cover ? `${change.height}%` : undefined, color: change.color, background: change.cover ? change.background : undefined, fontSize: `${change.size / pageWidth * 100}cqw` }}>{change.text}</span>)}</div>
    </div></div>
  </section>;
};
