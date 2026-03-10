"use client";

import { useState, useCallback } from "react";
import type { ToolDefinition } from "@/lib/tools-registry";
import { FileUploader, type UploadedFile } from "./file-uploader";
import { ProcessingProgress } from "./processing-progress";
import { DownloadResult } from "./download-result";
import { ArrowLeft, Info, Crown } from "lucide-react";
import Link from "next/link";

type Phase = "upload" | "configure" | "processing" | "done" | "error";

interface ProcessResult {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  originalSize?: number;
  pageCount?: number;
  processingTime: number;
  message?: string;
}

interface ToolPageShellProps {
  tool: ToolDefinition;
  children?: (props: {
    files: UploadedFile[];
    onProcess: (options?: Record<string, unknown>) => void;
  }) => React.ReactNode;
}

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const [phase, setPhase] = useState<Phase>("upload");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback(
    async (options?: Record<string, unknown>) => {
      if (files.length === 0) return;

      setPhase("processing");
      setProgress(0);

      try {
        // Upload files
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f.file));
        formData.append("tool", tool.slug);
        if (options) {
          formData.append("options", JSON.stringify(options));
        }

        setProgress(20);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.message || "Upload failed");
        }

        const { jobId } = await uploadRes.json();
        setProgress(40);

        // Process
        const processRes = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, tool: tool.slug, options }),
        });

        setProgress(80);

        if (!processRes.ok) {
          const err = await processRes.json();
          throw new Error(err.message || "Processing failed");
        }

        const data = await processRes.json();
        setProgress(100);

        setResult({
          downloadUrl: data.downloadUrl,
          fileName: data.fileName,
          fileSize: data.fileSize,
          originalSize: data.originalSize,
          pageCount: data.pageCount,
          processingTime: data.processingTime,
          message: data.message,
        });

        setTimeout(() => setPhase("done"), 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setPhase("error");
      }
    },
    [files, tool.slug]
  );

  const handleReset = useCallback(() => {
    setPhase("upload");
    setFiles([]);
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  const isPaid = tool.minTier !== "free";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All tools
        </Link>
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-xl ${tool.color} flex items-center justify-center shrink-0`}
          >
            <span className="text-white text-2xl font-bold">
              {tool.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
              {isPaid && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  <Crown className="w-3 h-3" />
                  {tool.minTier === "pro" ? "PRO" : tool.minTier === "pro_ai" ? "PRO+AI" : "PLUS"}
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">{tool.description}</p>
          </div>
        </div>
      </div>

      {/* Tool not implemented banner */}
      {!tool.implemented && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Coming Soon</p>
            <p className="text-sm text-amber-700 mt-0.5">
              This tool is under development. Sign up to get notified when it launches.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {phase === "upload" && (
          <div className="p-8">
            <FileUploader
              acceptedTypes={tool.acceptedTypes}
              multiFile={tool.multiFile}
              maxFiles={tool.maxFiles}
              files={files}
              onFilesChange={(newFiles) => {
                setFiles(newFiles);
                if (newFiles.length > 0 && children) {
                  setPhase("configure");
                }
              }}
            />
          </div>
        )}

        {phase === "configure" && (
          <div className="p-8">
            {/* Show file summary */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {files.length} file{files.length !== 1 ? "s" : ""} selected
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {files.map((f) => f.name).join(", ")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPhase("upload");
                    setFiles([]);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Change files
                </button>
              </div>
            </div>

            {/* Tool-specific options */}
            {children ? (
              children({ files, onProcess: handleProcess })
            ) : (
              <div className="text-center py-4">
                <button
                  onClick={() => handleProcess()}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                >
                  {tool.name}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "processing" && (
          <div className="p-8">
            <ProcessingProgress
              progress={progress}
              toolName={tool.name}
            />
          </div>
        )}

        {phase === "done" && result && (
          <div className="p-8">
            <DownloadResult
              result={result}
              toolName={tool.name}
              onReset={handleReset}
            />
          </div>
        )}

        {phase === "error" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Failed
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Tool info footer */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Complexity</p>
          <p className="text-sm font-semibold text-gray-700 mt-1">
            {tool.complexity === "L" ? "Light" : tool.complexity === "M" ? "Medium" : "Heavy"}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Credits</p>
          <p className="text-sm font-semibold text-gray-700 mt-1">{tool.creditCost}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Output</p>
          <p className="text-sm font-semibold text-gray-700 mt-1 uppercase">{tool.outputFormat}</p>
        </div>
      </div>
    </div>
  );
}

// Simple version for tools without custom options
function X(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}
