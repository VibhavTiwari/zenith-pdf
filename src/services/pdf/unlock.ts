import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function unlockPdf(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);

  // Load with ignoreEncryption to bypass restrictions
  const pdfDoc = await PDFDocument.load(fileBuffer, {
    ignoreEncryption: true,
  });

  const totalPages = pdfDoc.getPageCount();

  // Re-save without encryption
  const pdfBytes = await pdfDoc.save();
  const fileName = "unlocked.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  return {
    outputPath,
    fileName,
    fileSize: pdfBytes.length,
    originalSize: fileBuffer.length,
    pageCount: totalPages,
    message: `PDF unlocked successfully (${totalPages} pages). Permission restrictions have been removed.`,
  };
}
