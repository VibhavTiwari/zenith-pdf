import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function editMetadata(
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) {
  const fileBuffer = await readFile(files[0].path);
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const action = (options.action as string) || "view";

  if (action === "clear") {
    // Remove all metadata
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setCreator("");
    pdfDoc.setProducer("Zenith PDF");
  } else if (action === "edit") {
    // Set provided fields
    if (options.title !== undefined) pdfDoc.setTitle(options.title as string);
    if (options.author !== undefined) pdfDoc.setAuthor(options.author as string);
    if (options.subject !== undefined) pdfDoc.setSubject(options.subject as string);
    if (options.keywords !== undefined) {
      const kw = options.keywords as string;
      pdfDoc.setKeywords(kw.split(",").map((k: string) => k.trim()));
    }
    if (options.creator !== undefined) pdfDoc.setCreator(options.creator as string);
    pdfDoc.setProducer("Zenith PDF");
  }

  const pdfBytes = await pdfDoc.save();
  const fileName = "metadata_updated.pdf";
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, pdfBytes);

  const resultMessage =
    action === "clear"
      ? "All metadata has been cleared from the PDF."
      : action === "edit"
        ? "Metadata has been updated successfully."
        : "Metadata viewed — no changes applied.";

  return {
    outputPath,
    fileName,
    fileSize: pdfBytes.length,
    originalSize: fileBuffer.length,
    pageCount: totalPages,
    message: resultMessage,
  };
}
