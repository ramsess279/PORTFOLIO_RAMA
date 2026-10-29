/** Keep only explicit newlines; fit long lines into the available horizontal space. */
export const fitResumeText = (text: string, requestedSize: number, availableWidth: number, measure: (line: string, size: number) => number) => {
  const widest = Math.max(0, ...text.split(/\r?\n/).map((line) => measure(line, requestedSize)));
  return widest > availableWidth && widest > 0 ? requestedSize * Math.max(0, availableWidth) / widest : requestedSize;
};

/** Wrap new content blocks at word boundaries without shrinking the body text. */
export const wrapResumeBlock = (text: string, size: number, width: number, measure: (line: string, size: number) => number) => text.split(/\r?\n/).flatMap((paragraph) => {
  if (!paragraph.trim()) return [""];
  const lines: string[] = [];
  let line = "";
  for (const word of paragraph.trim().split(/\s+/)) {
    if (line && measure(`${line} ${word}`, size) > width) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}).join("\n");
