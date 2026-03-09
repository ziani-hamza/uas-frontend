"use client";

import { cn, getThresholdBg } from "@/lib/utils";
import type { KPICard as KPICardType } from "@/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  kpi: KPICardType;
}

export function KPICard({ kpi }: KPICardProps) {
  const TrendIcon =
    kpi.trend_direction === "up"
      ? TrendingUp
      : kpi.trend_direction === "down"
      ? TrendingDown
      : Minus;

  return (
    <div
      className={cn(
        "rounded-xl border-l-4 bg-white p-5 shadow-sm hover:shadow-md transition-shadow",
        getThresholdBg(kpi.threshold_status)
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            {kpi.display_name}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {kpi.formatted_value}
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            kpi.threshold_status === "green" && "bg-green-100 text-green-700",
            kpi.threshold_status === "yellow" && "bg-yellow-100 text-yellow-700",
            kpi.threshold_status === "red" && "bg-red-100 text-red-700",
            kpi.threshold_status === "grey" && "bg-gray-100 text-gray-500"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          <span className="capitalize">{kpi.threshold_status}</span>
        </div>
      </div>

      {kpi.trend_value !== undefined && (
        <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
          <TrendIcon size={14} />
          <span>
            {kpi.trend_value > 0 ? "+" : ""}
            {kpi.trend_value.toFixed(1)}% vs. prior period
          </span>
        </div>
      )}
    </div>
  );
}

export function KPICardSkeleton() {
  return (
    <div className="rounded-xl border-l-4 border-gray-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
      <div className="h-8 w-24 bg-gray-200 rounded" />
    </div>
  );
}
