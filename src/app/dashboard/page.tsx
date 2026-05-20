"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Activity,
  Target,
} from "lucide-react";
import { api, fmtPct, fmtUsd, PortfolioSummary, RealBalances, TradeStats } from "@/lib/api";
import { Wallet, Coins } from "lucide-react";
import { EquityCurve } from "@/components/equity-curve";

function KpiCard({
  title,
  value,
  delta,
  icon: Icon,
  loading,
  kicker,
}: {
  title: string;
  value: string;
  delta?: { value: string; positive: boolean } | null;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  kicker?: string;
}) {
  return (
    <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-5 group hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">
          {kicker} {title}
        </div>
        <Icon className="size-3.5 text-white/35" />
      </div>
      {loading ? (
        <Skeleton className="h-9 w-32" />
      ) : (
        <div className="font-display text-3xl md:text-4xl font-medium tabular-nums tracking-tight">
          {value}
        </div>
      )}
      {delta && !loading ? (
        <p
          className={`font-mono text-[10px] mt-2 tabular-nums uppercase tracking-[0.15em] ${
            delta.positive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {delta.value}
        </p>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [balances, setBalances] = useState<RealBalances | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [p, s, b] = await Promise.all([
          api.portfolio(),
          api.stats(),
          api.real_balances().catch(() => null),
        ]);
        if (!alive) return;
        setPortfolio(p);
        setStats(s);
        setBalances(b);
        setErr(null);
      } catch (e: unknown) {
        if (!alive) return;
        const msg = e instanceof Error ? e.message : "bilinmeyen hata";
        setErr(msg);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 15_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
            01 / Multi-asset · 15 sn yenileme
          </span>
        </div>
        <h1
          className="font-display font-medium tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
        >
          Portföy{" "}
          <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
            özeti.
          </em>
        </h1>
      </div>

      {err && (
        <div className="font-mono text-[11px] text-red-400 bg-red-500/[0.06] border border-red-500/30 px-4 py-3 uppercase tracking-wider">
          API'ye erişilemedi: {err}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="MEXC Gerçek Bakiye"
          value={fmtUsd(balances?.total_usdt, 4)}
          delta={
            balances && portfolio
              ? {
                  value: `Sanal: ${fmtUsd(portfolio.total_equity)}`,
                  positive: true,
                }
              : null
          }
          icon={DollarSign}
          loading={loading}
        />
        <KpiCard
          title="Win Rate"
          value={stats ? `${stats.win_rate.toFixed(1)}%` : "—"}
          delta={
            stats
              ? {
                  value: `${stats.wins}W / ${stats.losses}L`,
                  positive: stats.win_rate >= 50,
                }
              : null
          }
          icon={Target}
          loading={loading}
        />
        <KpiCard
          title="Toplam Trade"
          value={stats ? String(stats.total_trades) : "—"}
          delta={
            stats && stats.total_trades > 0
              ? {
                  value: `En iyi ${fmtUsd(stats.best_trade)}`,
                  positive: true,
                }
              : null
          }
          icon={Activity}
          loading={loading}
        />
        <KpiCard
          title="Net P&L"
          value={stats ? fmtUsd(stats.total_pnl) : "—"}
          delta={
            stats
              ? {
                  value: `Ort kazanan ${fmtUsd(stats.avg_win)}`,
                  positive: stats.total_pnl >= 0,
                }
              : null
          }
          icon={TrendingUp}
          loading={loading}
        />
      </div>

      <EquityCurve />

      <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-8 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-white/45 uppercase tracking-[0.28em]">
              02 / MEXC Bakiye Dağılımı
            </span>
          </div>
          <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.18em]">
            Canlı USDT · spot + futures · kuruşu kuruşuna
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white/[0.02] border border-white/10 p-5 space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] text-white/45 uppercase tracking-[0.2em]">
              <Wallet className="size-3" /> Spot Cüzdan
            </div>
            {loading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <div className="font-display text-2xl font-medium tabular-nums tracking-tight">
                {fmtUsd(balances?.spot_usdt, 4)}
              </div>
            )}
            {balances?.spot_error ? (
              <div className="font-mono text-[10px] text-red-400">{balances.spot_error}</div>
            ) : null}
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-5 space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] text-white/45 uppercase tracking-[0.2em]">
              <Coins className="size-3" /> Futures Cüzdan
            </div>
            {loading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <div className="font-display text-2xl font-medium tabular-nums tracking-tight">
                {fmtUsd(balances?.futures_usdt, 4)}
              </div>
            )}
            {balances?.futures_error ? (
              <div className="font-mono text-[10px] text-red-400">{balances.futures_error}</div>
            ) : null}
          </div>
          <div className="bg-emerald-500/[0.06] border-2 border-emerald-500/40 p-5 space-y-2 shadow-[0_8px_40px_-12px_rgba(16,185,129,0.3)]">
            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 uppercase tracking-[0.2em]">
              <DollarSign className="size-3" /> Toplam · Live
            </div>
            {loading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <div className="font-display text-2xl font-medium tabular-nums tracking-tight text-emerald-400">
                {fmtUsd(balances?.total_usdt, 4)}
              </div>
            )}
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-[0.18em]">
              Sanal başlangıç: {fmtUsd(portfolio?.starting_capital)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-8 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-white/45 uppercase tracking-[0.28em]">
              03 / Tier Dağılımı
            </span>
          </div>
          <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.18em]">
            Sanal sermaye + performans · her tier bağımsız
          </p>
        </div>
        <div>
          {loading && !portfolio ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Tier</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Sembol</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Market</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 text-right">Equity</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 text-right">Başlangıç</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 text-right">P&amp;L %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio?.tiers.map((t) => (
                  <TableRow key={t.tier_id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{t.name}</span>
                        <span className="text-xs text-muted-foreground">
                          risk {(t.risk_pct * 100).toFixed(1)}% · kaldıraç{" "}
                          {t.leverage}x
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {t.symbol ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t.market}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {fmtUsd(t.equity)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {fmtUsd(t.initial_equity)}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums font-medium ${
                        t.pnl_pct >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {fmtPct(t.pnl_pct)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
