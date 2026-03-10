import { readFile, writeFile } from "fs/promises";
import path from "path";
import { buildZipFromDiskFiles } from "@/lib/zip";

type ImageFormat = "png" | "jpeg";

export async function pdfToImages(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);
  const format = ((options.format as string) || "png").toLowerCase() === "jpg" ? "jpeg" : (((options.format as string) || "png").toLowerCase() as ImageFormat);
  const density = Math.max(72, Math.min(300, Number(options.density) || 144));

  if (!["png", "jpeg"].includes(format)) {
    throw new Error("Unsupported image output format. Use PNG or JPG.");
  }

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const { createCanvas } = await import("@napi-rs/canvas");

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(fileBuffer),
    disableWorker: true,
    useSystemFonts: true,
    isEvalSupported: false,
  } as never);

  const pdf = await loadingTask.promise;
  const outputFiles: { name: string; path: string }[] = [];

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const viewport = page.getViewport({ scale: density / 72 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");

    await page.render({ canvasContext: context as never, viewport } as never).promise;

    const fileName = `page_${pageNo}.${format === "jpeg" ? "jpg" : "png"}`;
    const filePath = path.join(outputDir, fileName);

    const imageBytes =
      format === "jpeg"
        ? canvas.toBuffer("image/jpeg", 90)
        : canvas.toBuffer("image/png");

    await writeFile(filePath, imageBytes);
    outputFiles.push({ name: fileName, path: filePath });
  }

  const zipBytes = await buildZipFromDiskFiles(outputFiles);
  const fileName = "pdf_images.zip";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, zipBytes);

  return {
    outputPath,
    fileName,
    fileSize: zipBytes.length,
    originalSize: fileBuffer.length,
    pageCount: pdf.numPages,
    message: `Rendered ${pdf.numPages} page${pdf.numPages === 1 ? "" : "s"} to ${format.toUpperCase()} images and bundled as ZIP.`,
  };
}
