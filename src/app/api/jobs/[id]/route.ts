import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const metaPath = path.join(UPLOAD_DIR, id, "_meta.json");

  if (!existsSync(metaPath)) {
    return NextResponse.json(
      { code: "DOWNLOAD_NOT_FOUND", message: "Job not found." },
      { status: 404 }
    );
  }

  const meta = JSON.parse(await readFile(metaPath, "utf-8")) as {
    jobId: string;
    tool: string;
    createdAt: string;
    status: string;
    files: { name: string; size: number }[];
  };

  return NextResponse.json({
    jobId: meta.jobId,
    tool: meta.tool,
    createdAt: meta.createdAt,
    status: meta.status,
    files: meta.files.map((f) => ({ name: f.name, size: f.size })),
  });
}
