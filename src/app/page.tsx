import { Hero } from "@/components/layout/hero";
import { ToolCard } from "@/components/shared/tool-card";
import {
  CATEGORY_ORDER,
  CATEGORY_META,
  getToolsByCategory,
} from "@/lib/tools-registry";
import { FileText, Users, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Tool Grid by Category */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            All PDF Tools
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Everything you need to work with PDFs, organized by what you want to
            do.
          </p>
        </div>

        <div className="space-y-12">
          {CATEGORY_ORDER.map((catKey) => {
            const cat = CATEGORY_META[catKey];
            const tools = getToolsByCategory(catKey);
            return (
              <div key={catKey}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-1 h-6 rounded-full bg-gradient-to-b ${cat.gradient}`}
                  />
                  <div>
                    <h3 className={`text-lg font-bold ${cat.color}`}>
                      {cat.label}
                    </h3>
                    <p className="text-sm text-gray-500">{cat.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-violet-600 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-4xl font-extrabold">30+</p>
              <p className="text-blue-200 text-sm mt-1">PDF Tools</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">256-bit</p>
              <p className="text-blue-200 text-sm mt-1">TLS Encryption</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">2hr</p>
              <p className="text-blue-200 text-sm mt-1">Auto-delete</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">Free</p>
              <p className="text-blue-200 text-sm mt-1">No Sign-up Needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Upload your files",
              desc: "Drag and drop your PDF or select files from your computer. We accept PDFs and images.",
            },
            {
              step: "2",
              title: "Choose your settings",
              desc: "Configure the tool options to get exactly the result you need. Smart defaults are pre-selected.",
            },
            {
              step: "3",
              title: "Download the result",
              desc: "Your processed file is ready in seconds. Download it instantly — files auto-delete after 2 hours.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-extrabold text-blue-600">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gray-900 rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join thousands of users who trust Zenith PDF for their document
            workflows. Start for free — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tools/merge-pdf"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
