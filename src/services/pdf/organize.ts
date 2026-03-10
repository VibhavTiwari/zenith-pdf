import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function organizePages(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);
  const srcPdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();

  const action = (options.action as string) || "reorder";
  const pageOrder = options.pageOrder as number[] | undefined;
  const deletedPages = options.deletePages as number[] | undefined;

  const newPdf = await PDFDocument.create();

  if (action === "delete" && deletedPages) {
    // Copy all pages except deleted ones (1-based input)
    const deleteSet = new Set(deletedPages.map((p) => p - 1));
    const keepIndices = Array.from({ length: totalPages }, (_, i) => i).filter(
      (i) => !deleteSet.has(i)
    );

    if (keepIndices.length === 0) {
      throw new Error("Cannot delete all pages. At least one page must remain.");
    }

    const pages = await newPdf.copyPages(srcPdf, keepIndices);
    pages.forEach((p) => newPdf.addPage(p));
  } else if (action === "reorder" && pageOrder) {
    // Reorder pages based on provided order (1-based input)
    const indices = pageOrder.map((p) => p - 1);
    const pages = await newPdf.copyPages(srcPdf, indices);
    pages.forEach((p) => newPdf.addPage(p));
  } else if (action === "duplicate") {
    // Duplicate specified pages
    const dupPages = (options.duplicatePages as number[]) || [];
    const allIndices = Array.from({ length: totalPages }, (_, i) => i);

    // Insert duplicates after their originals
    const finalIndices: number[] = [];
    for (const idx of allIndices) {
      finalIndices.push(idx);
      if (dupPages.includes(idx + 1)) {
        finalIndices.push(idx); // duplicate
      }
    }

    const pages = await newPdf.copyPages(srcPdf, finalIndices);
    pages.forEach((p) => newPdf.addPage(p));
  } else {
    // Default: just copy all pages as-is
    const pages = await newPdf.copyPages(srcPdf, srcPdf.getPageIndices());
    pages.forEach((p) => newPdf.addPage(p));
  }

  const pdfBytes = await newPdf.save();
  const fileName = "organized.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  return {
    outputPath,
    fileName,
    fileSize: pdfBytes.length,
    originalSize: fileBuffer.length,
    pageCount: newPdf.getPageCount(),
    message: `Pages organized: ${totalPages} → ${newPdf.getPageCount()} pages (${action}).`,
  };
}
