"use client";

import { useState } from "react";

interface WatermarkOptionsProps {
  files: { name: string }[];
  onProcess: (options?: Record<string, unknown>) => void;
}

export function WatermarkOptions({ files, onProcess }: WatermarkOptionsProps) {
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(15);
  const [rotation, setRotation] = useState(-45);
  const [fontSize, setFontSize] = useState(60);
  const [color, setColor] = useState("#888888");

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Watermark Settings
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Watermark Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={100}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Opacity ({opacity}%)
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Font Size ({fontSize}px)
            </label>
            <input
              type="range"
              min={12}
              max={120}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Rotation ({rotation}°)
            </label>
            <input
              type="range"
              min={-90}
              max={90}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{color}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-6 p-8 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
        <span
          style={{
            fontSize: `${Math.min(fontSize, 40)}px`,
            opacity: opacity / 100,
            transform: `rotate(${rotation}deg)`,
            color: color,
            fontWeight: "bold",
          }}
        >
          {text || "WATERMARK"}
        </span>
      </div>

      <div className="text-center">
        <button
          onClick={() =>
            onProcess({
              text,
              opacity: opacity / 100,
              rotation,
              fontSize,
              color,
            })
          }
          disabled={!text.trim()}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-50"
        >
          Add Watermark
        </button>
      </div>
    </div>
  );
}
