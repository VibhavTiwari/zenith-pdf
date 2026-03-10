"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ProtectOptionsProps {
  files: { name: string }[];
  onProcess: (options?: Record<string, unknown>) => void;
}

export function ProtectOptions({ files, onProcess }: ProtectOptionsProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isValid = password.length >= 4 && passwordsMatch;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Password Protection
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (min 4 characters)"
              className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {password.length > 0 && password.length < 4 && (
            <p className="text-xs text-red-500 mt-1">
              Password must be at least 4 characters
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-xs text-red-500 mt-1">
              Passwords do not match
            </p>
          )}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => onProcess({ password })}
          disabled={!isValid}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Protect PDF
        </button>
      </div>
    </div>
  );
}
