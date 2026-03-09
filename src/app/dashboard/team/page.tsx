"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { KPICard, KPICardSkeleton } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import type { TeamPerformanceResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function TeamPage() {
  const { data, isLoading } = useQuery<TeamPerformanceResponse>({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await dashboardApi.getTeam();
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader
        title="Team Performance"
        subtitle="Individual performance tracking and leaderboards"
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

      {/* Technician Leaderboard */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            🏆 Technician Leaderboard
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {data?.leaderboard?.map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  i === 0
                    ? "bg-yellow-100 text-yellow-700"
                    : i === 1
                    ? "bg-gray-100 text-gray-600"
                    : i === 2
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-50 text-gray-400"
                )}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{tech.name}</p>
                <p className="text-xs text-gray-500">{tech.role}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${tech.revenue_mtd.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {tech.jobs_completed} jobs
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {tech.efficiency_score}%
                </p>
                <p className="text-xs text-gray-400">efficiency</p>
              </div>
            </div>
          )) || (
            <div className="px-6 py-8 text-center text-gray-400">
              Team performance data will appear once jobs are synced.
            </div>
          )}
        </div>
      </div>

      {/* Sales Rep Performance */}
      {data?.sales_reps && data.sales_reps.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Sales Rep Performance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-left">
                  <th className="px-6 py-3 font-medium">Rep</th>
                  <th className="px-6 py-3 font-medium text-right">
                    Calls Made
                  </th>
                  <th className="px-6 py-3 font-medium text-right">
                    Avg Call Score
                  </th>
                  <th className="px-6 py-3 font-medium text-right">
                    Close Rate
                  </th>
                  <th className="px-6 py-3 font-medium text-right">
                    Revenue MTD
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.sales_reps.map((rep, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {rep.name}
                    </td>
                    <td className="px-6 py-3 text-right">{rep.calls_made}</td>
                    <td className="px-6 py-3 text-right">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold",
                          rep.avg_call_score >= 80
                            ? "bg-green-100 text-green-700"
                            : rep.avg_call_score >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {rep.avg_call_score}%
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {rep.close_rate}%
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-gray-900">
                      ${rep.revenue_mtd.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
