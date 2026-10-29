import fontkit from "@pdf-lib/fontkit";
import { PDFArray, PDFDict, PDFDocument, PDFName, PDFRawStream, PDFFont, PDFPage, RGB, StandardFonts, decodePDFRawStream } from "pdf-lib";

const supported = new WeakMap<PDFFont, Set<number>>();
const fallbacks = new WeakMap<PDFFont, PDFFont>();

export const resumeFonts = async (source: PDFDocument, output: PDFDocument) => {
  output.registerFontkit(fontkit);
  const candidates: { name: string; bytes: Uint8Array }[] = [];
  const seen = new Set<PDFDict>();
  const inspect = (dict: PDFDict) => {
    if (seen.has(dict)) return;
    seen.add(dict);
    const name = dict.get(PDFName.of("BaseFont"))?.toString() || "";
    const descriptor = dict.lookupMaybe(PDFName.of("FontDescriptor"), PDFDict);
    if (descriptor) for (const key of ["FontFile2", "FontFile3"]) {
      const ref = descriptor.get(PDFName.of(key));
      const stream = ref && source.context.lookup(ref);
      if (stream instanceof PDFRawStream) candidates.push({ name, bytes: decodePDFRawStream(stream).decode() });
    }
    const descendants = dict.lookupMaybe(PDFName.of("DescendantFonts"), PDFArray);
    if (descendants) for (const value of descendants.asArray()) { const child = source.context.lookup(value); if (child instanceof PDFDict) inspect(child); }
    const resources = dict.lookupMaybe(PDFName.of("Resources"), PDFDict) || dict;
    const fonts = resources.lookupMaybe(PDFName.of("Font"), PDFDict);
    if (fonts) for (const [, ref] of fonts.entries()) { const value = source.context.lookup(ref); if (value instanceof PDFDict) inspect(value); }
    const objects = resources.lookupMaybe(PDFName.of("XObject"), PDFDict);
    if (objects) for (const [, ref] of objects.entries()) { const value = source.context.lookup(ref); if (value instanceof PDFRawStream) inspect(value.dict); }
  };
  source.getPages().forEach((page) => inspect(page.node));
  const embed = async (bold: boolean) => {
    const preferred = candidates.filter((candidate) => /bold|black|demi/i.test(candidate.name) === bold);
    for (const candidate of preferred) {
      try {
        const font = await output.embedFont(candidate.bytes, { subset: true });
        supported.set(font, new Set(fontkit.create(candidate.bytes).characterSet));
        fallbacks.set(font, await output.embedFont(bold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica));
        return font;
      } catch { /* Unsupported embedded font format. */ }
    }
    return output.embedFont(bold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
  };
  return { regular: await embed(false), bold: await embed(true), matched: candidates.length > 0 };
};

const textRuns = (font: PDFFont, text: string) => {
  const runs: { text: string; font: PDFFont }[] = [];
  for (const character of text) {
    const actual = supported.has(font) && !supported.get(font)!.has(character.codePointAt(0)!) ? fallbacks.get(font)! : font;
    const last = runs[runs.length - 1];
    if (last?.font === actual) last.text += character; else runs.push({ text: character, font: actual });
  }
  return runs;
};
export const measureResumeText = (font: PDFFont, text: string, size: number) => textRuns(font, text).reduce((total, run) => total + run.font.widthOfTextAtSize(run.text, size), 0);
export const drawResumeText = (page: PDFPage, text: string, options: { x: number; y: number; size: number; font: PDFFont; color: RGB }) => {
  let x = options.x;
  for (const run of textRuns(options.font, text)) {
    page.drawText(run.text, { ...options, font: run.font, x });
    x += run.font.widthOfTextAtSize(run.text, options.size);
  }
};
