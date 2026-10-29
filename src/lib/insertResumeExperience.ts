import type { PortfolioContent } from "@/types/portfolio";
import { resumeFonts, measureResumeText, drawResumeText } from "./resumeFonts";
import { resumeFlowBands } from "./resumeFlow";
import { PDFDocument, PDFDict, PDFName, PDFObjectCopier, PDFRawStream, PDFString, PDFHexString, StandardFonts, drawObject, pushGraphicsState, popGraphicsState, decodePDFRawStream, rgb } from "pdf-lib";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { detectResumeHeading } from "./resumeSuggestions";
import { wrapResumeBlock } from "./resumeTextLayout";
import "./resumeImport";

/** Preserve the original page artwork as clipped vector slices and make room below its heading. */
export const insertResumeExperience = async (bytes: ArrayBuffer, block: string, portfolio?: PortfolioContent) => {
  const source = await PDFDocument.load(bytes);
  const preservedReference = source.catalog.get(PDFName.of("RGResumeSource"));
  const preservedSource = preservedReference ? source.context.lookup(preservedReference) : undefined;
  if (preservedSource instanceof PDFRawStream) {
    const originalBytes = decodePDFRawStream(preservedSource).decode();
    return insertResumeExperience(originalBytes.buffer.slice(originalBytes.byteOffset, originalBytes.byteOffset + originalBytes.byteLength) as ArrayBuffer, block, portfolio);
  }
  const inspectionTask = getDocument({ data: new Uint8Array(bytes.slice(0)) });
  const inspection = await inspectionTask.promise;
  try {
    for (let index = 0; index < inspection.numPages; index++) {
      const page = await inspection.getPage(index + 1);
      const extracted = await page.getTextContent();
      const items = extracted.items.flatMap((item) => "str" in item && item.str.trim() ? [{ text: item.str, width: item.width, x: item.transform[4], y: item.transform[5], height: Math.hypot(item.transform[2], item.transform[3]), font: item.fontName }] : []);
      // A previous insertion made clipped copies of the original artwork. Recover that
      // original before recalculating, so a repair does not insert the same job twice.
      const company = block.split(/\r?\n/)[2]?.trim();
      const forms = source.getPage(index).node.Resources()?.lookup(PDFName.of("XObject"));
      if (company && items.some((item) => item.text.includes(company)) && forms instanceof PDFDict) {
        const embedded = forms.entries().find(([name]) => name.toString().startsWith("/EmbeddedPdfPage-"));
        if (embedded) {
          const form = source.context.lookup(embedded[1]);
          const bounds = form instanceof PDFRawStream ? form.dict.get(PDFName.of("BBox"))?.toString() : "";
          const fullSize = source.getPage(index).getSize();
          const values = bounds?.match(/-?[\d.]+/g)?.map(Number);
          if (form instanceof PDFRawStream && values?.length === 4 && values[1] > 0 && Math.abs(values[3] - fullSize.height) < 1) {
            const recovered = await PDFDocument.create();
            for (let prior = 0; prior < index; prior++) recovered.addPage((await recovered.copyPages(source, [prior]))[0]);
            const restored = recovered.addPage([fullSize.width, fullSize.height]);
            const copied = PDFObjectCopier.for(source.context, recovered.context).copy(form);
            copied.dict.set(PDFName.of("BBox"), recovered.context.obj([0, 0, fullSize.width, fullSize.height]));
            copied.dict.set(PDFName.of("Matrix"), recovered.context.obj([1, 0, 0, 1, 0, 0]));
            const reference = recovered.context.register(copied);
            const key = restored.node.newXObject("OriginalArtwork", reference);
            restored.pushOperators(pushGraphicsState(), drawObject(key), popGraphicsState());
            for (let following = index + 1; following < inspection.numPages; following++) {
              const next = await (await inspection.getPage(following + 1)).getTextContent();
              const continuation = next.items.some((item) => "str" in item && /^Parcours professionnel - suite$/.test(item.str.trim()));
              if (!continuation) recovered.addPage((await recovered.copyPages(source, [following]))[0]);
            }
            const originalBytes = await recovered.save();
            return await insertResumeExperience(originalBytes.buffer.slice(originalBytes.byteOffset, originalBytes.byteOffset + originalBytes.byteLength) as ArrayBuffer, block, portfolio);
          }
        }
      }
      const heading = items.find((item) => detectResumeHeading(item.text) === "experience");
      if (!heading) continue;
      const original = source.getPage(index);
      if (original.getRotation().angle % 360) throw new Error("L’insertion nécessite une page sans rotation.");
      const { width, height } = original.getSize();
      const body = items.filter((item) => item.y < heading.y - 6).sort((a, b) => b.y - a.y || a.x - b.x);
      const first = body[0];
      const insertionY = first ? Math.min(heading.y - 12, first.y + first.height + 3) : heading.y - 20;
      const output = await PDFDocument.create();
      const visibleText: Record<number, { id: string; text: string; x: number; y: number; width: number; height: number; size: number }[]> = {};
      const record = (sourceLines: { text: string; x: number; y: number; height: number; width: number }[], sourceTop: number, bottom: number, destinationTop: number, scale = 1) => {
        const number = output.getPageCount();
        const list = visibleText[number] ||= [];
        for (const line of sourceLines) if (line.y >= bottom && line.y + line.height <= sourceTop + 1) {
          const baseline = destinationTop - (sourceTop - line.y) * scale;
          list.push({ id: `${number}-${list.length}`, text: line.text, x: line.x * scale / width, y: (height - baseline - line.height * scale * .8) / height, width: line.width * scale / width * 100, height: line.height * scale / height * 100, size: line.height * scale });
        }
      };
      const { regular, bold } = await resumeFonts(source, output);
      const bodyFont = regular;
      const titleFont = bold;
      const sampleBody = body.find((line) => /d[eé]veloppement|int[eé]gration|conception/i.test(line.text));
      const size = Math.max(10.5, sampleBody?.height || first?.height || 11);
      const left = first?.x ?? heading.x + 15;
      const right = Math.max(left + 100, width - Math.max(30, heading.x));
      let lineOffset = 0;
      const lines = block.split(/\r?\n/).flatMap((line, lineIndex) => {
        const font = lineIndex === 0 || lineIndex === 2 ? titleFont : bodyFont;
        const isMission = lineIndex > 2;
        const indent = isMission ? 28 : 0;
        const content = isMission ? line.replace(/^[•●]\s*/, "") : line;
        const wrapped = wrapResumeBlock(content, size, right - left - indent, (value, fontSize) => measureResumeText(font, value, fontSize)).split("\n");
        const entries = wrapped.map((text, wrappedIndex) => {
          const value = { text, font, indent, offset: lineOffset, bullet: isMission && wrappedIndex === 0 };
          lineOffset += size * 1.4;
          return value;
        });
        lineOffset += isMission ? 3 : lineIndex === 2 ? 5 : 0;
        return entries;
      });
      const blockHeight = lineOffset + 12;
      for (let before = 0; before < index; before++) output.addPage((await output.copyPages(source, [before]))[0]);
      let target = output.addPage([width, height]);
      const slice = async (top: number, bottom: number, destinationTop: number) => {
        if (top - bottom < .1) return;
        const embedded = await output.embedPage(original, { left: 0, right: width, top, bottom });
        target.drawPage(embedded, { x: 0, y: destinationTop - (top - bottom), width, height: top - bottom });
        record(items, top, bottom, destinationTop);
      };
      const drawRows = (rows: { text: string; strong?: boolean; label?: string }[], start: number, x = left) => {
        let cursor = start;
        for (const row of rows) {
          const font = row.strong ? bold : regular;
          const wrapped = wrapResumeBlock(row.text, size, right - x, (value, fontSize) => measureResumeText(font, value, fontSize)).split("\n");
          for (const [rowIndex, text] of wrapped.entries()) {
            const baseline = cursor - size;
            if (row.label && rowIndex === 0 && text.startsWith(row.label)) {
              drawResumeText(target, row.label, { x, y: baseline, size, font: bold, color: rgb(.08, .08, .08) });
              drawResumeText(target, text.slice(row.label.length), { x: x + measureResumeText(bold, row.label, size), y: baseline, size, font: regular, color: rgb(.08, .08, .08) });
            } else drawResumeText(target, text, { x, y: baseline, size, font, color: rgb(.08, .08, .08) });
            const list = visibleText[output.getPageCount()] ||= [];
            list.push({ id: `${output.getPageCount()}-${list.length}`, text, x: x / width, y: (height - baseline - size * .8) / height, width: measureResumeText(font, text, size) / width * 100, height: size / height * 100, size });
            cursor -= size * 1.4;
          }
          cursor -= 3;
        }
        return cursor;
      };
      let top = insertionY;
      const skillsHeading = portfolio && items.find((item) => detectResumeHeading(item.text) === "skills" && item.y > heading.y);
      if (portfolio && skillsHeading && portfolio.skillGroups.length) {
        const firstSkill = items.filter((item) => item.y < skillsHeading.y - 6 && item.y > heading.y + heading.height).sort((a, b) => b.y - a.y)[0];
        const skillStart = Math.max(firstSkill ? firstSkill.y + firstSkill.height + 3 : skillsHeading.y - 20, skillsHeading.y - 18);
        let cursor = skillStart;
        const profileHeading = items.find((item) => detectResumeHeading(item.text) === "profile" && item.y > skillsHeading.y);
        const profileLines = profileHeading ? items.filter((item) => item.y < profileHeading.y - 5 && item.y > skillsHeading.y + skillsHeading.height) : [];
        const profileBottom = profileLines.length ? Math.min(...profileLines.map((line) => line.y)) - 4 : 0;
        const skillsTitleTop = skillsHeading.y + skillsHeading.height + 4;
        if (profileBottom - skillsTitleTop > 12) {
          await slice(height, profileBottom, height);
          await slice(skillsTitleTop, skillStart, profileBottom - 10);
          cursor = profileBottom - 10 - (skillsTitleTop - skillStart);
        } else await slice(height, skillStart, height);
        const skillsText = items.filter((item) => item.y < skillsHeading.y && item.y > heading.y).sort((a, b) => b.y - a.y || a.x - b.x);
        const skillRows = new Map<number, { x: number; text: string }[]>();
        skillsText.forEach((item) => { const y = Math.round(item.y / 3) * 3; skillRows.set(y, [...(skillRows.get(y) || []), { x: item.x, text: item.text }]); });
        const imported = [...skillRows.values()].flatMap((parts) => parts.sort((a, b) => a.x - b.x).map((part) => part.text).join(" ").split(":").slice(1).join(":").split(",").map((value) => value.trim()).filter(Boolean));
        const normalizeSkill = (value: string) => {
          const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, "");
          return ({ expressjs: "express", sprintboot: "springboot", tailwindcss: "tailwindcss" } as Record<string, string>)[normalized] || normalized;
        };
        const known = new Set(portfolio.skillGroups.flatMap((group) => group.items).map(normalizeSkill));
        const extras = imported.filter((value) => !known.has(normalizeSkill(value)) && !/^\W+$/.test(value));
        const groups = [...portfolio.skillGroups, ...(extras.length ? [{ title: "Autres technologies et outils du CV", items: [...new Set(extras)] }] : [])];
        for (const group of groups) {
          const rows = [{ text: `${group.title} : ${group.items.join(", ")}`, label: `${group.title} :` }];
          const rowHeight = wrapResumeBlock(rows[0].text, size, right - left, (value, fontSize) => measureResumeText(regular, value, fontSize)).split("\n").length * size * 1.4 + 3;
          if (cursor - rowHeight < 35) { target = output.addPage([width, height]); cursor = height - 36; }
          cursor = drawRows(rows, cursor);
        }
        const headingTop = heading.y + heading.height + 5;
        const headingHeight = headingTop - insertionY;
        cursor -= 14;
        if (cursor - headingHeight - blockHeight < 32) { target = output.addPage([width, height]); cursor = height - 36; }
        await slice(headingTop, insertionY, cursor);
        top = cursor - headingHeight;
      } else if (blockHeight > insertionY - 32) {
        const headingTop = Math.min(height, heading.y + heading.height + 5);
        await slice(height, headingTop, height);
        target = output.addPage([width, height]);
        const headingHeight = headingTop - insertionY;
        await slice(headingTop, insertionY, height - 35);
        top = height - 35 - headingHeight;
      } else await slice(height, insertionY, height);
      if (blockHeight > top - 32) throw new Error("Cette expérience est trop longue pour une page. Raccourcissez ses missions.");
      lines.forEach((line) => {
        const y = top - size - line.offset;
        drawResumeText(target, line.text, { x: left + line.indent, y, size, font: line.font, color: rgb(.08, .08, .08) });
        if (line.bullet) target.drawCircle({ x: left + line.indent - 8, y: y + size * .3, size: 1.5, color: rgb(.08, .08, .08) });
      });
      const added = visibleText[output.getPageCount()] ||= [];
      lines.forEach((line) => added.push({ id: `${output.getPageCount()}-${added.length}`, text: line.text, x: (left + line.indent) / width, y: (height - top + size * .2 + line.offset) / height, width: measureResumeText(line.font, line.text, size) / width * 100, height: size / height * 100, size }));
      // Flow the remaining content of ALL source pages into the available space,
      // trimming blank margins instead of preserving old page boundaries.
      let destinationTop = top - blockHeight;
      let replacingEducation = false;
      for (let sourceIndex = index; sourceIndex < source.getPageCount(); sourceIndex++) {
        const sourcePage = source.getPage(sourceIndex);
        const sourceSize = sourcePage.getSize();
        const sourceText = sourceIndex === index ? items : (await (await inspection.getPage(sourceIndex + 1)).getTextContent()).items.flatMap((item) => "str" in item && item.str.trim() ? [{ text: item.str, width: item.width, x: item.transform[4], y: item.transform[5], height: Math.hypot(item.transform[2], item.transform[3]), font: item.fontName }] : []);
        const maximumTop = sourceIndex === index ? insertionY : sourceSize.height;
        const bands = resumeFlowBands(sourceText, maximumTop);
        // Image-only pages cannot safely be repaginated; preserve them whole.
        if (!bands.length) {
          if (sourceIndex !== index) output.addPage((await output.copyPages(source, [sourceIndex]))[0]);
          destinationTop = 0;
          continue;
        }
        for (let bandIndex = 0; bandIndex < bands.length; bandIndex++) {
          const band = bands[bandIndex];
          const scale = Math.min(1, width / sourceSize.width);
          if (!band.heading && replacingEducation) continue;
          if (band.heading) {
            replacingEducation = false;
            const section = sourceText.find((line) => line.y >= band.bottom && line.y + line.height <= band.top + 1);
            if (section) {
              if (portfolio && /^certifications?$/i.test(section.text.trim())) {
                const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
                const nextHeading = sourceText.filter((line) => line.y < section.y && detectResumeHeading(line.text)).sort((a, b) => b.y - a.y)[0];
                const certificateText = normalize(sourceText.filter((line) => line.y < section.y && line.y > (nextHeading?.y ?? 0)).map((line) => line.text).join(" "));
                if (portfolio.education.some((education) => certificateText.includes(normalize(education.place)) && certificateText.includes(normalize(education.title)))) {
                  replacingEducation = true;
                  continue;
                }
              }
              const titleSize = Math.max(11, Math.min(14, heading.height));
              const nextBand = bands[bandIndex + 1];
              const isReferences = /^r[eé]f[eé]rences?$/i.test(section.text.trim());
              const referenceGroups: typeof sourceText[] = [];
              if (isReferences) {
                const referenceRows = new Map<number, typeof sourceText>();
                sourceText.filter((item) => item.y < section.y - 3).forEach((item) => {
                  const baseline = Math.round(item.y / 2) * 2;
                  referenceRows.set(baseline, [...(referenceRows.get(baseline) || []), item]);
                });
                const referenceLines = [...referenceRows.values()].map((row) => {
                  row.sort((a, b) => a.x - b.x);
                  return { ...row[0], text: row.map((part) => part.text).join(" "), width: row.reduce((sum, part) => sum + part.width, 0), height: Math.max(...row.map((part) => part.height)) };
                }).sort((a, b) => b.y - a.y);
                for (const line of referenceLines) {
                  if (/coach|r[eé]f[eé]rent|responsable/i.test(line.text) || !referenceGroups.length) referenceGroups.push([line]);
                  else referenceGroups[referenceGroups.length - 1].push(line);
                }
              }
              const columnWidth = (width - 2 * heading.x - 20) / 2;
              const referenceHeights = referenceGroups.map((group) => group.reduce((sum, item, itemIndex) => sum + wrapResumeBlock(item.text, size, columnWidth, (value, fontSize) => measureResumeText(itemIndex === 0 ? bold : regular, value, fontSize)).split("\n").length * size * 1.35 + 2, 0));
              const keepWithNext = isReferences ? Math.max(0, ...referenceHeights) : nextBand ? (nextBand.top - nextBand.bottom) * scale : 25;
              if (destinationTop < height - 40) destinationTop -= 10;
              if (destinationTop - 32 < 32 + Math.min(keepWithNext, height - 100)) { target = output.addPage([width, height]); destinationTop = height - 36; }
              const baseline = destinationTop - titleSize;
              const sectionX = heading.x;
              drawResumeText(target, section.text, { x: sectionX, y: baseline, size: titleSize, font: bold, color: rgb(.34, .39, .41) });
              target.drawLine({ start: { x: sectionX, y: baseline - 6 }, end: { x: width - Math.max(30, sectionX), y: baseline - 6 }, thickness: .8, color: rgb(.88, .35, .43) });
              const list = visibleText[output.getPageCount()] ||= [];
              list.push({ id: `${output.getPageCount()}-${list.length}`, text: section.text, x: sectionX / width, y: (height - baseline - titleSize * .8) / height, width: measureResumeText(bold, section.text, titleSize) / width * 100, height: titleSize / height * 100, size: titleSize });
              destinationTop = baseline - 18;
              if (isReferences && referenceGroups.length && referenceGroups.length <= 2) {
                const initialTop = destinationTop;
                referenceGroups.forEach((group, column) => {
                  const x = heading.x + column * (columnWidth + 20);
                  let cursor = initialTop;
                  group.forEach((item, itemIndex) => {
                    const font = itemIndex === 0 ? bold : regular;
                    const wrapped = wrapResumeBlock(item.text, size, columnWidth, (value, fontSize) => measureResumeText(font, value, fontSize)).split("\n");
                    wrapped.forEach((text) => {
                      const baseline = cursor - size;
                      drawResumeText(target, text, { x, y: baseline, size, font, color: rgb(.08, .08, .08) });
                      const list = visibleText[output.getPageCount()] ||= [];
                      list.push({ id: `${output.getPageCount()}-${list.length}`, text, x: x / width, y: (height - baseline - size * .8) / height, width: measureResumeText(font, text, size) / width * 100, height: size / height * 100, size });
                      cursor -= size * 1.35;
                    });
                    cursor -= 2;
                  });
                });
                destinationTop -= Math.max(...referenceHeights);
                replacingEducation = true;
              }
              if (portfolio && detectResumeHeading(section.text) === "education") {
                for (const education of portfolio.education) {
                  const rows = [{ text: education.title, strong: true }, { text: `${education.place} · ${education.period}` }];
                  const entryHeight = rows.reduce((total, row) => total + wrapResumeBlock(row.text, size, right - left, (value, fontSize) => measureResumeText(row.strong ? bold : regular, value, fontSize)).split("\n").length * size * 1.4 + 3, 8);
                  if (destinationTop - entryHeight < 32) { target = output.addPage([width, height]); destinationTop = height - 36; }
                  destinationTop = drawRows(rows, destinationTop) - 6;
                }
                replacingEducation = true;
              }
              continue;
            }
          }
          let bandTop = band.top;
          const bandHeight = (band.top - band.bottom) * scale;
          const nextHeight = band.heading && bands[bandIndex + 1] ? (bands[bandIndex + 1].top - bands[bandIndex + 1].bottom) * scale + 8 : 0;
          if (bandHeight + nextHeight > destinationTop - 32 && bandHeight + nextHeight <= height - 68) {
            target = output.addPage([width, height]); destinationTop = height - 36;
          }
          while (bandTop > band.bottom + .1) {
            const available = destinationTop - 32;
            if (available < 24) { target = output.addPage([width, height]); destinationTop = height - 36; continue; }
            let bottom = Math.max(band.bottom, bandTop - available / scale);
            if (bottom > band.bottom) {
              // An unusually long entry may span pages, but never split a text line.
              for (const line of sourceText) if (line.y - 4 < bottom && line.y + line.height + 3 > bottom) bottom = Math.max(bottom, line.y + line.height + 3);
              if (bandTop - bottom < 15) { target = output.addPage([width, height]); destinationTop = height - 36; continue; }
            }
            const embedded = await output.embedPage(sourcePage, { left: 0, right: sourceSize.width, top: bandTop, bottom });
            const drawnHeight = (bandTop - bottom) * scale;
            target.drawPage(embedded, { x: 0, y: destinationTop - drawnHeight, width: sourceSize.width * scale, height: drawnHeight });
            record(sourceText, bandTop, bottom, destinationTop, scale);
            destinationTop -= drawnHeight;
            bandTop = bottom;
            if (bandTop > band.bottom + .1) { target = output.addPage([width, height]); destinationTop = height - 36; }
          }
          destinationTop -= band.heading ? 5 : 6;
        }
      }
      // Retain an exact source for reversible future repagination, without duplicating inserted content.
      output.catalog.set(PDFName.of("RGResumeText"), PDFHexString.fromText(JSON.stringify(visibleText)));
      output.catalog.set(PDFName.of("RGResumeSource"), output.context.register(output.context.flateStream(new Uint8Array(bytes))));
      return { bytes: await output.save(), page: index + 1 };
    }
    throw new Error("Titre du parcours professionnel introuvable. Renommez-le « Parcours professionnel » ou « Expériences » avant l’insertion.");
  } finally { await inspectionTask.destroy(); }
};
