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
import { authApi, BistFundamentals } from "@/lib/auth";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  AlertCircle,
  BarChart3,
  Target,
} from "lucide-react";

const fmtBigNum = (n: number | null | undefined, currency = "TRY"): string => {
  if (n === null || n === undefined) return "—";
  const sign = currency === "TRY" ? "₺" : "$";
  const abs = Math.abs(n);
  if (abs >= 1e12) return `${sign}${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${(n / 1e3).toFixed(2)}K`;
  return `${sign}${n.toFixed(2)}`;
};

const fmtPct = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "—";
  return `${(n * 100).toFixed(2)}%`;
};

const fmtRatio = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "—";
  return n.toFixed(2);
};

function RatioCard({
  label,
  value,
  hint,
  good,
}: {
  label: string;
  value: string;
  hint?: string;
  good?: "up" | "down" | "neutral";
}) {
  const color =
    good === "up"
      ? "text-emerald-400"
      : good === "down"
        ? "text-red-400"
        : "text-foreground";
  return (
    <div className="rounded-md border border-border/60 bg-card/40 p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className={`text-lg font-semibold tabular-nums mt-0.5 ${color}`}>
        {value}
      </div>
      {hint && <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}

function RecBadge({
  recKey,
  mean,
}: {
  recKey: string | null;
  mean: number | null;
}) {
  if (!recKey)
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Veri yok
      </Badge>
    );
  const map: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    strong_buy: {
      label: "Güçlü Al",
      color: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
      icon: TrendingUp,
    },
    buy: {
      label: "Al",
      color: "border-emerald-500/30 text-emerald-400",
      icon: TrendingUp,
    },
    hold: { label: "Tut", color: "border-amber-500/30 text-amber-400", icon: Minus },
    sell: { label: "Sat", color: "border-red-500/30 text-red-400", icon: TrendingDown },
    strong_sell: {
      label: "Güçlü Sat",
      color: "border-red-500/40 text-red-300 bg-red-500/10",
      icon: TrendingDown,
    },
    underperform: {
      label: "Zayıf",
      color: "border-red-500/30 text-red-400",
      icon: TrendingDown,
    },
  };
  const cfg = map[recKey.toLowerCase()] ?? map["hold"];
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={`gap-1 ${cfg.color}`}>
      <Icon className="size-3" />
      <span className="font-semibold">{cfg.label}</span>
      {mean && <span className="text-[10px] opacity-70">{mean.toFixed(2)}/5</span>}
    </Badge>
  );
}

export function BistFundamentalsWidget({ ticker }: { ticker: string }) {
  const [data, setData] = useState<BistFundamentals | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    authApi
      .bistFundamentals(ticker)
      .then((d) => {
        if (alive) setData(d);
      })
      .catch((e) => {
        if (alive) setErr(e instanceof Error ? e.message : "Yüklenemedi");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [ticker]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="size-4" /> Mali Tablo & Oran Analizi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (err || !data || !data.name) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-5 text-sm text-muted-foreground flex items-start gap-2">
          <AlertCircle className="size-4 text-amber-400 mt-0.5" />
          <span>Bu hisse için detaylı mali veri şu an alınamıyor. Birkaç dakika sonra tekrar dene.</span>
        </CardContent>
      </Card>
    );
  }

  const upsidePct =
    data.price && data.analyst.target_mean
      ? ((data.analyst.target_mean - data.price) / data.price) * 100
      : null;

  const cur = data.currency || "TRY";

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="size-4" /> Mali Tablo & Oran Analizi
              </CardTitle>
              <CardDescription className="mt-1">
                {data.name}{" "}
                {data.sector && (
                  <Badge variant="outline" className="ml-1 text-[10px]">
                    {data.sector}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <RecBadge recKey={data.analyst.recommendation_key} mean={data.analyst.recommendation_mean} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <RatioCard label="Piyasa Değeri" value={fmtBigNum(data.market_cap, cur)} />
            <RatioCard
              label="52H Yüksek/Düşük"
              value={
                data.fifty_two_week_high && data.fifty_two_week_low
                  ? `${data.fifty_two_week_low.toFixed(0)}–${data.fifty_two_week_high.toFixed(0)}`
                  : "—"
              }
              hint={data.price ? `Şu an: ${data.price.toFixed(2)}` : undefined}
            />
            <RatioCard
              label="Analist Hedef"
              value={data.analyst.target_mean ? data.analyst.target_mean.toFixed(2) : "—"}
              hint={
                upsidePct !== null
                  ? `${upsidePct >= 0 ? "+" : ""}${upsidePct.toFixed(1)}% potansiyel`
                  : undefined
              }
              good={upsidePct !== null ? (upsidePct > 0 ? "up" : "down") : "neutral"}
            />
            <RatioCard
              label="Analist Sayısı"
              value={data.analyst.num_analysts?.toString() ?? "—"}
              hint={
                data.analyst.target_high && data.analyst.target_low
                  ? `${data.analyst.target_low.toFixed(0)}–${data.analyst.target_high.toFixed(0)} aralık`
                  : undefined
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Oran Analizi */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Oran Analizi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <RatioCard
              label="F/K (Trailing)"
              value={fmtRatio(data.ratios.trailing_pe)}
              hint="Geçmiş 12 ay"
            />
            <RatioCard
              label="F/K (Forward)"
              value={fmtRatio(data.ratios.forward_pe)}
              hint="Tahmini 12 ay"
              good={
                data.ratios.forward_pe && data.ratios.trailing_pe
                  ? data.ratios.forward_pe < data.ratios.trailing_pe
                    ? "up"
                    : undefined
                  : undefined
              }
            />
            <RatioCard label="P/B (PD/DD)" value={fmtRatio(data.ratios.price_to_book)} />
            <RatioCard label="P/S" value={fmtRatio(data.ratios.price_to_sales)} />
            <RatioCard
              label="ROE"
              value={fmtPct(data.ratios.roe)}
              hint="Özsermaye karlılığı"
              good={data.ratios.roe && data.ratios.roe > 0.15 ? "up" : undefined}
            />
            <RatioCard
              label="ROA"
              value={fmtPct(data.ratios.roa)}
              hint="Aktif karlılığı"
            />
            <RatioCard
              label="Net Kar Marjı"
              value={fmtPct(data.ratios.profit_margin)}
              good={data.ratios.profit_margin && data.ratios.profit_margin > 0.1 ? "up" : undefined}
            />
            <RatioCard
              label="Borç/Özsermaye"
              value={fmtRatio(data.ratios.debt_to_equity)}
              hint="Düşük = sağlam"
              good={
                data.ratios.debt_to_equity && data.ratios.debt_to_equity < 50 ? "up" : "down"
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Mali Özet */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Mali Özet (TTM — son 12 ay)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <RatioCard
              label="Toplam Gelir"
              value={fmtBigNum(data.financials_summary.total_revenue, cur)}
              hint={
                data.growth.revenue_growth !== null
                  ? `${data.growth.revenue_growth >= 0 ? "+" : ""}${(data.growth.revenue_growth * 100).toFixed(1)}% büyüme`
                  : undefined
              }
              good={data.growth.revenue_growth && data.growth.revenue_growth > 0 ? "up" : undefined}
            />
            <RatioCard
              label="EBITDA"
              value={fmtBigNum(data.financials_summary.ebitda, cur)}
            />
            <RatioCard
              label="Net Kar"
              value={fmtBigNum(data.financials_summary.net_income, cur)}
              hint={
                data.growth.earnings_growth !== null
                  ? `${data.growth.earnings_growth >= 0 ? "+" : ""}${(data.growth.earnings_growth * 100).toFixed(1)}% büyüme`
                  : undefined
              }
              good={data.growth.earnings_growth && data.growth.earnings_growth > 0 ? "up" : "down"}
            />
            <RatioCard
              label="Serbest Nakit Akışı"
              value={fmtBigNum(data.financials_summary.free_cashflow, cur)}
            />
            <RatioCard
              label="Toplam Nakit"
              value={fmtBigNum(data.financials_summary.total_cash, cur)}
            />
            <RatioCard
              label="Toplam Borç"
              value={fmtBigNum(data.financials_summary.total_debt, cur)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Analist Dağılımı */}
      {data.analyst.trend && data.analyst.trend.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="size-4" /> Analist Tavsiye Dağılımı
            </CardTitle>
            <CardDescription>
              {data.analyst.num_analysts} analist · son 4 ay trend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.analyst.trend.slice(0, 4).map((t, i) => {
                const total =
                  t.strong_buy + t.buy + t.hold + t.sell + t.strong_sell;
                if (total === 0) return null;
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-12 text-muted-foreground font-mono">
                      {t.period || "?"}
                    </span>
                    <div className="flex-1 flex h-5 rounded-sm overflow-hidden border border-border/60">
                      {t.strong_buy > 0 && (
                        <div
                          className="bg-emerald-500/70 flex items-center justify-center text-[10px] text-black font-medium"
                          style={{ width: `${(t.strong_buy / total) * 100}%` }}
                        >
                          {t.strong_buy}
                        </div>
                      )}
                      {t.buy > 0 && (
                        <div
                          className="bg-emerald-500/40 flex items-center justify-center text-[10px]"
                          style={{ width: `${(t.buy / total) * 100}%` }}
                        >
                          {t.buy}
                        </div>
                      )}
                      {t.hold > 0 && (
                        <div
                          className="bg-amber-500/40 flex items-center justify-center text-[10px]"
                          style={{ width: `${(t.hold / total) * 100}%` }}
                        >
                          {t.hold}
                        </div>
                      )}
                      {t.sell > 0 && (
                        <div
                          className="bg-red-500/40 flex items-center justify-center text-[10px]"
                          style={{ width: `${(t.sell / total) * 100}%` }}
                        >
                          {t.sell}
                        </div>
                      )}
                      {t.strong_sell > 0 && (
                        <div
                          className="bg-red-500/70 flex items-center justify-center text-[10px] text-black font-medium"
                          style={{ width: `${(t.strong_sell / total) * 100}%` }}
                        >
                          {t.strong_sell}
                        </div>
                      )}
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{total}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex gap-3 text-[10px] text-muted-foreground flex-wrap">
              <span>
                <span className="inline-block size-2 bg-emerald-500/70 mr-1" /> Güçlü Al
              </span>
              <span>
                <span className="inline-block size-2 bg-emerald-500/40 mr-1" /> Al
              </span>
              <span>
                <span className="inline-block size-2 bg-amber-500/40 mr-1" /> Tut
              </span>
              <span>
                <span className="inline-block size-2 bg-red-500/40 mr-1" /> Sat
              </span>
              <span>
                <span className="inline-block size-2 bg-red-500/70 mr-1" /> Güçlü Sat
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Yıllık trendler */}
      {data.annual_financials && data.annual_financials.length >= 2 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="size-4" /> Yıllık Mali Trend
            </CardTitle>
            <CardDescription>Son 3 yıl gelir tablosu özeti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[400px]">
                <thead>
                  <tr className="text-muted-foreground border-b border-border">
                    <th className="text-left py-2">Kalem</th>
                    {data.annual_financials.map((y) => (
                      <th key={y.period} className="text-right py-2 px-2">
                        {y.period.slice(0, 4)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Total Revenue", "Toplam Gelir"],
                    ["Operating Revenue", "Faaliyet Geliri"],
                    ["Gross Profit", "Brüt Kar"],
                    ["Operating Income", "Faaliyet Karı"],
                    ["EBITDA", "EBITDA"],
                    ["Net Income", "Net Kar"],
                    ["Basic EPS", "EPS (Hisse Başı Kar)"],
                  ].map(([key, label]) => {
                    const hasData = data.annual_financials.some(
                      (y) => typeof y[key] === "number",
                    );
                    if (!hasData) return null;
                    return (
                      <tr key={key} className="border-b border-border/30">
                        <td className="py-2 text-muted-foreground">{label}</td>
                        {data.annual_financials.map((y) => (
                          <td
                            key={y.period}
                            className="text-right py-2 px-2 tabular-nums font-mono"
                          >
                            {typeof y[key] === "number"
                              ? fmtBigNum(y[key] as number, cur)
                              : "—"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
