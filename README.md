# Upstate Auto Styling — Frontend

Next.js 15 dashboard frontend for the UAS Business Intelligence platform.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **TanStack React Query 5** for server state
- **Zustand 5** for client state (auth)
- **Recharts 2** for data visualization
- **Axios** for API calls
- **Lucide React** for icons

## Pages

| Route | Tab | Access |
|-------|-----|--------|
| `/dashboard/command-center` | Command Center | All roles |
| `/dashboard/marketing` | Marketing | Owner, Manager |
| `/dashboard/sales` | Sales | Owner, Manager, Sales |
| `/dashboard/operations` | Operations | Owner, Manager, Technician |
| `/dashboard/financial` | Financial | Owner only |
| `/dashboard/team` | Team Performance | Owner, Manager |
| `/dashboard/settings` | Settings | Owner only |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.local.example .env.local

# 3. Start dev server
npm run dev
```

Open http://localhost:3000

## Component Library

- **KPICard** — Threshold-colored metric card with trend arrows
- **AIInsightCard** — AI diagnostic/coaching/financial insight display
- **BarChartCard / LineChartCard / PieChartCard** — Recharts wrappers
- **PageHeader** — Consistent page title + last-updated timestamp
