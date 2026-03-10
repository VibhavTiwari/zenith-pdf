import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { buildZipFromDiskFiles } from "@/lib/zip";

function parsePageRanges(rangeStr: string, totalPages: number): number[][] {
  const groups: number[][] = [];
  const parts = rangeStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (isNaN(start) || isNaN(end) || start > end) {
        throw new Error(`Invalid page range: "${part}". PDF has ${totalPages} pages.`);
      }
      const pages: number[] = [];
      for (let i = start - 1; i < end; i++) pages.push(i);
      groups.push(pages);
    } else {
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
        throw new Error(`Invalid page number: "${part}". PDF has ${totalPages} pages.`);
      }
      groups.push([pageNum - 1]);
    }
  }

  if (groups.length === 0) {
    throw new Error("Please provide at least one page range.");
  }

  return groups;
}

export async function splitPdf(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);
  const srcPdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();

  if (totalPages <= 1) {
    throw new Error("Cannot split a single-page PDF.");
  }

  const mode = (options.mode as string) || "ranges";
  const rangeStr = (options.ranges as string) || "";

  if (mode === "single-pages") {
    const outputFiles: { name: string; path: string }[] = [];

    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(srcPdf, [i]);
      newPdf.addPage(page);
      const pdfBytes = await newPdf.save();
      const pageName = `page_${i + 1}.pdf`;
      const pagePath = path.join(outputDir, pageName);
      await writeFile(pagePath, pdfBytes);
      outputFiles.push({ name: pageName, path: pagePath });
    }

    const zipBytes = await buildZipFromDiskFiles(outputFiles);
    const fileName = "split_pages.zip";
    const outputPath = path.join(outputDir, fileName);
    await writeFile(outputPath, zipBytes);

    return {
      outputPath,
      fileName,
      fileSize: zipBytes.length,
      originalSize: fileBuffer.length,
      pageCount: totalPages,
      message: `Split into ${totalPages} individual PDF files (ZIP).`,
    };
  }

  if (!rangeStr) {
    const mid = Math.ceil(totalPages / 2);
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(
      srcPdf,
      Array.from({ length: mid }, (_, i) => i)
    );
    pages.forEach((p) => newPdf.addPage(p));
    const pdfBytes = await newPdf.save();
    const fileName = "split_part1.pdf";
    const outputPath = path.join(outputDir, fileName);
    await writeFile(outputPath, pdfBytes);

    return {
      outputPath,
      fileName,
      fileSize: pdfBytes.length,
      originalSize: fileBuffer.length,
      pageCount: mid,
      message: `Extracted pages 1-${mid} of ${totalPages}.`,
    };
  }

  const groups = parsePageRanges(rangeStr, totalPages);
  const allPages = groups.flat();

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, allPages);
  copiedPages.forEach((p) => newPdf.addPage(p));
  const pdfBytes = await newPdf.save();

  const fileName = "split_extracted.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  return {
    outputPath,
    fileName,
    fileSize: pdfBytes.length,
    originalSize: fileBuffer.length,
    pageCount: allPages.length,
    message: `Extracted ${allPages.length} pages from ${totalPages}-page PDF.`,
  };
}
