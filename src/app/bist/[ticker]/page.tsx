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
  AreaChart,
  Area,
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

  const priceChartData = (history ?? [])
    .filter((h) => h.price_current != null && h.price_current > 0)
    .map((h) => ({
      label: fmtDate(h.scraped_at),
      price: h.price_current,
      sentiment: h.final_score * 100, // -100..+100 ölçeğine çek
    }));

  // Y eksenini fiyat aralığına oturt (varsayılan [0, dataMax] dalgalanmayı düzleştiriyor)
  const prices = priceChartData.map((d) => d.price);
  const priceMin = prices.length ? Math.min(...prices) : 0;
  const priceMax = prices.length ? Math.max(...prices) : 0;
  const pricePad = Math.max((priceMax - priceMin) * 0.15, priceMax * 0.01, 1);
  const yDomain: [number, number] = [
    Math.max(priceMin - pricePad, 0),
    priceMax + pricePad,
  ];
  const priceAvg = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const priceFirst = prices[0] ?? 0;
  const priceLast = prices[prices.length - 1] ?? 0;
  const priceTrendUp = priceLast >= priceFirst;
  const accent = priceTrendUp ? "#10b981" : "#ef4444";
  const accentSoft = priceTrendUp ? "rgba(16,185,129,0.55)" : "rgba(239,68,68,0.55)";

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
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                {priceTrendUp ? (
                  <TrendingUp className="size-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="size-5 text-red-400" />
                )}
                30 günlük tarihçe
              </CardTitle>
              <CardDescription>
                Fiyat değişimi · 6 saatte bir snapshot
              </CardDescription>
            </div>
            {priceChartData.length > 1 && (
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: accent }} />
                  <span className="text-muted-foreground">Fiyat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-0.5"
                    style={{ borderTop: "2px dashed #71717a" }}
                  />
                  <span className="text-muted-foreground">
                    Ortalama ₺{priceAvg.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : priceChartData.length > 1 ? (
            <div className="h-[280px] w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={priceChartData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
                >
                  <defs>
                    <linearGradient id="bistPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accent} stopOpacity={0.55} />
                      <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#3a3a3a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#a1a1aa", fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: "#3a3a3a" }}
                    minTickGap={32}
                  />
                  <YAxis
                    domain={yDomain}
                    tick={{ fontSize: 11, fill: "#a1a1aa", fontWeight: 500 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      `₺${v >= 100 ? v.toFixed(0) : v.toFixed(2)}`
                    }
                    width={56}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f0f10",
                      border: `1px solid ${accent}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                      boxShadow: `0 4px 12px ${accentSoft}`,
                    }}
                    labelStyle={{ color: accent, fontWeight: 600 }}
                    formatter={(v) =>
                      typeof v === "number" ? [`₺${v.toFixed(2)}`, "Fiyat"] : ["—", "Fiyat"]
                    }
                  />
                  <ReferenceLine
                    y={priceAvg}
                    stroke="#71717a"
                    strokeDasharray="4 4"
                    label={{
                      value: `Ort ₺${priceAvg.toFixed(2)}`,
                      position: "insideTopRight",
                      fill: "#71717a",
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={accent}
                    fill="url(#bistPrice)"
                    strokeWidth={2.5}
                    name="Fiyat"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: accent,
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
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
          <CardTitle>Hızlı eylem</CardTitle>
          <CardDescription>Bu hisseyi Midas'tan al-sat</CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href={midasUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 hover:bg-emerald-500/30 transition-colors"
          >
            💰 Midas'ta aç <ExternalLink className="size-3" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
