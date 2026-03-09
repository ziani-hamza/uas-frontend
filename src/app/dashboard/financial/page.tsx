"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { KPICard, KPICardSkeleton } from "@/components/dashboard/kpi-card";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { PageHeader } from "@/components/dashboard/page-header";
import type { FinancialMetricsResponse } from "@/types";

export default function FinancialPage() {
  const { data, isLoading } = useQuery<FinancialMetricsResponse>({
    queryKey: ["financial"],
    queryFn: async () => {
      const res = await dashboardApi.getFinancial();
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader
        title="Financial"
        subtitle="Revenue, expenses, profit margin, and P&L insights"
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

      {/* P&L Anomaly AI */}
      {data?.pnl_anomaly_insight && (
        <div className="mt-6">
          <AIInsightCard
            title="💰 Weekly P&L Anomaly Report"
            content={data.pnl_anomaly_insight}
            type="financial"
          />
        </div>
      )}

      {/* Revenue by Service */}
      {data?.revenue_by_service && data.revenue_by_service.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue by Service
          </h2>
          <div className="space-y-3">
            {data.revenue_by_service.map((svc, i) => {
              const maxRevenue = Math.max(
                ...data.revenue_by_service!.map((s) => s.revenue)
              );
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">
                      {svc.service}
                    </span>
                    <span className="text-gray-900 font-semibold">
                      ${svc.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full transition-all"
                      style={{
                        width: `${(svc.revenue / maxRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expense Breakdown */}
      {data?.expense_categories && data.expense_categories.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Expense Breakdown
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-left">
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium text-right">
                    Amount MTD
                  </th>
                  <th className="px-6 py-3 font-medium text-right">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.expense_categories.map((exp, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {exp.category}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-900">
                      ${exp.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-500">
                      {exp.percentage.toFixed(1)}%
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
