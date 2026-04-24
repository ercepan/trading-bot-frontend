"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, fmtDate } from "@/lib/api";
import { ArrowLeft, Trophy, Code2, BarChart3 } from "lucide-react";

type RunDetail = {
  id: number;
  created_at: string;
  model: string;
  indicators_used: string;
  timeframe: string;
  strategy_name: string;
  strategy_code: string;
  baseline_name: string;
  baseline_return: number;
  baseline_dd: number;
  new_return: number;
  new_dd: number;
  new_calmar: number;
  new_trades: number;
  new_win_rate: number;
  beats_baseline: number;
  per_asset_json: string;
};

type AssetMetric = {
  symbol: string;
  timeframe: string;
  total_return_pct: number;
  max_drawdown_pct: number;
  num_trades: number;
  win_rate: number;
  sharpe: number;
  calmar: number;
  final_equity: number;
};

export default function LabRunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [run, setRun] = useState<RunDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = (await api.lab_run_detail(Number(id))) as unknown as RunDetail;
        if (alive) setRun(r);
      } catch (e: unknown) {
        if (alive) setErr(e instanceof Error ? e.message : "hata");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const perAsset: Record<string, AssetMetric> = run?.per_asset_json
    ? JSON.parse(run.per_asset_json)
    : {};
  const assets = Object.entries(perAsset);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (err || !run) {
    return (
      <div className="space-y-4">
        <Link href="/lab" className="text-sm text-muted-foreground flex items-center gap-1">
          <ArrowLeft className="size-4" /> Strategy Lab
        </Link>
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-sm text-red-400">
            {err ?? "Run bulunamadı"}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/lab"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="size-4" /> Strategy Lab
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold tracking-tight font-mono">
            #{run.id}
          </h1>
          {run.beats_baseline ? (
            <Badge className="bg-emerald-500/20 border-emerald-500/40 text-emerald-300">
              <Trophy className="size-3 mr-1" /> beats baseline
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">below baseline</Badge>
          )}
          <Badge variant="outline" className="font-mono">{run.timeframe}</Badge>
          <span className="text-sm text-muted-foreground">{fmtDate(run.created_at)}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {run.indicators_used.split(",").map((i) => (
            <Badge key={i} variant="outline" className="text-[10px] font-mono">
              {i.trim()}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Yeni return</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-semibold tabular-nums ${
                run.new_return >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {run.new_return >= 0 ? "+" : ""}
              {run.new_return.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              baseline: {run.baseline_return.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Max DD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-red-400">
              {run.new_dd.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              baseline: {run.baseline_dd.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Calmar</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-semibold tabular-nums ${
                run.new_calmar > 0 ? "text-emerald-400" : "text-muted-foreground"
              }`}
            >
              {run.new_calmar.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">return ÷ drawdown</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Trades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {run.new_trades}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              win rate: {run.new_win_rate.toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {assets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" /> Asset Bazlı Performans
            </CardTitle>
            <CardDescription>
              {run.baseline_name} baseline'a karşı BTC/ETH/SOL ayrı ayrı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {assets.map(([sym, m]) => (
                <div key={sym} className="rounded-md border border-border/50 p-4 space-y-2">
                  <div className="font-mono font-semibold text-sm">{sym}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Return</span>
                      <span
                        className={`tabular-nums font-medium ${
                          m.total_return_pct >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {m.total_return_pct >= 0 ? "+" : ""}
                        {m.total_return_pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Max DD</span>
                      <span className="text-red-400 tabular-nums">
                        {m.max_drawdown_pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Trades</span>
                      <span className="tabular-nums">{m.num_trades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Win rate</span>
                      <span className="tabular-nums">{m.win_rate.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Calmar</span>
                      <span className="tabular-nums">{m.calmar.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="size-5" /> Claude'un yazdığı kod
          </CardTitle>
          <CardDescription>
            Model: {run.model} · Strategy: {run.strategy_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted/30 border border-border/50 rounded-md p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
            {run.strategy_code}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
