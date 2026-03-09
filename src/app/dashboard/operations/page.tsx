"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { KPICard, KPICardSkeleton } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import type { OperationsMetricsResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function OperationsPage() {
  const { data, isLoading } = useQuery<OperationsMetricsResponse>({
    queryKey: ["operations"],
    queryFn: async () => {
      const res = await dashboardApi.getOperations();
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader
        title="Operations"
        subtitle="Bay utilization, jobs completed, tech efficiency, and scheduling"
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

      {/* Bay Utilization Grid */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Bay Status — Today
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.bays?.map((bay, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg border-2 p-4",
                bay.status === "occupied"
                  ? "border-green-300 bg-green-50"
                  : bay.status === "scheduled"
                  ? "border-yellow-300 bg-yellow-50"
                  : "border-gray-200 bg-gray-50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{bay.name}</h3>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    bay.status === "occupied" &&
                      "bg-green-200 text-green-800",
                    bay.status === "scheduled" &&
                      "bg-yellow-200 text-yellow-800",
                    bay.status === "available" &&
                      "bg-gray-200 text-gray-600"
                  )}
                >
                  {bay.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {bay.current_job || "No active job"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Utilization: {bay.utilization_pct}%
              </p>
            </div>
          )) || (
            <p className="col-span-full text-center text-gray-400 py-6">
              Bay data will appear once TintWiz is connected.
            </p>
          )}
        </div>
      </div>

      {/* Technician Efficiency Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Technician Efficiency
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="px-6 py-3 font-medium">Technician</th>
                <th className="px-6 py-3 font-medium text-right">Jobs MTD</th>
                <th className="px-6 py-3 font-medium text-right">
                  Revenue MTD
                </th>
                <th className="px-6 py-3 font-medium text-right">
                  Avg Duration Variance
                </th>
                <th className="px-6 py-3 font-medium text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.technicians?.map((tech, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {tech.name}
                  </td>
                  <td className="px-6 py-3 text-right">{tech.jobs_mtd}</td>
                  <td className="px-6 py-3 text-right text-gray-900">
                    ${tech.revenue_mtd.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span
                      className={
                        tech.avg_duration_variance <= 10
                          ? "text-green-600"
                          : tech.avg_duration_variance <= 25
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {tech.avg_duration_variance > 0 ? "+" : ""}
                      {tech.avg_duration_variance}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {"⭐".repeat(Math.round(tech.rating))}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No technician data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
