"use client";

import { useState } from "react";

interface PageNumbersOptionsProps {
  files: { name: string }[];
  onProcess: (options?: Record<string, unknown>) => void;
}

export function PageNumbersOptions({ files, onProcess }: PageNumbersOptionsProps) {
  const [position, setPosition] = useState("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [format, setFormat] = useState("{n}");
  const [fontSize, setFontSize] = useState(11);

  const positions = [
    { value: "top-left", label: "Top Left" },
    { value: "top-center", label: "Top Center" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-center", label: "Bottom Center" },
    { value: "bottom-right", label: "Bottom Right" },
  ];

  const formats = [
    { value: "{n}", label: "1, 2, 3..." },
    { value: "Page {n}", label: "Page 1, Page 2..." },
    { value: "{n} of {total}", label: "1 of 10, 2 of 10..." },
    { value: "Page {n} of {total}", label: "Page 1 of 10..." },
    { value: "- {n} -", label: "- 1 -, - 2 -..." },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Page Number Settings
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Position
          </label>
          <div className="grid grid-cols-3 gap-2">
            {positions.map((pos) => (
              <button
                key={pos.value}
                onClick={() => setPosition(pos.value)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-colors ${
                  position === pos.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {formats.map((fmt) => (
              <button
                key={fmt.value}
                onClick={() => setFormat(fmt.value)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-colors ${
                  format === fmt.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start Number
            </label>
            <input
              type="number"
              value={startNumber}
              onChange={(e) => setStartNumber(Math.max(1, Number(e.target.value)))}
              min={1}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Font Size ({fontSize}pt)
            </label>
            <input
              type="range"
              min={8}
              max={24}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-blue-600 mt-2"
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() =>
            onProcess({ position, startNumber, format, fontSize })
          }
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
        >
          Add Page Numbers
        </button>
      </div>
    </div>
  );
}
