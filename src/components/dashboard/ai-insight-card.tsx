"use client";

import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  title: string;
  content: string | null;
  type?: "diagnostic" | "coaching" | "financial";
}

export function AIInsightCard({ title, content, type = "diagnostic" }: AIInsightCardProps) {
  if (!content) return null;

  const borderColor =
    type === "diagnostic"
      ? "border-brand-500"
      : type === "coaching"
      ? "border-purple-500"
      : "border-emerald-500";

  return (
    <div
      className={cn(
        "rounded-xl border-l-4 bg-blue-50/50 p-5 shadow-sm",
        borderColor
      )}
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
