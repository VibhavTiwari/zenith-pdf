"use client";

import { useState } from "react";

interface MetadataOptionsProps {
  files: { name: string }[];
  onProcess: (options?: Record<string, unknown>) => void;
}

export function MetadataOptions({ files, onProcess }: MetadataOptionsProps) {
  const [action, setAction] = useState<"edit" | "clear">("edit");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Metadata Action
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setAction("edit")}
          className={`p-4 rounded-xl border-2 text-left transition-colors ${
            action === "edit"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="font-semibold text-sm text-gray-900">Edit Metadata</p>
          <p className="text-xs text-gray-500 mt-1">
            Set title, author, subject, and keywords
          </p>
        </button>
        <button
          onClick={() => setAction("clear")}
          className={`p-4 rounded-xl border-2 text-left transition-colors ${
            action === "clear"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="font-semibold text-sm text-gray-900">
            Clear All Metadata
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Remove all metadata for privacy
          </p>
        </button>
      </div>

      {action === "edit" && (
        <div className="space-y-3 mb-6">
          {[
            { label: "Title", value: title, set: setTitle },
            { label: "Author", value: author, set: setAuthor },
            { label: "Subject", value: subject, set: setSubject },
            {
              label: "Keywords (comma-separated)",
              value: keywords,
              set: setKeywords,
            },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() =>
            onProcess({ action, title, author, subject, keywords })
          }
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
        >
          {action === "clear" ? "Clear Metadata" : "Update Metadata"}
        </button>
      </div>
    </div>
  );
}
