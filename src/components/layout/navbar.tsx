"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X, Zap } from "lucide-react";
import { CATEGORY_ORDER, CATEGORY_META, getToolsByCategory } from "@/lib/tools-registry";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Zenith<span className="text-blue-600">PDF</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors">
                All PDF Tools
                <ChevronDown className="w-4 h-4" />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1 w-[720px] bg-white rounded-xl border border-gray-200 shadow-xl p-6 grid grid-cols-3 gap-6">
                  {CATEGORY_ORDER.slice(0, 9).map((catKey) => {
                    const cat = CATEGORY_META[catKey];
                    const tools = getToolsByCategory(catKey).slice(0, 4);
                    return (
                      <div key={catKey}>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${cat.color} mb-2`}>
                          {cat.label}
                        </h4>
                        <div className="space-y-1">
                          {tools.map((tool) => (
                            <Link
                              key={tool.slug}
                              href={`/tools/${tool.slug}`}
                              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            >
                              {tool.name}
                              {!tool.implemented && (
                                <span className="px-1 py-0.5 bg-gray-100 text-gray-400 text-[9px] font-bold rounded uppercase leading-none">
                                  Soon
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/tools/compress-pdf"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Compress
            </Link>
            <Link
              href="/tools/merge-pdf"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Merge
            </Link>
            <Link
              href="/tools/split-pdf"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Split
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Log in
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Sign up free
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-2">
          {CATEGORY_ORDER.map((catKey) => {
            const cat = CATEGORY_META[catKey];
            const tools = getToolsByCategory(catKey);
            return (
              <div key={catKey} className="pb-3">
                <p className={`text-xs font-bold uppercase tracking-wider ${cat.color} mb-1`}>
                  {cat.label}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 py-1"
                    >
                      {tool.name}
                      {!tool.implemented && (
                        <span className="px-1 py-0.5 bg-gray-100 text-gray-400 text-[9px] font-bold rounded uppercase leading-none">
                          Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="pt-3 border-t border-gray-200 space-y-2">
            <Link href="/pricing" className="block text-sm font-medium text-gray-700">
              Pricing
            </Link>
            <button className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg">
              Sign up free
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
