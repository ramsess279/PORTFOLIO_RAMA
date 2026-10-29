import { PDFDocument, PDFHexString, PDFName, PDFRawStream, decodePDFRawStream, rgb } from "pdf-lib";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { resumeFonts, drawResumeText, measureResumeText } from "./resumeFonts";
import { wrapResumeBlock } from "./resumeTextLayout";
import { detectResumeHeading } from "./resumeSuggestions";
import { formatPortfolioExperience } from "./resumeExperienceContent";
import type { PortfolioContent } from "@/types/portfolio";
import "./resumeImport";

/** Explicitly rebuild the body from portfolio facts, retaining the imported artwork,
 * embedded fonts, section style, original contact details and historical projects. */
export async function updateResumeFromPortfolio(bytes: ArrayBuffer, content: PortfolioContent) {
  let source = await PDFDocument.load(bytes);
  const preserved = source.catalog.get(PDFName.of("RGResumeSource"));
  const stream = preserved && source.context.lookup(preserved);
  if (stream instanceof PDFRawStream) {
    bytes = new Uint8Array(decodePDFRawStream(stream).decode()).buffer;
    source = await PDFDocument.load(bytes);
  }
  const task = getDocument({ data: new Uint8Array(bytes.slice(0)) });
  const inspection = await task.promise;
  try {
    const pages = await Promise.all(Array.from({ length: inspection.numPages }, async (_, i) => {
      const page = await inspection.getPage(i + 1);
      return (await page.getTextContent()).items.flatMap((item) => "str" in item && item.str.trim() ? [{ text: item.str, x: item.transform[4], y: item.transform[5], width: item.width, height: Math.hypot(item.transform[2], item.transform[3]) }] : []);
    }));
    const original = pages[0];
    const profile = original.find((line) => detectResumeHeading(line.text) === "profile");
    const skills = original.find((line) => detectResumeHeading(line.text) === "skills");
    const experience = original.find((line) => detectResumeHeading(line.text) === "experience");
    if (!profile || !skills || !experience) throw new Error("Les rubriques du PDF importé ne sont pas reconnues. Le document a été conservé.");
    const output = await PDFDocument.create();
    const { regular, bold } = await resumeFonts(source, output);
    const { width, height } = source.getPage(0).getSize();
    const size = 11.5;
    const margin = profile.x;
    const left = margin + 35;
    const right = width - Math.max(30, margin);
    const regions: Record<number, { id: string; text: string; x: number; y: number; width: number; height: number; size: number }[]> = {};
    let page = output.addPage([width, height]);
    let cursor = height - 32;
    let activeSection = "";
    const write = (text: string, x: number, y: number, strong = false, fontSize = size, gray = false) => {
      const font = strong ? bold : regular;
      drawResumeText(page, text, { x, y, size: fontSize, font, color: gray ? rgb(.34, .39, .41) : rgb(.08, .08, .08) });
      const number = output.getPageCount();
      const list = regions[number] ||= [];
      list.push({ id: `${number}-${list.length}`, text, x: x / width, y: (height - y - fontSize * .8) / height, width: measureResumeText(font, text, fontSize) / width * 100, height: fontSize / height * 100, size: fontSize });
    };
    const wrapped = (text: string, strong = false, x = left, fontSize = size, end = right) => wrapResumeBlock(text, fontSize, end - x, (line, pt) => measureResumeText(strong ? bold : regular, line, pt)).split("\n");
    const title = (text: string) => {
      write(text, margin, cursor - 13, true, 13, true);
      page.drawLine({ start: { x: margin, y: cursor - 19 }, end: { x: right, y: cursor - 19 }, thickness: .8, color: rgb(.88, .35, .43) });
      cursor -= 32;
    };
    const newPage = () => {
      page = output.addPage([width, height]); cursor = height - 30;
      if (activeSection) title(`${activeSection} (suite)`);
    };
    const ensure = (needed: number) => { if (cursor - Math.min(needed, height - 110) < 35) newPage(); };
    const section = (text: string, needed = 60) => {
      activeSection = "";
      cursor -= 13;
      ensure(32 + needed);
      activeSection = text;
      title(text);
    };
    const paragraph = (text: string, strong = false, bullet = false, x = left) => {
      const indent = bullet ? 17 : 0;
      const lines = wrapped(text, strong, x + indent);
      ensure(lines.length * size * 1.4 + 3);
      for (const [index, line] of lines.entries()) {
        if (cursor - size * 1.4 < 35) newPage();
        write(line, x + indent, cursor - size, strong);
        if (bullet && index === 0) page.drawCircle({ x: x + 9, y: cursor - size * .7, size: 1.2, color: rgb(.08, .08, .08) });
        cursor -= size * 1.4;
      }
      cursor -= 3;
    };

    // Keep the imported portrait and header artwork. Replace only its text column.
    const headerBottom = profile.y + profile.height + 8;
    const header = await output.embedPage(source.getPage(0), { left: 0, right: width, bottom: headerBottom, top: height });
    page.drawPage(header, { x: 0, y: headerBottom, width, height: height - headerBottom });
    const headerX = left;
    const columnRight = width * .66;
    page.drawRectangle({ x: 0, y: headerBottom, width: columnRight, height: height - headerBottom, color: rgb(1, 1, 1) });
    page.drawRectangle({ x: 0, y: height - 7, width, height: 7, color: rgb(.82, .25, .30) });
    cursor = height - 34;
    const nameParts = content.identity.name.toUpperCase().split(/\s+/);
    const surname = nameParts.pop() || "";
    const givenName = nameParts.join(" ") + " ";
    drawResumeText(page, givenName, { x: headerX, y: cursor - 22, size: 22, font: bold, color: rgb(.82, .25, .30) });
    write(surname, headerX + measureResumeText(bold, givenName, 22), cursor - 22, true, 22, true);
    const nameList = regions[1] ||= [];
    nameList.push({ id: `1-name`, text: givenName.trim(), x: headerX / width, y: (34 + 22 - 22 * .8) / height, width: measureResumeText(bold, givenName, 22) / width * 100, height: 22 / height * 100, size: 22 });
    cursor -= 39;
    for (const line of wrapped("DÉVELOPPEUSE FULLSTACK WEB ET MOBILE", true, headerX, 13, columnRight - 8)) { write(line, headerX, cursor - 13, true, 13); cursor -= 19; }
    page.drawLine({ start: { x: headerX, y: cursor - 3 }, end: { x: headerX + 42, y: cursor - 3 }, thickness: 1.5, color: rgb(.82, .25, .30) });
    cursor -= 13;
    const phone = content.cv.phone || original.find((line) => /\+221/.test(line.text))?.text;
    const website = content.cv.website || original.find((line) => /https?:\/\/portfolio/i.test(line.text))?.text;
    const contacts = [
      ["Localisation", content.identity.location], ["Téléphone", phone], ["E-mail", content.identity.email],
      ["LinkedIn", content.identity.linkedinUrl], ["GitHub", content.identity.githubUrl], ["Portfolio", website],
    ];
    for (const [label, value] of contacts) {
      if (!value) continue;
      write(label, headerX, cursor - 11, true, 10.5, true);
      for (const line of wrapped(value.replace(/^https?:\/\/(www\.)?/, ""), false, headerX + 69, 11, columnRight - 8)) {
        write(line, headerX + 69, cursor - 11, false, 11);
        cursor -= 17;
      }
    }
    cursor = Math.min(headerBottom, cursor - 8);
    section("Profil professionnel", 65);
    paragraph(content.cv.summary);
    section("Compétences", 100);
    for (const group of content.skillGroups) {
      const label = `${group.title} : `;
      const lines = wrapped(label + group.items.join(", "));
      ensure(lines.length * size * 1.4 + 3);
      for (const [index, line] of lines.entries()) {
        if (index === 0 && line.startsWith(label)) {
          write(label, left, cursor - size, true);
          write(line.slice(label.length), left + measureResumeText(bold, label, size), cursor - size);
        } else write(line, left, cursor - size);
        cursor -= size * 1.4;
      }
      cursor -= 3;
    }
    const originalSkillLines = original.filter((line) => line.y < skills.y && line.y > experience.y);
    const skillRows = new Map<number, typeof original>();
    for (const line of originalSkillLines) { const y = Math.round(line.y / 3) * 3; skillRows.set(y, [...(skillRows.get(y) ?? []), line]); }
    const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const canonical = (value: string) => ({ expressjs: "express", sprintboot: "springboot" }[normalize(value)] || normalize(value));
    const known = new Set(content.skillGroups.flatMap((group) => group.items).map(canonical));
    const extras = [...skillRows.values()].flatMap((row) => row.sort((a, b) => a.x - b.x).map((line) => line.text).join(" ").split(":").slice(1).join(":").split(",").map((item) => item.trim())).filter((item) => item && !known.has(canonical(item)));
    if (extras.length) paragraph(`Autres technologies pratiquées : ${[...new Set(extras)].join(", ")}`);

    section("Parcours professionnel", 130);
    const ordered = [...content.experiences].sort((a, b) => parseInt(b.period) - parseInt(a.period));
    for (const item of ordered) {
      const [role, period, place, ...missions] = formatPortfolioExperience(item).split("\n");
      const needed = [role, period, place, ...missions].reduce((sum, line) => sum + wrapped(line).length * size * 1.4 + 3, 10);
      ensure(needed);
      paragraph(role, true); paragraph(period); paragraph(place, true);
      cursor -= 3;
      for (const mission of missions) paragraph(mission.replace(/^•\s*/, ""), false, true);
      cursor -= 9;
    }
    section("Projets réalisés", 100);
    const originalText = normalize(pages.flat().map((line) => line.text).join(" "));
    const selected = content.cv.selectedProjectIds.map((id) => content.projects.find((item) => item.id === id)).filter((item): item is PortfolioContent["projects"][number] => !!item);
    const historical = content.projects.filter((item) => originalText.includes(normalize(item.title.split(/[-–]/)[0])));
    const projects = [...new Map([...selected, ...historical].map((item) => [item.id, item])).values()];
    for (const project of projects) {
      const description = project.cvSummary || project.description;
      const rows = [{ text: project.title, strong: true }, { text: description }, { text: `Technologies : ${project.technologies.join(", ")}` }];
      ensure(rows.reduce((sum, row) => sum + wrapped(row.text, row.strong).length * size * 1.4 + 3, 9));
      for (const row of rows) paragraph(row.text, row.strong);
      cursor -= 9;
    }
    const educationX = left + 100;
    const educationHeight = (item: PortfolioContent["education"][number]) => (wrapped(item.title, true, educationX).length + wrapped(item.place, false, educationX).length) * size * 1.4 + 19;
    section("Formations", content.education.length ? educationHeight(content.education[0]) : 30);
    for (const item of content.education) {
      const entryHeight = educationHeight(item);
      ensure(entryHeight);
      const top = cursor;
      // A date column and a fine timeline keep each qualification distinct.
      const ongoing = item.period.match(/^(.*?)\s*[—–]\s*(En cours|Aujourd’hui)$/i);
      const dateLines = ongoing ? [ongoing[1], ongoing[2]] : wrapped(item.period, false, left, size, educationX - 18);
      dateLines.forEach((line, index) => write(line, left, top - size - index * size * 1.4, false, size, true));
      page.drawCircle({ x: educationX - 11, y: top - size * .65, size: 2.2, color: rgb(.82, .25, .30) });
      page.drawLine({ start: { x: educationX - 11, y: top - size - 2 }, end: { x: educationX - 11, y: top - entryHeight + 8 }, thickness: .65, color: rgb(.90, .78, .81) });
      paragraph(item.title, true, false, educationX);
      paragraph(item.place, false, false, educationX);
      cursor = top - entryHeight;
    }
    // The owner confirmed that the original language levels are current. Retain
    // that exact artwork rather than guessing levels from obsolete form defaults.
    const last = pages[pages.length - 1];
    const languages = last.find((line) => detectResumeHeading(line.text) === "languages");
    const references = last.find((line) => /^r[eé]f[eé]rences?$/i.test(line.text.trim()));
    if (languages) {
      const languageLines = last.filter((line) => line.y < languages.y && line.y > (references?.y ?? 0));
      const labels = languageLines.filter((line) => /^(fran[cç]ais|espagnol|anglais)\s*:?$/i.test(line.text.trim()));
      section("Langues", labels.length * 24);
      for (const label of labels.sort((a, b) => b.y - a.y)) {
        const level = languageLines.find((line) => Math.abs(line.y - label.y) < 6 && /bilingue|interm[eé]diaire|notions|courant|professionnel/i.test(line.text));
        const levelText = level?.text || "";
        ensure(24);
        write(label.text, left, cursor - size, true);
        const barX = left + 76, gap = 3, segment = 30;
        const filled = /bilingue|courant/i.test(levelText) ? 6 : /interm/i.test(levelText) ? 3 : /notions/i.test(levelText) ? 2 : 0;
        for (let i = 0; i < 6; i++) page.drawRectangle({ x: barX + i * (segment + gap), y: cursor - size, width: segment, height: 5, color: i < filled ? rgb(.78, .26, .32) : rgb(.82, .82, .82) });
        write(levelText, barX + 6 * (segment + gap) + 12, cursor - size);
        cursor -= 24;
      }
    }
    if (references) {
      section("Références", 115);
      const rows = new Map<number, typeof original>();
      for (const line of last.filter((item) => item.y < references.y - 4)) { const y = Math.round(line.y / 2) * 2; rows.set(y, [...(rows.get(y) ?? []), line]); }
      const lines = [...rows.values()].map((row) => ({ y: row[0].y, text: row.sort((a, b) => a.x - b.x).map((line) => line.text).join(" ") })).sort((a, b) => b.y - a.y);
      const groups: string[][] = [];
      for (const line of lines) {
        if (/coach|responsable|r[eé]f[eé]rent/i.test(line.text) || !groups.length) groups.push([line.text]);
        else groups[groups.length - 1].push(line.text);
      }
      const colWidth = (right - margin - 16) / 2;
      const cards = groups.map((group) => {
        const [name, ...role] = group[0].split(/\s+[–—-]\s+/);
        return [{ text: name, strong: true, pt: 13 }, ...(role.length ? [{ text: role.join(" · "), strong: false, pt: 11 }] : []), ...group.slice(1).map((text) => ({ text, strong: false, pt: 11.5 }))];
      });
      for (let row = 0; row < cards.length; row += 2) {
        const pair = cards.slice(row, row + 2);
        const cardHeight = Math.max(...pair.map((card) => card.reduce((sum, item) => sum + wrapped(item.text, item.strong, 0, item.pt, colWidth - 24).length * (item.pt * 1.4) + 4, 24)));
        ensure(cardHeight + 10);
        const top = cursor;
        pair.forEach((card, column) => {
          const x = margin + column * (colWidth + 16);
          page.drawRectangle({ x, y: top - cardHeight, width: colWidth, height: cardHeight, color: rgb(.995, .974, .98), borderColor: rgb(.92, .83, .85), borderWidth: .6 });
          page.drawLine({ start: { x, y: top - 1 }, end: { x: x + 38, y: top - 1 }, thickness: 2, color: rgb(.82, .25, .30) });
          let y = top - 12;
          card.forEach((item) => {
            for (const line of wrapped(item.text, item.strong, x + 12, item.pt, x + colWidth - 12)) {
              write(line, x + 12, y - item.pt, item.strong, item.pt);
              y -= item.pt * 1.4;
            }
            y -= 4;
          });
        });
        cursor = top - cardHeight - 10;
      }
    }
    output.getPages().forEach((item, i) => drawResumeText(item, `${i + 1} / ${output.getPageCount()}`, { x: width / 2 - 10, y: 17, size: 8, font: regular, color: rgb(.4, .4, .4) }));
    output.catalog.set(PDFName.of("RGResumeText"), PDFHexString.fromText(JSON.stringify(regions)));
    output.catalog.set(PDFName.of("RGResumeSource"), output.context.register(output.context.flateStream(new Uint8Array(bytes))));
    output.setTitle(`CV - ${content.identity.name}`);
    output.setAuthor(content.identity.name);
    return output.save();
  } finally { await task.destroy(); }
}
