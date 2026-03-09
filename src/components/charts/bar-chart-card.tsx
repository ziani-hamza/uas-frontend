"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarChartCardProps {
  title: string;
  data: Array<Record<string, string | number>>;
  dataKey: string;
  xKey?: string;
  color?: string;
  secondaryDataKey?: string;
  secondaryColor?: string;
  height?: number;
}

export function BarChartCard({
  title,
  data,
  dataKey,
  xKey = "name",
  color = "#2563eb",
  secondaryDataKey,
  secondaryColor = "#10b981",
  height = 300,
}: BarChartCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          {secondaryDataKey && <Legend />}
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          {secondaryDataKey && (
            <Bar
              dataKey={secondaryDataKey}
              fill={secondaryColor}
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
