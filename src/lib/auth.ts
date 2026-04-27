/**
 * Auth client — login/signup + token storage + auth headers
 */
import { API_BASE } from "./api";

export type User = {
  id: number;
  username: string;
  role: "admin" | "subscriber";
  subscription?: Subscription | null;
};

export type Subscription = {
  id?: number;
  code: string;
  activated_at: string;
  expires_at: string;
  duration_days?: number;
  device_id?: string | null;
  status?: string;
};

const TOKEN_KEY = "tb_token";
const DEVICE_KEY = "tb_device_id";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  const deviceId = getDeviceId();
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  if (deviceId) h["X-Device-ID"] = deviceId;
  return h;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    let msg = `${res.status}`;
    try {
      const j = JSON.parse(txt);
      msg = j.detail || j.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    let msg = `${res.status}`;
    try {
      const j = JSON.parse(txt);
      msg = j.detail || j.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  signup: (username: string, password: string, code: string) =>
    postJson<{ token: string; user: User }>("/api/auth/signup", {
      username,
      password,
      code,
      device_id: getDeviceId(),
    }),

  login: (username: string, password: string) =>
    postJson<{ token: string; user: User }>("/api/auth/login", { username, password }),

  me: () => getJson<{ user: User; subscription: Subscription | null }>("/api/auth/me"),

  renew: (code: string) =>
    postJson<{ ok: boolean; expires_at: string }>("/api/auth/renew", { code }),

  // Admin
  createCode: (duration_days = 30, note = "") =>
    postJson<{ code: string; duration_days: number }>("/api/admin/codes", {
      duration_days,
      note,
    }),

  listCodes: () =>
    getJson<
      {
        code: string;
        duration_days: number;
        created_at: string;
        used_at: string | null;
        used_by_user_id: number | null;
        status: string;
        note: string | null;
      }[]
    >("/api/admin/codes"),

  revokeCode: async (code: string) => {
    const res = await fetch(`${API_BASE}/api/admin/codes/${encodeURIComponent(code)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return res.ok;
  },

  listUsers: () =>
    getJson<
      {
        id: number;
        username: string;
        role: string;
        created_at: string;
        last_login_at: string | null;
        sub_code: string | null;
        sub_activated_at: string | null;
        sub_expires_at: string | null;
        sub_status: string | null;
        sub_device_id: string | null;
      }[]
    >("/api/admin/users"),

  revenue: () =>
    getJson<{
      active_subscribers: number;
      total_users: number;
      total_codes_generated: number;
      codes_used: number;
      codes_revoked: number;
      codes_unused: number;
      code_conversion_pct: number;
      mrr_usd: number;
      last_30d_revenue_usd: number;
      price_per_month_usd: number;
      expiring_soon: { username: string; expires_at: string; days_left: number }[];
      monthly_growth: { ym: string; n: number }[];
    }>("/api/admin/revenue"),

  triggerBackup: () =>
    postJson<{
      ok: boolean;
      size_bytes?: number;
      users?: number;
      active_subs?: number;
      sent_to_telegram?: boolean;
      error?: string;
    }>("/api/admin/backup", {}),
};
