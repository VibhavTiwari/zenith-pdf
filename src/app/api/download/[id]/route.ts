import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const OUTPUT_DIR = path.join(process.cwd(), "outputs");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // The id might include the filename separated by /
    // URL format: /api/download/[jobId]/[filename]
    const jobDir = path.join(OUTPUT_DIR, id);

    if (!existsSync(jobDir)) {
      return NextResponse.json(
        { code: "DOWNLOAD_NOT_FOUND", message: "The requested file was not found." },
        { status: 404 }
      );
    }

    // Get filename from search params or find the first output file
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const fileName = segments.length > 3 ? decodeURIComponent(segments.slice(3).join("/")) : null;

    let filePath: string;
    if (fileName) {
      filePath = path.join(jobDir, fileName);
    } else {
      // Find first non-meta file in output dir
      const { readdirSync } = require("fs");
      const files = readdirSync(jobDir).filter(
        (f: string) => !f.startsWith("_")
      );
      if (files.length === 0) {
        return NextResponse.json(
          { code: "DOWNLOAD_NOT_FOUND", message: "No output file found." },
          { status: 404 }
        );
      }
      filePath = path.join(jobDir, files[0]);
    }

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { code: "DOWNLOAD_NOT_FOUND", message: "The requested file was not found." },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);
    const fileStat = await stat(filePath);
    const outputName = path.basename(filePath);

    // Determine content type
    const ext = path.extname(outputName).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".zip": "application/zip",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
    };
    const contentType = contentTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${outputName}"`,
        "Content-Length": fileStat.size.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { code: "DOWNLOAD_GENERATION_FAILED", message: "Failed to generate download." },
      { status: 500 }
    );
  }
}
