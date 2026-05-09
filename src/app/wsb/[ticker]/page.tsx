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
import { api, fmtDate, WsbHistory, WsbTicker } from "@/lib/api";
import { useAuth } from "@/components/auth-context";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

// Modern tooltip
function ChartTooltip(props: { active?: boolean; payload?: Array<{ payload: { label: string; mentions: number; sentiment: number } }> }) {
  const { active, payload } = props;
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const sentColor =
    d.sentiment > 0.2 ? "text-emerald-400" : d.sentiment < -0.2 ? "text-red-400" : "text-muted-foreground";
  return (
    <div className="rounded-md border border-border/80 bg-background/95 backdrop-blur px-3 py-2 shadow-xl text-xs">
      <div className="font-semibold text-foreground">{d.label}</div>
      <div className="flex items-center justify-between gap-4 mt-1">
        <span className="text-muted-foreground">Mention</span>
        <span className="font-mono font-bold text-emerald-400">{d.mentions}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground">Sentiment</span>
        <span className={`font-mono font-bold ${sentColor}`}>
          {d.sentiment >= 0 ? "+" : ""}
          {d.sentiment.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function SentimentBadge({ score }: { score: number }) {
  if (score > 0.2) {
    return (
      <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-400">
        <TrendingUp className="size-3" /> bullish
      </Badge>
    );
  }
  if (score < -0.2) {
    return (
      <Badge variant="outline" className="gap-1 border-red-500/30 text-red-400">
        <TrendingDown className="size-3" /> bearish
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <Minus className="size-3" /> neutral
    </Badge>
  );
}

export default function TickerDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = use(params);
  const tk = ticker.toUpperCase();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [history, setHistory] = useState<WsbHistory[] | null>(null);
  const [current, setCurrent] = useState<WsbTicker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [h, r] = await Promise.all([
          api.wsb_ticker(tk, 30),
          api.wsb_radar(100).catch(() => []),
        ]);
        if (!alive) return;
        setHistory(h);
        const found = r.find((x) => x.ticker === tk);
        setCurrent(found ?? null);
      } catch {
        if (alive) setHistory([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tk]);

  const chartData = (history ?? []).map((h) => ({
    ts: new Date(h.scraped_at).getTime(),
    label: fmtDate(h.scraped_at),
    mentions: h.mentions,
    sentiment: h.sentiment_score,
  }));

  const latest = history && history.length > 0 ? history[history.length - 1] : null;
  const earliest = history && history.length > 0 ? history[0] : null;
  const change =
    latest && earliest && earliest.mentions > 0
      ? ((latest.mentions - earliest.mentions) / earliest.mentions) * 100
      : null;

  // Chart istatistikleri
  const peakMention = chartData.length ? Math.max(...chartData.map((d) => d.mentions)) : 0;
  const avgMention = chartData.length
    ? Math.round(chartData.reduce((a, b) => a + b.mentions, 0) / chartData.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/wsb"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="size-4" /> ABD Radar
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-semibold tracking-tight font-mono">
            ${tk}
          </h1>
          {current?.name && (
            <span className="text-muted-foreground text-lg">
              {current.name.replace(/&amp;/g, "&")}
            </span>
          )}
          {current && <SentimentBadge score={current.sentiment_score} />}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Şu an mention</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-semibold tabular-nums">
                {current?.mentions ?? "—"}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">son tarama</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>24h önce</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-semibold tabular-nums text-muted-foreground">
                {current?.mentions_24h_ago ?? "—"}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">24h prior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>30g değişim</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : change !== null ? (
              <div
                className={`text-2xl font-semibold tabular-nums ${
                  change >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {change >= 0 ? "+" : ""}
                {change.toFixed(0)}%
              </div>
            ) : (
              <div className="text-2xl text-muted-foreground">—</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {chartData.length} data point
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rank</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-semibold tabular-nums">
                {current?.rank ? `#${current.rank}` : "—"}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {current?.rank_24h_ago ? `24h: #${current.rank_24h_ago}` : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <CardTitle>Mention Tarihçesi</CardTitle>
              <CardDescription>
                Son 30 gün · 6 saatte bir snapshot
              </CardDescription>
            </div>
            {chartData.length > 1 && (
              <div className="flex items-center gap-2 text-xs">
                <div className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Tepe</div>
                  <div className="font-bold text-emerald-400 tabular-nums">{peakMention}</div>
                </div>
                <div className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Ortalama</div>
                  <div className="font-bold text-foreground tabular-nums">{avgMention}</div>
                </div>
                <div className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Veri</div>
                  <div className="font-bold text-foreground tabular-nums">{chartData.length}</div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : chartData.length > 1 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mentionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.15}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgb(16 185 129)", strokeWidth: 1, strokeDasharray: "3 3" }} />
                  <ReferenceLine
                    y={avgMention}
                    stroke="rgb(245 158 11)"
                    strokeDasharray="4 4"
                    strokeOpacity={0.5}
                    label={{
                      value: `Ort: ${avgMention}`,
                      position: "right",
                      fontSize: 9,
                      fill: "rgb(245 158 11)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mentions"
                    stroke="rgb(16 185 129)"
                    strokeWidth={2.5}
                    fill="url(#mentionGradient)"
                    activeDot={{
                      r: 5,
                      stroke: "rgb(16 185 129)",
                      strokeWidth: 2,
                      fill: "hsl(var(--background))",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Yeterli tarihçe yok. Her 6 saatte bir snapshot biriktiriyoruz.
            </div>
          )}
        </CardContent>
      </Card>

      {current && (
        <Card>
          <CardHeader>
            <CardTitle>Son tarama detay</CardTitle>
            <CardDescription>{fmtDate(current.scraped_at)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div className="text-xs text-muted-foreground">Bullish</div>
                <div className="font-mono text-emerald-400">{current.bullish}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Bearish</div>
                <div className="font-mono text-red-400">{current.bearish}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Neutral</div>
                <div className="font-mono text-muted-foreground">{current.neutral}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Upvotes</div>
                <div className="font-mono">{current.upvotes?.toLocaleString()}</div>
              </div>
            </div>
            {current.sample_title && (
              <div className="pt-3 border-t border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  AI yorumu:
                </div>
                <div className="text-sm">{current.sample_title}</div>
              </div>
            )}
            {current.sample_url && isAdmin && (
              <div>
                <a
                  href={current.sample_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  Topluluk araması <ExternalLink className="size-3" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
