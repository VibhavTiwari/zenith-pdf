import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function imagesToPdf(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  if (files.length === 0) {
    throw new Error("At least one image is required.");
  }

  const pdfDoc = await PDFDocument.create();
  let totalOriginalSize = 0;
  let imageCount = 0;

  const pageSize = (options.pageSize as string) || "fit";

  for (const file of files) {
    const imageBuffer = await readFile(file.path);
    totalOriginalSize += imageBuffer.length;

    const ext = path.extname(file.name).toLowerCase();

    try {
      let img;
      if (ext === ".png") {
        img = await pdfDoc.embedPng(imageBuffer);
      } else if ([".jpg", ".jpeg"].includes(ext)) {
        img = await pdfDoc.embedJpg(imageBuffer);
      } else if ([".webp", ".tiff", ".tif", ".heic", ".heif"].includes(ext)) {
        const converted = await sharp(imageBuffer).jpeg({ quality: 92 }).toBuffer();
        img = await pdfDoc.embedJpg(converted);
      } else {
        throw new Error(`Unsupported image format ${ext}`);
      }

      let pageWidth: number;
      let pageHeight: number;

      if (pageSize === "a4") {
        pageWidth = 595.28;
        pageHeight = 841.89;
      } else if (pageSize === "letter") {
        pageWidth = 612;
        pageHeight = 792;
      } else {
        pageWidth = img.width;
        pageHeight = img.height;
      }

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      const scale = Math.min(pageWidth / img.width, pageHeight / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      page.drawImage(img, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });

      imageCount++;
    } catch (e) {
      console.error(`Failed to embed image ${file.name}:`, e);
    }
  }

  if (imageCount === 0) {
    throw new Error("No valid images could be processed.");
  }

  const pdfBytes = await pdfDoc.save();
  const fileName = "images_combined.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  return {
    outputPath,
    fileName,
    fileSize: pdfBytes.length,
    originalSize: totalOriginalSize,
    pageCount: imageCount,
    message: `Combined ${imageCount} image${imageCount !== 1 ? "s" : ""} into a ${pdfDoc.getPageCount()}-page PDF.`,
  };
}
