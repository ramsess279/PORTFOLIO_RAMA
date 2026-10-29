import { detectResumeHeading } from "./resumeSuggestions";
export type FlowLine = { text: string; y: number; height: number; x: number };
export type FlowBand = { top: number; bottom: number; heading: boolean };
const heading = (text: string) => Boolean(detectResumeHeading(text)) || /^(projets? r[eé]alis[eé]s|certifications?|r[eé]f[eé]rences?)$/i.test(text.trim());
const newEntry = (text: string) => /^(apprenn?ant|d[eé]veloppeu|ing[eé]nieu|stagiaire|consultant|analyste|\d{4}\s*[-–—])/i.test(text.trim());
export const resumeFlowBands = (items: FlowLine[], maxTop: number) => {
  const lines = items.filter((item) => item.y + item.height < maxTop + .5 && item.y > 12 && item.text.trim()).sort((a, b) => b.y - a.y || a.x - b.x);
  const groups: FlowLine[][] = [];
  for (const item of lines) {
    const group = groups[groups.length - 1];
    const previous = group?.[group.length - 1];
    const separate = previous && previous.y - item.y > Math.max(20, item.height * 2.1);
    const starts = previous && previous.y - item.y > item.height * .7 && (heading(item.text) || newEntry(item.text));
    if (!group || separate || starts || (heading(group[0].text) && previous && previous.y - item.y > item.height * .7)) groups.push([item]);
    else group.push(item);
  }
  return groups.map((group): FlowBand => ({ top: Math.min(maxTop, Math.max(...group.map((line) => line.y + line.height)) + 3), bottom: Math.max(0, Math.min(...group.map((line) => line.y)) - 4), heading: heading(group[0].text) }));
};
