import JSZip from "jszip";
import { readFile } from "fs/promises";

export async function buildZipFromDiskFiles(
  files: { name: string; path: string }[]
): Promise<Uint8Array> {
  const zip = new JSZip();

  for (const file of files) {
    const data = await readFile(file.path);
    zip.file(file.name, data);
  }

  return zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}
