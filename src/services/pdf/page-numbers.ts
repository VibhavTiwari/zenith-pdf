import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import path from "path";

type Position =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

export async function addPageNumbers(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const startNumber = (options.startNumber as number) || 1;
  const position = (options.position as Position) || "bottom-center";
  const format = (options.format as string) || "{n}";
  const fontSize = (options.fontSize as number) || 11;
  const margin = (options.margin as number) || 30;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    const pageNum = startNumber + i;

    // Build page number text
    const text = format
      .replace("{n}", String(pageNum))
      .replace("{total}", String(totalPages + startNumber - 1))
      .replace("{N}", String(totalPages + startNumber - 1));

    const textWidth = font.widthOfTextAtSize(text, fontSize);

    let x: number;
    let y: number;

    switch (position) {
      case "bottom-left":
        x = margin;
        y = margin;
        break;
      case "bottom-right":
        x = width - textWidth - margin;
        y = margin;
        break;
      case "top-center":
        x = (width - textWidth) / 2;
        y = height - margin - fontSize;
        break;
      case "top-left":
        x = margin;
        y = height - margin - fontSize;
        break;
      case "top-right":
        x = width - textWidth - margin;
        y = height - margin - fontSize;
        break;
      case "bottom-center":
      default:
        x = (width - textWidth) / 2;
        y = margin;
        break;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const fileName = "numbered.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  return {
    outputPath,
    fileName,
    fileSize: pdfBytes.length,
    originalSize: fileBuffer.length,
    pageCount: totalPages,
    message: `Added page numbers (${startNumber}–${startNumber + totalPages - 1}) to ${totalPages} pages at ${position}.`,
  };
}
