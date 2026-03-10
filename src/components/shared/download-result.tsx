"use client";

import { Download, CheckCircle2, RotateCcw, ArrowDown } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface ProcessResult {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  originalSize?: number;
  pageCount?: number;
  processingTime: number;
  message?: string;
}

interface DownloadResultProps {
  result: ProcessResult;
  toolName: string;
  onReset: () => void;
}

export function DownloadResult({ result, toolName, onReset }: DownloadResultProps) {
  const compressionPercent =
    result.originalSize && result.originalSize > result.fileSize
      ? Math.round(
          ((result.originalSize - result.fileSize) / result.originalSize) * 100
        )
      : null;

  return (
    <div className="text-center py-6 animate-fade-in">
      {/* Success icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {toolName} Complete!
      </h3>
      <p className="text-gray-500 mb-6">Your file is ready to download</p>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 mb-8">
        {result.pageCount && (
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{result.pageCount}</p>
            <p className="text-xs text-gray-400">pages</p>
          </div>
        )}
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {formatFileSize(result.fileSize)}
          </p>
          <p className="text-xs text-gray-400">output size</p>
        </div>
        {compressionPercent !== null && (
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              -{compressionPercent}%
            </p>
            <p className="text-xs text-gray-400">size reduced</p>
          </div>
        )}
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {(result.processingTime / 1000).toFixed(1)}s
          </p>
          <p className="text-xs text-gray-400">processing time</p>
        </div>
      </div>

      {/* Compression before/after */}
      {result.originalSize && compressionPercent !== null && (
        <div className="max-w-sm mx-auto mb-8 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Before: {formatFileSize(result.originalSize)}
            </span>
            <ArrowDown className="w-4 h-4 text-green-500" />
            <span className="text-green-700 font-semibold">
              After: {formatFileSize(result.fileSize)}
            </span>
          </div>
        </div>
      )}

      {result.message && (
        <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg max-w-md mx-auto">
          {result.message}
        </p>
      )}

      {/* Download button */}
      <a
        href={result.downloadUrl}
        download={result.fileName}
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
      >
        <Download className="w-5 h-5" />
        Download {result.fileName}
      </a>

      {/* Process another */}
      <div className="mt-6">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Process another file
        </button>
      </div>

      {/* Auto-delete notice */}
      <p className="text-xs text-gray-400 mt-8">
        Files are automatically deleted after 2 hours for your security.
      </p>
    </div>
  );
}
