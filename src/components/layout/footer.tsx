import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  "PDF Tools": [
    { label: "Merge PDF", href: "/tools/merge-pdf" },
    { label: "Split PDF", href: "/tools/split-pdf" },
    { label: "Compress PDF", href: "/tools/compress-pdf" },
    { label: "Rotate PDF", href: "/tools/rotate-pdf" },
    { label: "Watermark PDF", href: "/tools/watermark-pdf" },
    { label: "Protect PDF", href: "/tools/protect-pdf" },
  ],
  Convert: [
    { label: "PDF to Images", href: "/tools/pdf-to-images" },
    { label: "Images to PDF", href: "/tools/images-to-pdf" },
    { label: "PDF to Word", href: "/tools/pdf-to-word" },
    { label: "PDF to Excel", href: "/tools/pdf-to-excel" },
    { label: "HTML to PDF", href: "/tools/html-to-pdf" },
  ],
  Company: [
    { label: "Pricing", href: "/pricing" },
    { label: "API Documentation", href: "#" },
    { label: "Error Codes", href: "/error-codes" },
    { label: "Status", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Zenith<span className="text-blue-600">PDF</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Every PDF tool you need in one place. Free, fast, and secure.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Zenith PDF. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              Files auto-deleted after 2 hours
            </span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-gray-400">
              256-bit TLS encryption
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
