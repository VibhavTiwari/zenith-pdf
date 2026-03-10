import { PDFDocument, degrees } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function rotatePdf(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const angle = (options.angle as number) || 90;
  const selectedPages = options.pages as number[] | undefined;

  // Validate angle
  if (![90, 180, 270].includes(angle)) {
    throw new Error("Rotation angle must be 90, 180, or 270 degrees.");
  }

  const pagesToRotate = selectedPages
    ? selectedPages.map((p) => p - 1) // Convert to 0-based
    : Array.from({ length: totalPages }, (_, i) => i); // All pages

  let rotatedCount = 0;
  for (const pageIndex of pagesToRotate) {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      const page = pdfDoc.getPage(pageIndex);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + angle));
      rotatedCount++;
    }
  }

  const pdfBytes = await pdfDoc.save();
  const fileName = "rotated.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  return {
    outputPath,
    fileName,
    fileSize: pdfBytes.length,
    originalSize: fileBuffer.length,
    pageCount: totalPages,
    message: `Rotated ${rotatedCount} page${rotatedCount !== 1 ? "s" : ""} by ${angle} degrees.`,
  };
}
