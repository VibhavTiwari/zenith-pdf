"use client";

import { useParams } from "next/navigation";
import { getToolBySlug } from "@/lib/tools-registry";
import { ToolPageShell } from "@/components/shared/tool-page-shell";
import { MergeOptions } from "@/components/tools/merge-options";
import { SplitOptions } from "@/components/tools/split-options";
import { RotateOptions } from "@/components/tools/rotate-options";
import { CompressOptions } from "@/components/tools/compress-options";
import { WatermarkOptions } from "@/components/tools/watermark-options";
import { PageNumbersOptions } from "@/components/tools/page-numbers-options";
import { ProtectOptions } from "@/components/tools/protect-options";
import { MetadataOptions } from "@/components/tools/metadata-options";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Map of tool slugs to their custom option components
const TOOL_OPTIONS: Record<
  string,
  React.ComponentType<{ files: any[]; onProcess: (options?: Record<string, unknown>) => void }>
> = {
  "merge-pdf": MergeOptions,
  "split-pdf": SplitOptions,
  "extract-pages": SplitOptions,
  "rotate-pdf": RotateOptions,
  "compress-pdf": CompressOptions,
  "watermark-pdf": WatermarkOptions,
  "page-numbers": PageNumbersOptions,
  "protect-pdf": ProtectOptions,
  "pdf-metadata": MetadataOptions,
};

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Tool Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The tool &quot;{slug}&quot; doesn&apos;t exist. Check the URL or browse all tools.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse All Tools
        </Link>
      </div>
    );
  }

  const OptionsComponent = TOOL_OPTIONS[slug];

  return (
    <ToolPageShell tool={tool}>
      {OptionsComponent
        ? ({ files, onProcess }) => (
            <OptionsComponent files={files} onProcess={onProcess} />
          )
        : undefined}
    </ToolPageShell>
  );
}
