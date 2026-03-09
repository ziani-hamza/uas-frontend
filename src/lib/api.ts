import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get("uas_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("uas_token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: { email: string; password: string; full_name: string; role?: string }) =>
    api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
};

// ── Dashboard ────────────────────────────────────────────

export const dashboardApi = {
  getCommandCenter: (locationId = "loc_main") =>
    api.get("/dashboard/command-center", { params: { location_id: locationId } }),
  getMarketing: (locationId = "loc_main") =>
    api.get("/dashboard/marketing", { params: { location_id: locationId } }),
  getSales: (locationId = "loc_main") =>
    api.get("/dashboard/sales", { params: { location_id: locationId } }),
  getOperations: (locationId = "loc_main") =>
    api.get("/dashboard/operations", { params: { location_id: locationId } }),
  getFinancial: (locationId = "loc_main") =>
    api.get("/dashboard/financial", { params: { location_id: locationId } }),
  getTeam: (locationId = "loc_main") =>
    api.get("/dashboard/team", { params: { location_id: locationId } }),
};

// ── Integrations ─────────────────────────────────────────

export const integrationsApi = {
  getStatus: () => api.get("/integrations/status"),
  uploadTintWizCSV: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/integrations/tintwiz/csv-upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ── Settings ─────────────────────────────────────────────

export const settingsApi = {
  getThresholds: (locationId = "loc_main") =>
    api.get("/settings/thresholds", { params: { location_id: locationId } }),
  updateThreshold: (data: Record<string, unknown>) =>
    api.put("/settings/thresholds", data),
  getUsers: () => api.get("/settings/users"),
};
