"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationsApi, settingsApi } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import type { IntegrationStatus } from "@/types";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
} from "lucide-react";
import { useState, useRef } from "react";

export default function SettingsPage() {
  const queryClient = useQueryClient();

  /* ── Integration Status ── */
  const { data: integrations } = useQuery<IntegrationStatus[]>({
    queryKey: ["integrations-status"],
    queryFn: async () => {
      const res = await integrationsApi.getStatus();
      return res.data;
    },
  });

  /* ── Thresholds ── */
  const { data: thresholds } = useQuery({
    queryKey: ["thresholds"],
    queryFn: async () => {
      const res = await settingsApi.getThresholds();
      return res.data as Array<{
        id: number;
        metric_key: string;
        display_name: string;
        green_min: number;
        yellow_min: number;
        red_below: number;
        location_id: string;
      }>;
    },
  });

  const updateThreshold = useMutation({
    mutationFn: async ({
      metric_key,
      location_id,
      values,
    }: {
      metric_key: string;
      location_id: string;
      values: { green_min: number; yellow_min: number; red_below: number };
    }) =>
      settingsApi.updateThreshold({
        metric_key,
        location_id,
        ...values,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["thresholds"] }),
  });

  /* ── CSV Upload ── */
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    try {
      await integrationsApi.uploadTintWizCSV(file);
      setUploadMsg("✅ CSV imported successfully!");
    } catch {
      setUploadMsg("❌ Failed to import CSV. Check the format.");
    } finally {
      setUploading(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === "connected")
      return <CheckCircle size={18} className="text-green-500" />;
    if (status === "error")
      return <XCircle size={18} className="text-red-500" />;
    return <AlertTriangle size={18} className="text-yellow-500" />;
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Integrations, thresholds, and system configuration"
      />

      {/* Integration Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Integration Status
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {integrations?.map((intg, i) => (
            <div
              key={intg.integration_name}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-3">
                {statusIcon(intg.status)}
                <div>
                  <p className="font-medium text-gray-900">{intg.integration_name}</p>
                  <p className="text-xs text-gray-500">
                    Last sync:{" "}
                    {intg.last_sync_at
                      ? new Date(intg.last_sync_at).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full capitalize",
                  intg.status === "connected" &&
                    "bg-green-100 text-green-700",
                  intg.status === "error" && "bg-red-100 text-red-700",
                  intg.status === "disconnected" &&
                    "bg-yellow-100 text-yellow-700"
                )}
              >
                {intg.status}
              </span>
            </div>
          )) || (
            <p className="px-6 py-6 text-center text-gray-400">
              Loading integrations...
            </p>
          )}
        </div>
      </div>

      {/* TintWiz CSV Upload */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          TintWiz CSV Import
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload a TintWiz job export CSV to backfill job and operations data.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition text-sm font-medium disabled:opacity-50"
          >
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload CSV"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
          {uploadMsg && (
            <span className="text-sm text-gray-600">{uploadMsg}</span>
          )}
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            KPI Thresholds
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Adjust the green/yellow/red boundaries for each metric.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="px-6 py-3 font-medium">Metric</th>
                <th className="px-6 py-3 font-medium text-center">
                  🟢 Green ≥
                </th>
                <th className="px-6 py-3 font-medium text-center">
                  🟡 Yellow ≥
                </th>
                <th className="px-6 py-3 font-medium text-center">
                  🔴 Red &lt;
                </th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {thresholds?.map((t) => (
                <ThresholdRow
                  key={t.id}
                  threshold={t}
                  onSave={(values) =>
                    updateThreshold.mutate({
                      metric_key: t.metric_key,
                      location_id: t.location_id,
                      values,
                    })
                  }
                />
              )) || (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Loading thresholds...
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

/* ── Inline Threshold Row Editor ── */
function ThresholdRow({
  threshold,
  onSave,
}: Readonly<{
  threshold: {
    id: number;
    metric_key: string;
    display_name: string;
    green_min: number;
    yellow_min: number;
    red_below: number;
    location_id: string;
  };
  onSave: (values: {
    green_min: number;
    yellow_min: number;
    red_below: number;
  }) => void;
}>) {
  const [green, setGreen] = useState(threshold.green_min);
  const [yellow, setYellow] = useState(threshold.yellow_min);
  const [red, setRed] = useState(threshold.red_below);
  const [dirty, setDirty] = useState(false);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-3 font-medium text-gray-900">
        {threshold.display_name}
      </td>
      <td className="px-6 py-3 text-center">
        <input
          type="number"
          value={green}
          onChange={(e) => {
            setGreen(+e.target.value);
            setDirty(true);
          }}
          className="w-20 text-center border border-gray-200 rounded px-2 py-1 text-sm"
        />
      </td>
      <td className="px-6 py-3 text-center">
        <input
          type="number"
          value={yellow}
          onChange={(e) => {
            setYellow(+e.target.value);
            setDirty(true);
          }}
          className="w-20 text-center border border-gray-200 rounded px-2 py-1 text-sm"
        />
      </td>
      <td className="px-6 py-3 text-center">
        <input
          type="number"
          value={red}
          onChange={(e) => {
            setRed(+e.target.value);
            setDirty(true);
          }}
          className="w-20 text-center border border-gray-200 rounded px-2 py-1 text-sm"
        />
      </td>
      <td className="px-6 py-3 text-center">
        <button
          disabled={!dirty}
          onClick={() => {
            onSave({ green_min: green, yellow_min: yellow, red_below: red });
            setDirty(false);
          }}
          className="text-xs px-3 py-1 bg-brand-600 text-white rounded hover:bg-brand-700 disabled:opacity-30 transition"
        >
          Save
        </button>
      </td>
    </tr>
  );
}
