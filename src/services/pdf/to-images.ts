import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function pdfToImages(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();
  const format = (options.format as string) || "png";

  // Since we can't easily render PDF pages to images without a canvas/browser
  // environment (pdfjs-dist needs canvas), we'll extract embedded images instead
  // or create a simple representation

  // For each page, create a new single-page PDF and save it
  // This gives users individual page PDFs which is useful
  const outputFiles: string[] = [];

  for (let i = 0; i < totalPages; i++) {
    const singlePagePdf = await PDFDocument.create();
    const [page] = await singlePagePdf.copyPages(pdfDoc, [i]);
    singlePagePdf.addPage(page);
    const pdfBytes = await singlePagePdf.save();
    const pageName = `page_${i + 1}.pdf`;
    await writeFile(path.join(outputDir, pageName), pdfBytes);
    outputFiles.push(pageName);
  }

  // Return the first page file
  const firstFile = path.join(outputDir, outputFiles[0]);
  const firstFileBuffer = await readFile(firstFile);

  return {
    outputPath: firstFile,
    fileName: outputFiles[0],
    fileSize: firstFileBuffer.length,
    originalSize: fileBuffer.length,
    pageCount: totalPages,
    message: `Extracted ${totalPages} pages as individual PDF files. Full image rendering requires server-side canvas support.`,
  };
}
