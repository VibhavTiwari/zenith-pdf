import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function watermarkPdf(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const text = (options.text as string) || "CONFIDENTIAL";
  const opacity = (options.opacity as number) || 0.15;
  const rotation = (options.rotation as number) ?? -45;
  const fontSize = (options.fontSize as number) || 60;
  const colorHex = (options.color as string) || "#888888";

  if (text.length > 100) {
    throw new Error("Watermark text must be 100 characters or fewer.");
  }

  // Parse hex color
  const r = parseInt(colorHex.slice(1, 3), 16) / 255;
  const g = parseInt(colorHex.slice(3, 5), 16) / 255;
  const b = parseInt(colorHex.slice(5, 7), 16) / 255;

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();

    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const x = (width - textWidth) / 2;
    const y = height / 2;

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(r, g, b),
      opacity,
      rotate: degrees(rotation),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const fileName = "watermarked.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  return {
    outputPath,
    fileName,
    fileSize: pdfBytes.length,
    originalSize: fileBuffer.length,
    pageCount: totalPages,
    message: `Added "${text}" watermark to all ${totalPages} pages.`,
  };
}
