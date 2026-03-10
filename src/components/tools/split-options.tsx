"use client";

import { useState } from "react";

interface SplitOptionsProps {
  files: { name: string }[];
  onProcess: (options?: Record<string, unknown>) => void;
}

export function SplitOptions({ files, onProcess }: SplitOptionsProps) {
  const [mode, setMode] = useState<"ranges" | "single-pages">("ranges");
  const [ranges, setRanges] = useState("");

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Split Mode</h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setMode("ranges")}
          className={`p-4 rounded-xl border-2 text-left transition-colors ${
            mode === "ranges"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="font-semibold text-sm text-gray-900">By Page Range</p>
          <p className="text-xs text-gray-500 mt-1">
            Extract specific pages (e.g., 1-3, 5, 7-10)
          </p>
        </button>
        <button
          onClick={() => setMode("single-pages")}
          className={`p-4 rounded-xl border-2 text-left transition-colors ${
            mode === "single-pages"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="font-semibold text-sm text-gray-900">
            Individual Pages
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Split every page into a separate PDF
          </p>
        </button>
      </div>

      {mode === "ranges" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Ranges
          </label>
          <input
            type="text"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="e.g., 1-3, 5, 7-10"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Leave empty to split in half. Use commas to separate ranges.
          </p>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => onProcess({ mode, ranges })}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
        >
          Split PDF
        </button>
      </div>
    </div>
  );
}
