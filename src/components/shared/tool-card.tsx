import Link from "next/link";
import { Crown } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools-registry";

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isPaid = tool.minTier !== "free";
  const isComingSoon = !tool.implemented;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="tool-card group block p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 relative"
    >
      {/* Badges — stacked top-right */}
      {(isPaid || isComingSoon) && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          {isComingSoon && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase">
              Soon
            </span>
          )}
          {isPaid && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase">
              <Crown className="w-2.5 h-2.5" />
              {tool.minTier === "pro" ? "Pro" : tool.minTier === "pro_ai" ? "AI" : "Plus"}
            </span>
          )}
        </div>
      )}
      <div
        className={`w-11 h-11 rounded-lg ${tool.color} flex items-center justify-center mb-3`}
      >
        <span className="text-white text-lg font-bold">
          {tool.name.charAt(0)}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
        {tool.name}
      </h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
        {tool.description}
      </p>
    </Link>
  );
}
