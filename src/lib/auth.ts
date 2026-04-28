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

export type BistFundamentals = {
  ticker: string;
  name: string | null;
  sector: string | null;
  industry: string | null;
  currency: string;
  market_cap: number | null;
  price: number | null;
  day_high: number | null;
  day_low: number | null;
  fifty_two_week_high: number | null;
  fifty_two_week_low: number | null;
  fifty_day_avg: number | null;
  volume: number | null;
  avg_volume: number | null;
  ratios: {
    trailing_pe: number | null;
    forward_pe: number | null;
    price_to_book: number | null;
    price_to_sales: number | null;
    roe: number | null;
    roa: number | null;
    profit_margin: number | null;
    operating_margin: number | null;
    debt_to_equity: number | null;
    current_ratio: number | null;
    quick_ratio: number | null;
  };
  financials_summary: {
    total_revenue: number | null;
    gross_profits: number | null;
    ebitda: number | null;
    net_income: number | null;
    total_cash: number | null;
    total_debt: number | null;
    free_cashflow: number | null;
  };
  growth: {
    earnings_growth: number | null;
    revenue_growth: number | null;
  };
  dividend: {
    yield: number | null;
    annual_yield: number | null;
  };
  analyst: {
    recommendation_mean: number | null;
    recommendation_key: string | null;
    num_analysts: number | null;
    target_mean: number | null;
    target_high: number | null;
    target_low: number | null;
    trend?: {
      period: string;
      strong_buy: number;
      buy: number;
      hold: number;
      sell: number;
      strong_sell: number;
    }[];
  };
  annual_financials: Array<{ period: string; [key: string]: number | string }>;
  annual_balance_sheet: Array<{ period: string; [key: string]: number | string }>;
  annual_cashflow: Array<{ period: string; [key: string]: number | string }>;
  fetched_at: string;
};

export type NewsItem = {
  id: number;
  source: string;
  category: string;
  title: string;
  link: string;
  summary: string | null;
  pubdate: string | null;
  image_url: string | null;
  ticker_mentions: string[];
  sentiment_score: number | null;
  sentiment_label: string | null;
  fetched_at: string;
};

export type PaymentRequest = {
  id: number;
  amount_usd: number;
  method: string;
  reference: string | null;
  tx_hash?: string | null;
  status: "pending" | "approved" | "rejected";
  generated_code: string | null;
  admin_note: string | null;
  created_at: string;
  processed_at: string | null;
};

export type AdminPaymentRequest = PaymentRequest & {
  user_id: number;
  username: string;
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

  deleteUser: async (userId: number) => {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: authHeaders(),
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
    return res.json() as Promise<{ ok: boolean; username?: string; deleted_subs?: number }>;
  },

  // BIST fundamentals (yfinance via backend)
  bistFundamentals: (ticker: string) =>
    getJson<BistFundamentals>(`/api/bist/fundamentals/${encodeURIComponent(ticker)}`),

  // Marketing (Telegram kanal otomasyonu)
  marketingStatus: () =>
    getJson<{
      configured: boolean;
      channel: string | null;
      bot_token_set: boolean;
      recent_posts: {
        id: number;
        kind: string;
        title: string;
        ok: 0 | 1;
        error: string | null;
        tg_message_id: number | null;
        created_at: string;
      }[];
    }>("/api/admin/marketing/status"),

  marketingPost: (kind: "morning_bist" | "afternoon_us" | "fomo_sim" | "evening_news") =>
    postJson<{ ok: boolean; message_id?: number; error?: string }>(
      `/api/admin/marketing/post/${kind}`,
      {},
    ),

  marketingAnnounce: (title: string, body: string, link?: string) =>
    postJson<{ ok: boolean; message_id?: number; error?: string }>(
      "/api/admin/marketing/announce",
      { title, body, link: link || null },
    ),

  // News (Investing.com TR)
  news: (params?: { category?: string; ticker?: string; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.ticker) q.set("ticker", params.ticker);
    if (params?.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    return getJson<{
      items: NewsItem[];
      categories: { category: string; n: number; latest_pubdate: string }[];
    }>(`/api/news${qs ? "?" + qs : ""}`);
  },

  // Payments — Public (auth yok, /satin-al için)
  paymentPublicInfo: async () => {
    const res = await fetch(`${API_BASE}/api/payments/public-info`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json() as Promise<{
      address: string;
      network: string;
      token: string;
      amount_usd: number;
      min_amount_usd: number;
      min_confirmations: number;
      configured: boolean;
    }>;
  },

  buyCodeAnonymous: async (tx_hash: string, contact: string) => {
    const res = await fetch(`${API_BASE}/api/payments/buy-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tx_hash, contact }),
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
    return res.json() as Promise<{
      ok: boolean;
      code: string;
      amount_usd: number;
      tx_hash: string;
      note?: string;
    }>;
  },

  // Payments — Authenticated (subscriber yenile)
  paymentInfo: () =>
    getJson<{
      address: string;
      network: string;
      token: string;
      amount_usd: number;
      min_amount_usd: number;
      min_confirmations: number;
      configured: boolean;
    }>("/api/payments/info"),

  verifyTx: (tx_hash: string) =>
    postJson<{
      ok: boolean;
      code: string;
      expires_at: string;
      amount_usd: number;
      tx_hash: string;
    }>("/api/payments/verify-tx", { tx_hash }),

  myPayments: () =>
    getJson<{ requests: PaymentRequest[] }>("/api/payments/my"),

  // Admin (audit only — otomatik onaylı)
  adminPayments: (status?: "pending" | "approved" | "rejected") => {
    const q = status ? `?status=${status}` : "";
    return getJson<{ requests: AdminPaymentRequest[]; pending_count: number }>(
      `/api/admin/payments${q}`,
    );
  },

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
