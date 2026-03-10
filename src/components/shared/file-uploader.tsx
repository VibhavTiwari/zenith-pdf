"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, FileText, Image, File } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface FileUploaderProps {
  acceptedTypes: string[];
  multiFile: boolean;
  maxFiles: number;
  maxSizeMB?: number;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

function getFileIcon(type: string) {
  if (type === "application/pdf") return <FileText className="w-5 h-5 text-red-500" />;
  if (type.startsWith("image/")) return <Image className="w-5 h-5 text-blue-500" />;
  return <File className="w-5 h-5 text-gray-500" />;
}

export function FileUploader({
  acceptedTypes,
  multiFile,
  maxFiles,
  maxSizeMB = 100,
  files,
  onFilesChange,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptString = acceptedTypes.join(",");

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles);
      const mapped: UploadedFile[] = arr
        .filter((f) => {
          const ext = `.${f.name.split(".").pop()?.toLowerCase()}`;
          return acceptedTypes.includes(ext);
        })
        .map((f) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file: f,
          name: f.name,
          size: f.size,
          type: f.type,
        }));

      if (!multiFile) {
        onFilesChange(mapped.slice(0, 1));
      } else {
        const combined = [...files, ...mapped].slice(0, maxFiles);
        onFilesChange(combined);
      }
    },
    [files, multiFile, maxFiles, acceptedTypes, onFilesChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      onFilesChange(files.filter((f) => f.id !== id));
    },
    [files, onFilesChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
          isDragging
            ? "dropzone-active border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptString}
          multiple={multiFile}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              isDragging ? "bg-blue-100" : "bg-gray-100"
            )}
          >
            <Upload
              className={cn(
                "w-7 h-7 transition-colors",
                isDragging ? "text-blue-600" : "text-gray-400"
              )}
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or{" "}
              <span className="text-blue-600 font-medium hover:underline">
                browse files
              </span>
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {acceptedTypes.join(", ").toUpperCase()} — Max{" "}
            {maxSizeMB}MB per file
            {multiFile && ` — Up to ${maxFiles} files`}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, index) => (
            <div
              key={f.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {getFileIcon(f.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {f.name}
                </p>
                <p className="text-xs text-gray-400">
                  {formatFileSize(f.size)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(f.id);
                }}
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
          {multiFile && files.length < maxFiles && (
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full p-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              + Add more files ({files.length}/{maxFiles})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
