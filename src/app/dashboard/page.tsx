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
}: {
  title: string;
  value: string;
  delta?: { value: string; positive: boolean } | null;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription>{title}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <div className="text-2xl font-semibold tabular-nums">{value}</div>
        )}
        {delta && !loading ? (
          <p
            className={`text-xs mt-1 tabular-nums ${
              delta.positive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {delta.value}
          </p>
        ) : null}
      </CardContent>
    </Card>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Portföy Özeti</h1>
        <p className="text-sm text-muted-foreground">
          Multi-asset canlı takip · 15 sn'de bir yenilenir
        </p>
      </div>

      {err && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-sm text-red-400">
            API'ye erişilemedi: {err}
          </CardContent>
        </Card>
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

      <Card>
        <CardHeader>
          <CardTitle>MEXC Bakiye Dağılımı</CardTitle>
          <CardDescription>
            Canlı hesaptaki gerçek USDT — spot + futures cüzdanı (kuruşu kuruşuna)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-border/50 p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="size-3.5" /> Spot Cüzdan
              </div>
              {loading ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                <div className="text-xl font-semibold tabular-nums">
                  {fmtUsd(balances?.spot_usdt, 4)}
                </div>
              )}
              {balances?.spot_error ? (
                <div className="text-[11px] text-red-400">{balances.spot_error}</div>
              ) : null}
            </div>
            <div className="rounded-md border border-border/50 p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Coins className="size-3.5" /> Futures Cüzdan
              </div>
              {loading ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                <div className="text-xl font-semibold tabular-nums">
                  {fmtUsd(balances?.futures_usdt, 4)}
                </div>
              )}
              {balances?.futures_error ? (
                <div className="text-[11px] text-red-400">{balances.futures_error}</div>
              ) : null}
            </div>
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <DollarSign className="size-3.5" /> Toplam (Live)
              </div>
              {loading ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                <div className="text-xl font-semibold tabular-nums text-emerald-400">
                  {fmtUsd(balances?.total_usdt, 4)}
                </div>
              )}
              <div className="text-[11px] text-muted-foreground">
                Sanal başlangıç: {fmtUsd(portfolio?.starting_capital)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tier Dağılımı</CardTitle>
          <CardDescription>
            Sanal sermaye + performans — her tier bağımsız çalışır
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && !portfolio ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Sembol</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead className="text-right">Equity</TableHead>
                  <TableHead className="text-right">Başlangıç</TableHead>
                  <TableHead className="text-right">P&amp;L %</TableHead>
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
        </CardContent>
      </Card>
    </div>
  );
}
