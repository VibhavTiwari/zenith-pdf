import { getToolBySlug, type ToolDefinition } from "@/lib/tools-registry";
import path from "path";

export function resolveToolOrThrow(slug: string): ToolDefinition {
  const tool = getToolBySlug(slug);
  if (!tool) {
    throw new Error(`Unsupported tool: ${slug}`);
  }
  if (!tool.implemented) {
    throw new Error(`Tool \"${slug}\" is not available yet.`);
  }
  return tool;
}

export function validateUploadAgainstTool(
  tool: ToolDefinition,
  files: File[]
): string | null {
  if (!tool.multiFile && files.length > 1) {
    return `\"${tool.name}\" accepts only one file.`;
  }
  if (files.length > tool.maxFiles) {
    return `\"${tool.name}\" accepts up to ${tool.maxFiles} file(s).`;
  }

  const allowedExtensions = new Set(tool.acceptedTypes.map((t) => t.toLowerCase()));

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.has(ext)) {
      return `File \"${file.name}\" is not supported for ${tool.name}. Allowed: ${tool.acceptedTypes.join(", ")}`;
    }
  }

  return null;
}
