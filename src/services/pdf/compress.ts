import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function compressPdf(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);
  const originalSize = fileBuffer.length;

  // Load and re-save the PDF — pdf-lib strips unused objects and
  // produces a clean output which often reduces size
  const pdfDoc = await PDFDocument.load(fileBuffer, {
    ignoreEncryption: true,
  });

  const totalPages = pdfDoc.getPageCount();
  const level = (options.level as string) || "basic";

  // Save with optimization options
  // pdf-lib doesn't have explicit compression levels, but re-serializing
  // removes unused objects, duplicate resources, and cleans the structure
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true, // reduces file size via object streams
    addDefaultPage: false,
    objectsPerTick: 100,
  });

  const fileName = "compressed.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  const newSize = pdfBytes.length;
  const reduction = originalSize - newSize;
  const percent = originalSize > 0 ? Math.round((reduction / originalSize) * 100) : 0;

  let message: string;
  if (percent <= 0) {
    message = "This PDF is already well-optimized. Minimal size reduction achieved.";
  } else {
    message = `Compressed by ${percent}% (saved ${formatBytes(reduction)}). Level: ${level}.`;
  }

  return {
    outputPath,
    fileName,
    fileSize: newSize,
    originalSize,
    pageCount: totalPages,
    message,
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
