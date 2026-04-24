export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://trading-bot-senaryo-production.up.railway.app";

export type Tier = {
  tier_id: string;
  name: string;
  equity: number;
  initial_equity: number;
  pnl_pct: number;
  market: string;
  allocation: number;
  leverage: number;
  risk_pct: number;
  symbol: string | null;
};

export type PortfolioSummary = {
  total_equity: number;
  starting_capital: number;
  total_pnl: number;
  total_pnl_pct: number;
  tiers: Tier[];
};

export type Position = {
  id: number;
  tier_id: string;
  symbol: string;
  side: string;
  qty: number;
  entry_price: number;
  stop_price: number | null;
  entry_time: string;
  market: string;
  leverage: number;
};

export type Trade = {
  id: number;
  tier_id: string;
  symbol: string;
  side: string;
  qty: number;
  entry_price: number;
  close_price: number;
  pnl_usdt: number;
  pnl_pct: number;
  entry_time: string;
  close_time: string;
};

export type TradeStats = {
  total_trades: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_pnl: number;
  avg_win: number;
  avg_loss: number;
  best_trade: number;
  worst_trade: number;
};

export type ErrorLog = {
  id: number;
  tier_id: string | null;
  error_type: string;
  error_msg: string;
  timestamp: string;
};

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json();
}

export const api = {
  portfolio: () => fetchJson<PortfolioSummary>("/api/portfolio"),
  positions: () => fetchJson<Position[]>("/api/positions"),
  history: () => fetchJson<Trade[]>("/api/history"),
  stats: () => fetchJson<TradeStats>("/api/stats"),
  errors: () => fetchJson<ErrorLog[]>("/api/errors"),
  health: () => fetchJson<{ status: string }>("/health"),
};

export const fmtUsd = (n: number | null | undefined, dp = 2) =>
  n == null || Number.isNaN(n)
    ? "—"
    : n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: dp,
        maximumFractionDigits: dp,
      });

export const fmtPct = (n: number | null | undefined, dp = 2) =>
  n == null || Number.isNaN(n) ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(dp)}%`;

export const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};
