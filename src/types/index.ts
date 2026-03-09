// ── User & Auth ────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "owner" | "manager" | "sales" | "technician" | "support";
  location_id: string;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ── Dashboard KPIs ────────────────────────────────────

export interface KPICard {
  metric_key: string;
  display_name: string;
  value: number | string;
  formatted_value: string;
  unit?: string;
  trend_direction?: "up" | "down" | "flat";
  trend_value?: number;
  threshold_status: "green" | "yellow" | "red" | "grey";
  sparkline_data?: number[];
}

export interface CommandCenterData {
  kpis: KPICard[];
  ai_briefing: string | null;
  secondary_indicators: Record<string, unknown> | null;
  last_updated: string;
}

export interface MarketingData {
  kpis: KPICard[];
  channel_comparison: Record<string, unknown>[] | null;
  lead_funnel: Record<string, unknown>[] | null;
  trend_data: Record<string, unknown>[] | null;
  last_updated: string;
}

export interface SalesData {
  kpis: KPICard[];
  pipeline_funnel: Record<string, unknown>[] | null;
  call_scores_trend: Record<string, unknown>[] | null;
  rep_leaderboard: Record<string, unknown>[] | null;
  weekly_coaching_focus: string | null;
  last_updated: string;
}

export interface OperationsData {
  kpis: KPICard[];
  bay_utilization_heatmap: Record<string, unknown>[] | null;
  technician_productivity: Record<string, unknown>[] | null;
  schedule_overview: Record<string, unknown>[] | null;
  capacity_calculator: Record<string, unknown> | null;
  last_updated: string;
}

export interface FinancialData {
  kpis: KPICard[];
  revenue_goal_tracker: Record<string, unknown> | null;
  monthly_trend: Record<string, unknown>[] | null;
  service_profitability: Record<string, unknown>[] | null;
  cash_flow_forecast: Record<string, unknown>[] | null;
  ai_financial_insight: string | null;
  last_updated: string;
}

export interface TeamData {
  scorecards: TeamMemberScorecard[];
  leaderboard: Record<string, unknown>[] | null;
  last_updated: string;
}

export interface TeamMemberScorecard {
  user_id: number;
  name: string;
  role: string;
  kpis: KPICard[];
  trend_data: Record<string, unknown>[] | null;
}

// ── Integrations ──────────────────────────────────────

export interface IntegrationStatus {
  integration_name: string;
  status: "connected" | "syncing" | "error" | "disconnected";
  last_sync_at: string | null;
  last_error: string | null;
  records_synced: number;
}

// ── Navigation ────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: string[]; // Which roles can see this tab
}
