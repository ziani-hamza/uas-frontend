"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { KPICard, KPICardSkeleton } from "@/components/dashboard/kpi-card";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { PageHeader } from "@/components/dashboard/page-header";
import type { SalesMetricsResponse } from "@/types";

export default function SalesPage() {
  const { data, isLoading } = useQuery<SalesMetricsResponse>({
    queryKey: ["sales"],
    queryFn: async () => {
      const res = await dashboardApi.getSales();
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader
        title="Sales"
        subtitle="Pipeline health, close rates, speed-to-lead, and call grading"
        lastUpdated={data?.last_updated}
      />

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.kpis.map((kpi) => (
            <KPICard key={kpi.metric_key} kpi={kpi} />
          ))}
        </div>
      )}

      {/* Call Coaching AI */}
      {data?.call_coaching_insight && (
        <div className="mt-6">
          <AIInsightCard
            title="📞 AI Call Coaching Insight"
            content={data.call_coaching_insight}
            type="coaching"
          />
        </div>
      )}

      {/* Recent Graded Calls */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Graded Calls
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium text-right">
                  Overall Score
                </th>
                <th className="px-6 py-3 font-medium text-right">
                  Close Attempt
                </th>
                <th className="px-6 py-3 font-medium text-right">
                  Needs Analysis
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.recent_calls?.map((call, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(call.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {call.contact_name}
                  </td>
                  <td className="px-6 py-3 text-gray-500">{call.duration}</td>
                  <td className="px-6 py-3 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        call.overall_score >= 80
                          ? "bg-green-100 text-green-700"
                          : call.overall_score >= 60
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {call.overall_score}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-gray-600">
                    {call.close_attempt_score}%
                  </td>
                  <td className="px-6 py-3 text-right text-gray-600">
                    {call.needs_analysis_score}%
                  </td>
                </tr>
              )) || (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No graded calls yet. Call grading activates once GHL recordings
                    sync.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pipeline Stages */}
      {data?.pipeline_stages && data.pipeline_stages.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pipeline Stages
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {data.pipeline_stages.map((stage, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-40 bg-gray-50 rounded-lg p-4 text-center"
              >
                <p className="text-2xl font-bold text-gray-900">
                  {stage.count}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stage.name}</p>
                <p className="text-xs text-brand-600 font-medium mt-1">
                  ${stage.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
