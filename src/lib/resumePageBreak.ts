export type ResumeLine = { text: string; y: number; height: number; x: number };
const startsExperience = (text: string) => /^(?:apprenant|d[eé]veloppeu|ing[eé]nieu|stagiaire|stage\b|alternan|consultan|technicien|chef de projet|responsable|analyste|designer|formation\b|exp[eé]rience\b|projets?\s)/i.test(text.trim());
const isBullet = (text: string) => /^[•●▪◦–-]/.test(text.trim());
/** Prefer complete experience blocks. A line break is only used for a block taller than a full page. */
export const resumePageBreak = (lines: ResumeLine[], top: number, capacity: number, fullPageCapacity: number) => {
  const proposed = top - Math.max(0, capacity);
  const sorted = lines.filter((line) => line.y < top).sort((a, b) => b.y - a.y);
  const starts = sorted.filter((line, index) => startsExperience(line.text) || (index > 0 && !isBullet(line.text) && sorted[index - 1].y - line.y > Math.max(22, line.height * 2.2)));
  const boundaries = starts.map((line) => Math.min(top, line.y + line.height + 4));
  const boundary = boundaries.filter((value) => value >= proposed && value < top - 2).sort((a, b) => a - b)[0];
  if (boundary !== undefined) return boundary;
  if (capacity < fullPageCapacity - 1) return top;
  // Oversized block: keep glyphs intact and leave at least two lines at the next page start.
  let bottom = proposed;
  for (const line of sorted) if (line.y - 4 < bottom && line.y + line.height + 3 > bottom) bottom = Math.max(bottom, line.y + line.height + 3);
  const below = sorted.filter((line) => line.y < bottom);
  if (below.length === 1) bottom = Math.max(bottom, below[0].y + below[0].height + 4);
  return Math.min(top, bottom);
};
