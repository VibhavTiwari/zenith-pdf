import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { generateId } from "@/lib/utils";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const tool = formData.get("tool") as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { code: "UPLOAD_NO_FILE", message: "No file was provided." },
        { status: 400 }
      );
    }

    if (!tool) {
      return NextResponse.json(
        { code: "PROCESS_UNSUPPORTED_OPERATION", message: "No tool specified." },
        { status: 400 }
      );
    }

    // Validate files
    for (const file of files) {
      if (file.size === 0) {
        return NextResponse.json(
          {
            code: "UPLOAD_EMPTY_FILE",
            message: `The uploaded file "${file.name}" is empty (0 bytes).`,
          },
          { status: 422 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            code: "UPLOAD_FILE_TOO_LARGE",
            message: `File "${file.name}" exceeds the maximum allowed size of 100MB.`,
          },
          { status: 413 }
        );
      }
    }

    // Create job directory
    const jobId = generateId();
    const jobDir = path.join(UPLOAD_DIR, jobId);
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }
    await mkdir(jobDir, { recursive: true });

    // Save files
    const savedFiles: { name: string; path: string; size: number }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = `${i}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = path.join(jobDir, safeName);
      await writeFile(filePath, buffer);
      savedFiles.push({ name: file.name, path: filePath, size: file.size });
    }

    // Save job metadata
    const metadata = {
      jobId,
      tool,
      files: savedFiles,
      createdAt: new Date().toISOString(),
      status: "uploaded",
    };
    await writeFile(
      path.join(jobDir, "_meta.json"),
      JSON.stringify(metadata, null, 2)
    );

    return NextResponse.json({ jobId, fileCount: files.length });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        code: "PROCESS_INTERNAL_ERROR",
        message: "An unexpected error occurred during upload.",
      },
      { status: 500 }
    );
  }
}
