"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { KPICard, KPICardSkeleton } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import type { MarketingMetricsResponse } from "@/types";

export default function MarketingPage() {
  const { data, isLoading } = useQuery<MarketingMetricsResponse>({
    queryKey: ["marketing"],
    queryFn: async () => {
      const res = await dashboardApi.getMarketing();
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader
        title="Marketing"
        subtitle="Ad spend, CPL, ROAS, and campaign performance"
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

      {/* Campaign Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Campaign Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="px-6 py-3 font-medium">Campaign</th>
                <th className="px-6 py-3 font-medium">Source</th>
                <th className="px-6 py-3 font-medium text-right">Spend</th>
                <th className="px-6 py-3 font-medium text-right">Leads</th>
                <th className="px-6 py-3 font-medium text-right">CPL</th>
                <th className="px-6 py-3 font-medium text-right">Conv.</th>
                <th className="px-6 py-3 font-medium text-right">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.campaigns?.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {c.name}
                  </td>
                  <td className="px-6 py-3 text-gray-500">{c.source}</td>
                  <td className="px-6 py-3 text-right text-gray-900">
                    ${c.spend.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right">{c.leads}</td>
                  <td className="px-6 py-3 text-right">
                    ${c.cpl.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right">{c.conversions}</td>
                  <td className="px-6 py-3 text-right font-semibold">
                    {c.roas.toFixed(2)}x
                  </td>
                </tr>
              )) || (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No campaign data yet. Connect Hyros to see attribution.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel Breakdown */}
      {data?.channel_breakdown && data.channel_breakdown.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Spend by Channel
          </h2>
          <div className="space-y-3">
            {data.channel_breakdown.map((ch, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{ch.channel}</span>
                  <span className="text-gray-900 font-medium">
                    ${ch.spend.toLocaleString()} · CPL ${ch.cpl.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (ch.spend / (data.channel_breakdown?.[0]?.spend || 1)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
