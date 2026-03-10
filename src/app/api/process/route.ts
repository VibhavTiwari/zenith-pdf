import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { mergePdf } from "@/services/pdf/merge";
import { splitPdf } from "@/services/pdf/split";
import { rotatePdf } from "@/services/pdf/rotate";
import { compressPdf } from "@/services/pdf/compress";
import { pdfToImages } from "@/services/pdf/to-images";
import { imagesToPdf } from "@/services/pdf/from-images";
import { protectPdf } from "@/services/pdf/protect";
import { unlockPdf } from "@/services/pdf/unlock";
import { watermarkPdf } from "@/services/pdf/watermark";
import { addPageNumbers } from "@/services/pdf/page-numbers";
import { editMetadata } from "@/services/pdf/metadata";
import { organizePages } from "@/services/pdf/organize";
import { resolveToolOrThrow } from "@/lib/tool-validation";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const OUTPUT_DIR = path.join(process.cwd(), "outputs");

interface JobMeta {
  jobId: string;
  tool: string;
  files: { name: string; path: string; size: number }[];
  createdAt: string;
  expiresAt?: string;
  status: string;
}

type ProcessorFn = (
  files: { name: string; path: string; size: number }[],
  options: Record<string, unknown>,
  outputDir: string
) => Promise<{
  outputPath: string;
  fileName: string;
  fileSize: number;
  originalSize?: number;
  pageCount?: number;
  message?: string;
}>;

const PROCESSORS: Record<string, ProcessorFn> = {
  "merge-pdf": mergePdf,
  "split-pdf": splitPdf,
  "rotate-pdf": rotatePdf,
  "compress-pdf": compressPdf,
  "pdf-to-images": pdfToImages,
  "images-to-pdf": imagesToPdf,
  "protect-pdf": protectPdf,
  "unlock-pdf": unlockPdf,
  "watermark-pdf": watermarkPdf,
  "page-numbers": addPageNumbers,
  "pdf-metadata": editMetadata,
  "organize-pages": organizePages,
  "extract-pages": splitPdf,
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let metaPath: string | null = null;
  let meta: JobMeta | null = null;

  try {
    const body = await req.json();
    const { jobId, tool, options = {} } = body;

    if (!jobId || !tool) {
      return NextResponse.json(
        { code: "PROCESS_UNSUPPORTED_OPERATION", message: "Missing jobId or tool." },
        { status: 400 }
      );
    }

    resolveToolOrThrow(tool);

    const metaPath = path.join(UPLOAD_DIR, jobId, "_meta.json");
    if (!existsSync(metaPath)) {
      return NextResponse.json(
        { code: "DOWNLOAD_NOT_FOUND", message: "Job not found." },
        { status: 404 }
      );
    }

    const meta: JobMeta = JSON.parse(await readFile(metaPath, "utf-8"));
    if (meta.tool !== tool) {
      return NextResponse.json(
        {
          code: "PROCESS_UNSUPPORTED_OPERATION",
          message: `Job was uploaded for \"${meta.tool}\" but requested \"${tool}\".`,
        },
        { status: 409 }
      );
    }

    const processor = PROCESSORS[tool];
    if (!processor) {
      return NextResponse.json(
        {
          code: "PROCESS_UNSUPPORTED_OPERATION",
          message: `Tool \"${tool}\" does not have a processing pipeline yet.`,
        },
        { status: 400 }
      );
    }

    const jobOutputDir = path.join(OUTPUT_DIR, jobId);
    if (!existsSync(OUTPUT_DIR)) {
      await mkdir(OUTPUT_DIR, { recursive: true });
    }
    await mkdir(jobOutputDir, { recursive: true });

    meta.status = "processing";
    await writeFile(metaPath, JSON.stringify(meta, null, 2));

    const result = await processor(meta.files, options, jobOutputDir);

    const result = await processor(jobMeta.files, options, jobOutputDir);

    meta.status = "completed";
    await writeFile(metaPath, JSON.stringify(meta, null, 2));

    return NextResponse.json({
      downloadUrl: `/api/download/${jobId}/${encodeURIComponent(result.fileName)}`,
      fileName: result.fileName,
      fileSize: result.fileSize,
      originalSize: result.originalSize,
      pageCount: result.pageCount,
      processingTime: Date.now() - startTime,
      message: result.message,
    });
  } catch (error) {
    console.error("Processing error:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred during processing.";

    if (message.startsWith("Unsupported tool") || message.includes("not available yet")) {
      return NextResponse.json(
        { code: "PROCESS_UNSUPPORTED_OPERATION", message },
        { status: 400 }
      );
    }

    return NextResponse.json({ code: "PROCESS_INTERNAL_ERROR", message }, { status: 500 });
  }
}
