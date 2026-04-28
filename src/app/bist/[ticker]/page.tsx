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
import { api, fmtDate, BistTicker } from "@/lib/api";
import { BistFundamentalsWidget } from "@/components/bist-fundamentals";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  FileText,
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

function SentimentBadge({ score, label }: { score: number | null; label: string | null }) {
  const lbl = label ?? (score !== null && score > 0.2 ? "bullish" : score !== null && score < -0.2 ? "bearish" : "neutral");
  if (lbl === "bullish") {
    return (
      <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-400">
        <TrendingUp className="size-3" /> bullish
      </Badge>
    );
  }
  if (lbl === "bearish") {
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

export default function BistTickerDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = use(params);
  const tk = ticker.toUpperCase();
  const [history, setHistory] = useState<{ scraped_at: string; price_current: number; price_change_pct: number; final_score: number; news_score: number | null; kap_score: number | null }[] | null>(null);
  const [current, setCurrent] = useState<BistTicker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [h, r] = await Promise.all([
          api.bist_ticker(tk, 30),
          api.bist_radar(150).catch(() => []),
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

  const priceChartData = (history ?? []).map((h) => ({
    label: fmtDate(h.scraped_at),
    price: h.price_current,
    sentiment: h.final_score * 100, // -100..+100 ölçeğine çek
  }));

  const midasUrl = `https://getmidas.com/tr/menkul-kiymetler/arama/${tk}`;
  const tvUrl = `https://www.tradingview.com/chart/?symbol=BIST:${tk}`;
  const yahooUrl = `https://finance.yahoo.com/quote/${tk}.IS`;
  const isYatirim = `https://www.isyatirim.com.tr/tr-tr/analiz/hisse/Sayfalar/sirket-karti.aspx?hisse=${tk}`;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/bist"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="size-4" /> BIST Radar
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-semibold tracking-tight font-mono">{tk}</h1>
          {current?.company_name && (
            <span className="text-muted-foreground text-lg">{current.company_name}</span>
          )}
          {current && <SentimentBadge score={current.final_score} label={current.sentiment_label} />}
          {current && current.kap_count > 0 && (
            <Badge variant="outline" className="border-amber-500/40 text-amber-400 gap-1">
              <FileText className="size-3" /> {current.kap_count} Resmi Açıklama
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Fiyat</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : current?.price_current != null ? (
              <>
                <div className="text-2xl font-semibold tabular-nums">
                  ₺{current.price_current.toFixed(2)}
                </div>
                <p
                  className={`text-xs mt-1 tabular-nums ${
                    (current.price_change_pct ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {(current.price_change_pct ?? 0) >= 0 ? "+" : ""}
                  {(current.price_change_pct ?? 0).toFixed(2)}% bugün
                </p>
              </>
            ) : (
              <div className="text-2xl text-muted-foreground">—</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Final Score</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div
                className={`text-2xl font-semibold tabular-nums ${
                  (current?.final_score ?? 0) > 0.2
                    ? "text-emerald-400"
                    : (current?.final_score ?? 0) < -0.2
                    ? "text-red-400"
                    : "text-muted-foreground"
                }`}
              >
                {((current?.final_score ?? 0) >= 0 ? "+" : "") +
                  (current?.final_score ?? 0).toFixed(2)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              -1 ↔ +1 arası
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Hacim</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : current?.volume != null ? (
              <div className="text-2xl font-semibold tabular-nums">
                {(current.volume / 1_000_000).toFixed(1)}M
              </div>
            ) : (
              <div className="text-2xl text-muted-foreground">—</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Piyasa Değeri</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : current?.market_cap != null ? (
              <div className="text-2xl font-semibold tabular-nums">
                ₺{(current.market_cap / 1_000_000_000).toFixed(1)}B
              </div>
            ) : (
              <div className="text-2xl text-muted-foreground">—</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>30 günlük tarihçe</CardTitle>
          <CardDescription>Fiyat değişimi · 6 saatte bir snapshot</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[260px] w-full" />
          ) : priceChartData.length > 1 ? (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₺${v.toFixed(0)}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                    formatter={(v) => (typeof v === "number" ? `₺${v.toFixed(2)}` : "—")}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="price" stroke="rgb(52 211 153)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Fiyat" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Henüz yeterli tarihçe yok. Bot 6 saatte bir snapshot biriktiriyor.
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-md border border-border/50 p-3">
                <div className="text-xs text-muted-foreground">📰 News Score</div>
                <div
                  className={`font-mono text-lg ${
                    (current.news_score ?? 0) > 0.2
                      ? "text-emerald-400"
                      : (current.news_score ?? 0) < -0.2
                      ? "text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {current.news_score != null ? ((current.news_score >= 0 ? "+" : "") + current.news_score.toFixed(2)) : "—"}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{current.news_count} haber</div>
              </div>
              <div className="rounded-md border border-border/50 p-3">
                <div className="text-xs text-muted-foreground">📋 Resmi Açıklama</div>
                <div
                  className={`font-mono text-lg ${
                    (current.kap_score ?? 0) > 0.2
                      ? "text-emerald-400"
                      : (current.kap_score ?? 0) < -0.2
                      ? "text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {current.kap_score != null && current.kap_count > 0
                    ? ((current.kap_score >= 0 ? "+" : "") + current.kap_score.toFixed(2))
                    : "—"}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{current.kap_count} açıklama</div>
              </div>
              <div className="rounded-md border border-border/50 p-3">
                <div className="text-xs text-muted-foreground">📊 Price Score</div>
                <div
                  className={`font-mono text-lg ${
                    (current.price_score ?? 0) > 0.2
                      ? "text-emerald-400"
                      : (current.price_score ?? 0) < -0.2
                      ? "text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {current.price_score != null ? ((current.price_score >= 0 ? "+" : "") + current.price_score.toFixed(2)) : "—"}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">günlük % normalize</div>
              </div>
            </div>

            {current.kap_summary && (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                <div className="text-xs text-amber-400 mb-1 font-medium">📋 Resmi açıklama özeti:</div>
                <div className="text-sm">{current.kap_summary}</div>
              </div>
            )}

            {current.news_reason && (
              <div className="rounded-md border border-border/50 p-3">
                <div className="text-xs text-muted-foreground mb-1">📰 Haber yorumu (AI):</div>
                <div className="text-sm">{current.news_reason}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* yfinance fundamentals — mali tablo + oran + analist */}
      <BistFundamentalsWidget ticker={tk} />

      <Card>
        <CardHeader>
          <CardTitle>Hızlı eylemler</CardTitle>
          <CardDescription>Midas'ta al-sat veya teknik analiz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <a
              href={midasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-2 hover:bg-emerald-500/30 transition-colors"
            >
              💰 Midas'ta aç <ExternalLink className="size-3" />
            </a>
            <a
              href={tvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm rounded-md border border-border px-3 py-2 hover:bg-accent transition-colors"
            >
              📊 Grafik <ExternalLink className="size-3" />
            </a>
            <a
              href={yahooUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm rounded-md border border-border px-3 py-2 hover:bg-accent transition-colors"
            >
              Hisse Detay <ExternalLink className="size-3" />
            </a>
            <a
              href={isYatirim}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm rounded-md border border-border px-3 py-2 hover:bg-accent transition-colors"
            >
              İş Yatırım <ExternalLink className="size-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
