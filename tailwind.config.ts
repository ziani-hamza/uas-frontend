/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // UAS Brand Colors
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          900: "#0c4a6e",
        },
        // KPI Threshold Colors
        kpi: {
          green: "#22c55e",
          "green-bg": "#f0fdf4",
          yellow: "#eab308",
          "yellow-bg": "#fefce8",
          red: "#ef4444",
          "red-bg": "#fef2f2",
          grey: "#9ca3af",
          "grey-bg": "#f9fafb",
        },
      },
    },
  },
  plugins: [],
};
