"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, fmtDate, LabRun } from "@/lib/api";
import { FlaskConical, Trophy, Zap } from "lucide-react";

function BeatsBadge({ beats }: { beats: number }) {
  return beats ? (
    <Badge className="bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30">
      <Trophy className="size-3 mr-1" /> beats
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      below
    </Badge>
  );
}

function ReturnCell({ value }: { value: number }) {
  return (
    <span
      className={`font-semibold tabular-nums ${
        value >= 0 ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {value >= 0 ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

function RunRow({ run }: { run: LabRun }) {
  const indicators = run.indicators_used?.split(",") || [];
  return (
    <TableRow>
      <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
        #{run.id}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {fmtDate(run.created_at)}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1 max-w-[260px]">
          {indicators.map((ind) => (
            <Badge key={ind} variant="outline" className="text-[10px] font-mono">
              {ind.trim()}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-mono text-[10px]">
          {run.timeframe}
        </Badge>
      </TableCell>
      <TableCell className="text-right tabular-nums text-muted-foreground">
        {run.baseline_return.toFixed(1)}%
      </TableCell>
      <TableCell className="text-right">
        <ReturnCell value={run.new_return} />
      </TableCell>
      <TableCell className="text-right tabular-nums">
        <span className="text-red-400">{run.new_dd.toFixed(1)}%</span>
      </TableCell>
      <TableCell className="text-right tabular-nums">
        <span
          className={
            run.new_calmar > 0 ? "text-emerald-400" : "text-muted-foreground"
          }
        >
          {run.new_calmar.toFixed(2)}
        </span>
      </TableCell>
      <TableCell className="text-right tabular-nums text-muted-foreground">
        {run.new_trades}
      </TableCell>
      <TableCell>
        <BeatsBadge beats={run.beats_baseline} />
      </TableCell>
    </TableRow>
  );
}

function RunsTable({ rows, loading }: { rows: LabRun[] | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (!rows || rows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Henüz AI run'ı yok. Scheduler 6 saatte bir tetikliyor.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Zaman</TableHead>
            <TableHead>Indicators</TableHead>
            <TableHead>TF</TableHead>
            <TableHead className="text-right">Baseline</TableHead>
            <TableHead className="text-right">New Return</TableHead>
            <TableHead className="text-right">DD</TableHead>
            <TableHead className="text-right">Calmar</TableHead>
            <TableHead className="text-right">Trades</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{rows.map((r) => <RunRow key={r.id} run={r} />)}</TableBody>
      </Table>
    </div>
  );
}

export default function LabPage() {
  const [recent, setRecent] = useState<LabRun[] | null>(null);
  const [top, setTop] = useState<LabRun[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [r, t] = await Promise.all([api.lab_runs(50), api.lab_top(10)]);
        if (alive) {
          setRecent(r);
          setTop(t);
          setErr(null);
        }
      } catch (e: unknown) {
        if (alive) {
          const msg = e instanceof Error ? e.message : "hata";
          setErr(msg);
          setRecent([]);
          setTop([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const totalRuns = recent?.length ?? 0;
  const beatsCount = recent?.filter((r) => r.beats_baseline).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <FlaskConical className="size-5" /> Strategy Lab
        </h1>
        <p className="text-sm text-muted-foreground">
          AI-driven strateji üretimi · Claude Haiku indicator'ları kombinleyip
          backtest ediyor · beats baseline = canlıya aday
        </p>
      </div>

      {err && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-sm text-red-400">
            API hata: {err}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Run</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{totalRuns}</div>
            <p className="text-xs text-muted-foreground mt-1">son 50 iterasyon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Baseline'ı Yenen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-emerald-400">
              {beatsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              oran: {totalRuns > 0 ? ((beatsCount / totalRuns) * 100).toFixed(0) : 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Zap className="size-3" /> Best Calmar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-emerald-400">
              {top && top.length > 0 ? top[0].new_calmar.toFixed(2) : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {top && top.length > 0 ? top[0].strategy_name.slice(0, 22) : "henüz yok"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="top" className="w-full">
        <TabsList>
          <TabsTrigger value="top">
            <Trophy className="size-3.5 mr-1.5" /> Top Strategies
          </TabsTrigger>
          <TabsTrigger value="recent">Son Run'lar</TabsTrigger>
        </TabsList>

        <TabsContent value="top" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Baseline'ı yenen stratejiler</CardTitle>
              <CardDescription>
                Calmar skoruna göre sıralı · canlıya taşımak için aday
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RunsTable rows={top} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Son AI run'ları</CardTitle>
              <CardDescription>
                Tüm iterasyonlar (başarılı + başarısız) — sistem her 6 saatte bir tarar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RunsTable rows={recent} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-dashed">
        <CardContent className="pt-6 text-xs text-muted-foreground space-y-1">
          <div>
            <strong className="text-foreground">Nasıl çalışır:</strong> Claude Haiku'ya
            18 indicator kütüphanesinden 2-4 rastgele seçim verip bunları kombinleyen bir
            Python stratejisi yazdırıyoruz.
          </div>
          <div>
            Yazılan kod AST ile validate edilip sandboxed exec ile çalıştırılıyor (no
            imports, no I/O). Sonra BTC+ETH+SOL 2 yıllık 4h/1d verisi üstünde backtest.
          </div>
          <div>
            <strong className="text-foreground">Calmar</strong> = return ÷ max drawdown
            — yüksek olan daha "kaliteli" kazanç.
          </div>
          <div>
            <strong className="text-foreground">Beats baseline:</strong> yeni strateji
            hem daha yüksek return, hem aynı/daha az drawdown ürettiyse.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
