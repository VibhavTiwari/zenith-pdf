"use client";

import { Loader2 } from "lucide-react";

interface ProcessingProgressProps {
  progress: number;
  toolName: string;
}

export function ProcessingProgress({
  progress,
  toolName,
}: ProcessingProgressProps) {
  const messages = [
    "Uploading files...",
    "Preparing documents...",
    `Running ${toolName}...`,
    "Generating output...",
    "Almost done...",
  ];
  const messageIndex = Math.min(
    Math.floor(progress / 25),
    messages.length - 1
  );

  return (
    <div className="text-center py-8">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <svg className="w-20 h-20 animate-spin-slow" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="5"
          />
          <circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="#2563eb"
            strokeWidth="5"
            strokeDasharray={`${progress * 2.2} ${220 - progress * 2.2}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Processing your files
      </h3>
      <p className="text-gray-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {messages[messageIndex]}
      </p>

      {/* Progress bar */}
      <div className="mt-6 max-w-xs mx-auto">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 progress-shimmer" />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Please keep this tab open while we process your files
      </p>
    </div>
  );
}
