"use client";

import type { UploadedFile } from "@/components/shared/file-uploader";
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

interface MergeOptionsProps {
  files: UploadedFile[];
  onProcess: (options?: Record<string, unknown>) => void;
}

export function MergeOptions({ files, onProcess }: MergeOptionsProps) {
  const [fileOrder, setFileOrder] = useState<UploadedFile[]>(files);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...fileOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setFileOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === fileOrder.length - 1) return;
    const newOrder = [...fileOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setFileOrder(newOrder);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">File Order</h3>
      <p className="text-xs text-gray-500 mb-4">
        Drag or use arrows to reorder. Files will be merged in this order.
      </p>

      <div className="space-y-2 mb-6">
        {fileOrder.map((file, index) => (
          <div
            key={file.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
            <span className="w-6 h-6 bg-blue-100 text-blue-700 text-xs font-bold rounded flex items-center justify-center">
              {index + 1}
            </span>
            <span className="flex-1 text-sm text-gray-700 truncate">
              {file.name}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ArrowUp className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === fileOrder.length - 1}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ArrowDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => onProcess({})}
          disabled={fileOrder.length < 2}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Merge {fileOrder.length} Files
        </button>
        {fileOrder.length < 2 && (
          <p className="text-xs text-red-500 mt-2">
            Add at least 2 files to merge
          </p>
        )}
      </div>
    </div>
  );
}
