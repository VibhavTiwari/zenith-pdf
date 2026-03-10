"use client";

import { useState } from "react";
import { Crown } from "lucide-react";

interface CompressOptionsProps {
  files: { name: string }[];
  onProcess: (options?: Record<string, unknown>) => void;
}

export function CompressOptions({ files, onProcess }: CompressOptionsProps) {
  const [level, setLevel] = useState<"basic" | "strong">("basic");

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Compression Level
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setLevel("basic")}
          className={`p-5 rounded-xl border-2 text-left transition-colors ${
            level === "basic"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="font-semibold text-gray-900">Basic</p>
          <p className="text-xs text-gray-500 mt-1">
            Good compression with high quality preservation
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-2">
            2 credits/page
          </p>
        </button>
        <button
          onClick={() => setLevel("strong")}
          className={`p-5 rounded-xl border-2 text-left transition-colors relative ${
            level === "strong"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
            <Crown className="w-2.5 h-2.5" />
            PRO
          </span>
          <p className="font-semibold text-gray-900">Strong</p>
          <p className="text-xs text-gray-500 mt-1">
            Maximum compression for smallest file size
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-2">
            3.5 credits/page
          </p>
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={() => onProcess({ level })}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
        >
          Compress PDF
        </button>
      </div>
    </div>
  );
}
