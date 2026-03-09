import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getThresholdColor(status: string): string {
  switch (status) {
    case "green":
      return "text-kpi-green";
    case "yellow":
      return "text-kpi-yellow";
    case "red":
      return "text-kpi-red";
    default:
      return "text-kpi-grey";
  }
}

export function getThresholdBg(status: string): string {
  switch (status) {
    case "green":
      return "bg-kpi-green-bg border-kpi-green";
    case "yellow":
      return "bg-kpi-yellow-bg border-kpi-yellow";
    case "red":
      return "bg-kpi-red-bg border-kpi-red";
    default:
      return "bg-kpi-grey-bg border-kpi-grey";
  }
}
