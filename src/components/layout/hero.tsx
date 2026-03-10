"use client";

import { useState } from "react";
import { Search, ArrowRight, Shield, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { TOOLS } from "@/lib/tools-registry";

export function Hero() {
  const [search, setSearch] = useState("");

  const filteredTools = search.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 to-white pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span>10+ free PDF tools — no sign-up required</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
          Every PDF tool you{" "}
          <span className="text-gradient">need</span>
          <br />
          in one place
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Merge, split, compress, convert, protect, and edit PDFs online.
          Free, fast, and secure. No installation required.
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What do you need to do? (e.g., merge, compress, convert...)"
              className="w-full pl-12 pr-4 py-4 text-base bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>

          {/* Search results dropdown */}
          {filteredTools.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                  onClick={() => setSearch("")}
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${tool.color} flex items-center justify-center shrink-0`}
                  >
                    <span className="text-white text-sm font-bold">
                      {tool.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {tool.name}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {tool.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 ml-auto shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {[
            { label: "Merge PDF", slug: "merge-pdf", color: "bg-blue-500" },
            { label: "Compress PDF", slug: "compress-pdf", color: "bg-emerald-500" },
            { label: "Split PDF", slug: "split-pdf", color: "bg-blue-400" },
            { label: "PDF to Images", slug: "pdf-to-images", color: "bg-orange-500" },
            { label: "Protect PDF", slug: "protect-pdf", color: "bg-red-500" },
            { label: "Watermark", slug: "watermark-pdf", color: "bg-red-500" },
          ].map((item) => (
            <Link
              key={item.slug}
              href={`/tools/${item.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all"
            >
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">Secure</p>
              <p className="text-xs text-gray-500">256-bit TLS encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">Fast</p>
              <p className="text-xs text-gray-500">Process files in seconds</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-end">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">Private</p>
              <p className="text-xs text-gray-500">Auto-delete in 2 hours</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
