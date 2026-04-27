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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

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
          <CardTitle>Mention Tarihçesi</CardTitle>
          <CardDescription>
            Son 30 gün — bot 6 saatte bir snapshot alır
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[260px] w-full" />
          ) : chartData.length > 1 ? (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="mentions"
                    stroke="rgb(52 211 153)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "rgb(52 211 153)" }}
                    activeDot={{ r: 5 }}
                    name="Mention"
                  />
                </LineChart>
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
