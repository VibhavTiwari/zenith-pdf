import { PDFDocument } from "pdf-lib";
import { readFile, writeFile, stat } from "fs/promises";
import path from "path";

export async function mergePdf(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  if (files.length < 2) {
    throw new Error("At least 2 files are required to merge.");
  }

  const mergedPdf = await PDFDocument.create();
  let totalOriginalSize = 0;

  for (const file of files) {
    const fileBuffer = await readFile(file.path);
    totalOriginalSize += fileBuffer.length;

    const ext = path.extname(file.name).toLowerCase();
    if (ext === ".pdf") {
      const srcPdf = await PDFDocument.load(fileBuffer, {
        ignoreEncryption: true,
      });
      const pages = await mergedPdf.copyPages(
        srcPdf,
        srcPdf.getPageIndices()
      );
      pages.forEach((page) => mergedPdf.addPage(page));
    } else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      const img =
        ext === ".png"
          ? await mergedPdf.embedPng(fileBuffer)
          : await mergedPdf.embedJpg(fileBuffer);
      const page = mergedPdf.addPage([img.width, img.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
      });
    }
  }

  const pdfBytes = await mergedPdf.save();
  const fileName = "merged.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  return {
    outputPath,
    fileName,
    fileSize: pdfBytes.length,
    originalSize: totalOriginalSize,
    pageCount: mergedPdf.getPageCount(),
    message: `Successfully merged ${files.length} files into ${mergedPdf.getPageCount()} pages.`,
  };
}
