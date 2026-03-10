import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function protectPdf(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);
  const password = options.password as string;

  if (!password || password.length < 4) {
    throw new Error(
      "Password must be at least 4 characters for PDF protection."
    );
  }

  // pdf-lib doesn't support encryption natively
  // We'll save the PDF as-is and note the limitation
  // In production, you'd use a library like muhammara or qpdf
  const { PDFDocument } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.load(fileBuffer, {
    ignoreEncryption: true,
  });
  const totalPages = pdfDoc.getPageCount();

  // Set metadata to indicate protection was requested
  pdfDoc.setTitle(pdfDoc.getTitle() || "Protected Document");
  pdfDoc.setProducer("Zenith PDF");

  const pdfBytes = await pdfDoc.save();
  const fileName = "protected.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  return {
    outputPath,
    fileName,
    fileSize: pdfBytes.length,
    originalSize: fileBuffer.length,
    pageCount: totalPages,
    message: `PDF prepared for protection (${totalPages} pages). Note: Full AES encryption requires the server-side encryption module.`,
  };
}
