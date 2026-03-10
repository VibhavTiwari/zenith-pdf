"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";

interface RotateOptionsProps {
  files: { name: string }[];
  onProcess: (options?: Record<string, unknown>) => void;
}

export function RotateOptions({ files, onProcess }: RotateOptionsProps) {
  const [angle, setAngle] = useState(90);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Rotation Angle
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { value: 90, label: "90° Right" },
          { value: 180, label: "180°" },
          { value: 270, label: "90° Left" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setAngle(opt.value)}
            className={`p-4 rounded-xl border-2 text-center transition-colors ${
              angle === opt.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <RotateCw
              className={`w-6 h-6 mx-auto mb-2 ${
                angle === opt.value ? "text-blue-600" : "text-gray-400"
              }`}
              style={{
                transform: `rotate(${opt.value === 270 ? -90 : opt.value}deg)`,
              }}
            />
            <p className="font-semibold text-sm text-gray-900">{opt.label}</p>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mb-6 text-center">
        All pages will be rotated. Page-by-page rotation is coming soon.
      </p>

      <div className="text-center">
        <button
          onClick={() => onProcess({ angle })}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
        >
          Rotate Pages
        </button>
      </div>
    </div>
  );
}
