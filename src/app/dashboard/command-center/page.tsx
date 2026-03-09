"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { KPICard, KPICardSkeleton } from "@/components/dashboard/kpi-card";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { PageHeader } from "@/components/dashboard/page-header";
import type { CommandCenterResponse } from "@/types";

export default function CommandCenterPage() {
  const { data, isLoading, error } = useQuery<CommandCenterResponse>({
    queryKey: ["command-center"],
    queryFn: async () => {
      const res = await dashboardApi.getCommandCenter();
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader
        title="Command Center"
        subtitle="Daily overview — all KPIs at a glance"
        lastUpdated={data?.last_updated}
      />

      {/* AI Daily Diagnostic */}
      {data?.daily_diagnostic && (
        <div className="mb-6">
          <AIInsightCard
            title="🧠 AI Daily Diagnostic Brief"
            content={data.daily_diagnostic}
            type="diagnostic"
          />
        </div>
      )}

      {/* KPI Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Failed to load dashboard data. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.kpis.map((kpi) => (
            <KPICard key={kpi.metric_key} kpi={kpi} />
          ))}
        </div>
      )}

      {/* Alerts Section */}
      {data?.active_alerts && data.active_alerts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            🚨 Active Alerts
          </h2>
          <div className="space-y-2">
            {data.active_alerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                <span className="text-red-800">{alert}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
