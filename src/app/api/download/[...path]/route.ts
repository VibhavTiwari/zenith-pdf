import { NextResponse } from "next/server";
import { readFile, stat, readdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const OUTPUT_DIR = path.join(process.cwd(), "outputs");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: routePath } = await params;
    const [jobId, ...rest] = routePath;

    if (!jobId) {
      return NextResponse.json(
        { code: "DOWNLOAD_NOT_FOUND", message: "Missing job id." },
        { status: 400 }
      );
    }

    const jobDir = path.join(OUTPUT_DIR, jobId);
    if (!existsSync(jobDir)) {
      return NextResponse.json(
        { code: "DOWNLOAD_NOT_FOUND", message: "The requested file was not found." },
        { status: 404 }
      );
    }

    let filePath: string;
    if (rest.length > 0) {
      const requested = decodeURIComponent(rest.join("/"));
      const normalized = path.normalize(requested).replace(/^([.][.][/\\])+/, "");
      filePath = path.join(jobDir, normalized);
      if (!filePath.startsWith(jobDir)) {
        return NextResponse.json(
          { code: "DOWNLOAD_NOT_FOUND", message: "Invalid file path." },
          { status: 400 }
        );
      }
    } else {
      const files = (await readdir(jobDir)).filter((f) => !f.startsWith("_"));
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

    const [fileBuffer, fileStat] = await Promise.all([readFile(filePath), stat(filePath)]);
    const outputName = path.basename(filePath);

    const ext = path.extname(outputName).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".zip": "application/zip",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
    };

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentTypes[ext] || "application/octet-stream",
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
