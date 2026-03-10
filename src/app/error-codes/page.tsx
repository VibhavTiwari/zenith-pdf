import { ERROR_CATEGORIES } from "@/lib/errors";
import type { ZenithError } from "@/lib/errors";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const statusColors: Record<string, string> = {
  "200": "bg-green-100 text-green-700",
  "202": "bg-blue-100 text-blue-700",
  "207": "bg-amber-100 text-amber-700",
  "400": "bg-red-100 text-red-700",
  "401": "bg-orange-100 text-orange-700",
  "402": "bg-amber-100 text-amber-700",
  "403": "bg-red-100 text-red-700",
  "404": "bg-gray-100 text-gray-700",
  "408": "bg-yellow-100 text-yellow-700",
  "409": "bg-purple-100 text-purple-700",
  "410": "bg-gray-100 text-gray-700",
  "413": "bg-orange-100 text-orange-700",
  "415": "bg-red-100 text-red-700",
  "422": "bg-red-100 text-red-700",
  "429": "bg-amber-100 text-amber-700",
  "499": "bg-gray-100 text-gray-700",
  "500": "bg-red-100 text-red-700",
  "502": "bg-red-100 text-red-700",
  "503": "bg-amber-100 text-amber-700",
  "504": "bg-red-100 text-red-700",
  "507": "bg-red-100 text-red-700",
};

export default function ErrorCodesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Home
      </Link>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
        Error Taxonomy
      </h1>
      <p className="text-lg text-gray-600 mb-4 max-w-3xl">
        Complete reference of all error codes, messages, and resolution hints
        used across the Zenith PDF platform and API. Each error includes a
        unique code, user-facing message, and actionable guidance.
      </p>
      <p className="text-sm text-gray-500 mb-10">
        API consumers receive the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">code</code> and{" "}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">message</code> fields.
        The web UI additionally shows the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">hint</code> with contextual resolution steps.
        Template variables like <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">{"{fileName}"}</code> are
        replaced at runtime.
      </p>

      {/* Table of Contents */}
      <div className="mb-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
          Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ERROR_CATEGORIES.map((cat) => {
            const errorCount = Object.keys(cat.errors).length;
            return (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {cat.label}
                </span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {errorCount}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Error Categories */}
      <div className="space-y-12">
        {ERROR_CATEGORIES.map((category) => (
          <section key={category.id} id={category.id}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {category.label}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {category.description}
              </p>
            </div>

            <div className="space-y-4">
              {Object.values(category.errors).map((error: ZenithError) => (
                <div
                  key={error.code}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200">
                    <code className="text-sm font-mono font-bold text-gray-900">
                      {error.code}
                    </code>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        statusColors[String(error.httpStatus)] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {error.httpStatus}
                    </span>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Message
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        {error.message}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Resolution Hint
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {error.hint}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mt-16 p-8 bg-gray-900 rounded-2xl text-center">
        <h3 className="text-white text-xl font-bold mb-6">
          Error Taxonomy Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-extrabold text-white">
              {ERROR_CATEGORIES.length}
            </p>
            <p className="text-gray-400 text-sm">Categories</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">
              {ERROR_CATEGORIES.reduce(
                (sum, cat) => sum + Object.keys(cat.errors).length,
                0
              )}
            </p>
            <p className="text-gray-400 text-sm">Total Error Codes</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">100%</p>
            <p className="text-gray-400 text-sm">Coverage</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">
              {new Set(
                ERROR_CATEGORIES.flatMap((cat) =>
                  Object.values(cat.errors).map((e: ZenithError) => e.httpStatus)
                )
              ).size}
            </p>
            <p className="text-gray-400 text-sm">HTTP Status Codes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
