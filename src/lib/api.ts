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

type RawTier = {
  tier_id: string;
  equity: number;
  initial_equity: number;
  last_updated?: string;
};

type RawConfig = {
  name: string;
  allocation: number;
  market: string;
  leverage: number;
  risk_pct: number;
  symbol_spot: string | null;
  symbol_fut: string | null;
  description?: string;
};

type RawPortfolio = {
  tiers: RawTier[];
  total_equity: number;
  total_initial: number;
  total_pnl_pct: number;
  tier_config: Record<string, RawConfig>;
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

async function fetchPortfolio(): Promise<PortfolioSummary> {
  const raw = await fetchJson<RawPortfolio>("/api/portfolio");
  const tiers: Tier[] = raw.tiers.map((t) => {
    const cfg = raw.tier_config[t.tier_id];
    const pnl_pct =
      t.initial_equity > 0 ? ((t.equity - t.initial_equity) / t.initial_equity) * 100 : 0;
    return {
      tier_id: t.tier_id,
      name: cfg?.name ?? t.tier_id,
      equity: t.equity,
      initial_equity: t.initial_equity,
      pnl_pct,
      market: cfg?.market ?? "—",
      allocation: cfg?.allocation ?? 0,
      leverage: cfg?.leverage ?? 1,
      risk_pct: cfg?.risk_pct ?? 0,
      symbol: cfg?.symbol_fut ?? cfg?.symbol_spot ?? null,
    };
  });
  const total_pnl = raw.total_equity - raw.total_initial;
  return {
    total_equity: raw.total_equity,
    starting_capital: raw.total_initial,
    total_pnl,
    total_pnl_pct: raw.total_pnl_pct,
    tiers,
  };
}

export type RealBalances = {
  spot_usdt: number | null;
  futures_usdt: number | null;
  total_usdt: number | null;
  spot_error: string | null;
  futures_error: string | null;
};

export type WsbTicker = {
  ticker: string;
  name: string | null;
  mentions: number;
  mentions_24h_ago: number;
  rank: number | null;
  rank_24h_ago: number | null;
  upvotes: number;
  bullish: number;
  bearish: number;
  neutral: number;
  sentiment_score: number;
  sample_title: string;
  sample_url: string;
  scraped_at: string;
  // FinnHub multi-source enrichment
  analyst_score: number | null;
  analyst_strong_buy: number | null;
  analyst_buy: number | null;
  analyst_hold: number | null;
  analyst_sell: number | null;
  analyst_strong_sell: number | null;
  news_score: number | null;
  news_reason: string | null;
  price_current: number | null;
  price_change_pct: number | null;
  social_score: number | null;
  final_score: number | null;
  sentiment_label: string | null;
};

export type WsbHistory = {
  mentions: number;
  sentiment_score: number;
  scraped_at: string;
};

export type WsbSnapshotMeta = {
  scraped_at: string;
  ticker_count: number;
  total_mentions: number;
};

export type StockSignal = {
  id: number;
  ticker: string;
  signal_type: string;
  confidence: number;
  current_price: number | null;
  entry_zone_low: number | null;
  entry_zone_high: number | null;
  stop_loss: number | null;
  target: number | null;
  risk_reward: number | null;
  reasoning: string | null;
  analyst_score: number | null;
  news_score: number | null;
  social_score: number | null;
  final_score: number | null;
  rsi_14: number | null;
  atr_14: number | null;
  price_5d_change_pct: number | null;
  price_30d_change_pct: number | null;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  outcome: string | null;
};

export type LabRun = {
  id: number;
  created_at: string;
  model: string;
  indicators_used: string;
  timeframe: string;
  strategy_name: string;
  baseline_name: string;
  baseline_return: number;
  baseline_dd: number;
  new_return: number;
  new_dd: number;
  new_calmar: number;
  new_trades: number;
  new_win_rate: number;
  beats_baseline: number;
};

export const api = {
  portfolio: fetchPortfolio,
  positions: () => fetchJson<Position[]>("/api/positions"),
  history: () => fetchJson<Trade[]>("/api/history"),
  stats: () => fetchJson<TradeStats>("/api/stats"),
  errors: () => fetchJson<ErrorLog[]>("/api/errors"),
  errors_full: () => fetchJson<ErrorLog[]>("/api/errors"),
  real_balances: () => fetchJson<RealBalances>("/api/real_balances"),
  equity_curve: (days = 90) =>
    fetchJson<
      {
        snapshot_at: string;
        total_equity: number;
        total_initial: number;
        real_spot: number | null;
        real_futures: number | null;
        real_total: number | null;
      }[]
    >(`/api/equity_curve?days=${days}`),
  wsb_radar: (limit = 20) => fetchJson<WsbTicker[]>(`/api/wsb/radar?limit=${limit}`),
  wsb_ticker: (ticker: string, days = 7) =>
    fetchJson<WsbHistory[]>(`/api/wsb/ticker/${encodeURIComponent(ticker)}?days=${days}`),
  wsb_snapshots: (limit = 30) =>
    fetchJson<WsbSnapshotMeta[]>(`/api/wsb/snapshots?limit=${limit}`),
  wsb_snapshot_at: (scraped_at: string, limit = 30) =>
    fetchJson<WsbTicker[]>(
      `/api/wsb/snapshot/${encodeURIComponent(scraped_at)}?limit=${limit}`,
    ),
  signals: () => fetchJson<StockSignal[]>(`/api/signals`),
  signals_history: (limit = 50) =>
    fetchJson<StockSignal[]>(`/api/signals/history?limit=${limit}`),
  lab_runs: (limit = 30) => fetchJson<LabRun[]>(`/api/lab/runs?limit=${limit}`),
  lab_top: (limit = 10) => fetchJson<LabRun[]>(`/api/lab/top?limit=${limit}`),
  lab_run_detail: (id: number) =>
    fetchJson<Record<string, unknown>>(`/api/lab/run/${id}`),
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
