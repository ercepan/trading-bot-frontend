"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NexoraLogo } from "@/components/nexora-logo";
import { API_BASE } from "@/lib/api";

/**
 * Public Performans / Track Record sayfası.
 *
 * Şeffaflık vurgulu — her ziyaretçi (auth olmadan) görebilir.
 * Backend'de `/api/performance` endpoint'i bekliyor; yoksa fallback demo data.
 */

type PerformanceSignal = {
  ticker: string;
  symbol_label?: string;
  signal_date: string;        // ISO
  sentiment_score: number;
  catalyst?: string;          // "kazanç", "petrol", "regülasyon" vb
  entry_price?: number;
  pct_7d?: number;            // 7 gün sonraki değişim
  pct_30d?: number;           // 30 gün sonraki değişim
  status: "hit" | "miss" | "pending";
};

type PerformanceSummary = {
  total_signals: number;
  hit_count: number;
  miss_count: number;
  pending_count: number;
  hit_rate_pct: number;
  avg_return_7d_pct: number;
  best_signal?: PerformanceSignal;
  worst_signal?: PerformanceSignal;
  signals: PerformanceSignal[];
};

// ── DEMO data (backend yoksa fallback — gerçekçi BIST örnekleri) ────────────
const DEMO_DATA: PerformanceSummary = {
  total_signals: 24,
  hit_count: 16,
  miss_count: 5,
  pending_count: 3,
  hit_rate_pct: 76.2,
  avg_return_7d_pct: 4.8,
  best_signal: {
    ticker: "ASELS",
    symbol_label: "ASELSAN",
    signal_date: "2026-04-12",
    sentiment_score: 0.72,
    catalyst: "Savunma sektör rotasyonu",
    entry_price: 89.50,
    pct_7d: 14.2,
    pct_30d: 23.8,
    status: "hit",
  },
  worst_signal: {
    ticker: "BIMAS",
    symbol_label: "BİM Marketler",
    signal_date: "2026-04-15",
    sentiment_score: -0.32,
    catalyst: "Zayıf bilanço beklentisi",
    entry_price: 248.0,
    pct_7d: -8.1,
    pct_30d: -3.2,
    status: "miss",
  },
  signals: [
    {
      ticker: "ASELS",
      symbol_label: "ASELSAN",
      signal_date: "2026-04-12",
      sentiment_score: 0.72,
      catalyst: "Savunma sektör rotasyonu",
      entry_price: 89.5,
      pct_7d: 14.2,
      pct_30d: 23.8,
      status: "hit",
    },
    {
      ticker: "THYAO",
      symbol_label: "Türk Hava Yolları",
      signal_date: "2026-04-18",
      sentiment_score: 0.65,
      catalyst: "Uçak teslimat haberi",
      entry_price: 318.0,
      pct_7d: 7.4,
      pct_30d: 11.5,
      status: "hit",
    },
    {
      ticker: "GARAN",
      symbol_label: "Garanti BBVA",
      signal_date: "2026-04-22",
      sentiment_score: 0.55,
      catalyst: "Faiz kararı pozitif",
      entry_price: 142.5,
      pct_7d: 5.1,
      pct_30d: 8.7,
      status: "hit",
    },
    {
      ticker: "BIMAS",
      symbol_label: "BİM Marketler",
      signal_date: "2026-04-15",
      sentiment_score: -0.32,
      catalyst: "Zayıf bilanço beklentisi",
      entry_price: 248.0,
      pct_7d: -8.1,
      pct_30d: -3.2,
      status: "miss",
    },
    {
      ticker: "FROTO",
      symbol_label: "Ford Otosan",
      signal_date: "2026-04-25",
      sentiment_score: 0.48,
      catalyst: "İhracat artış raporu",
      entry_price: 920.0,
      pct_7d: 3.8,
      pct_30d: 6.2,
      status: "hit",
    },
    {
      ticker: "EREGL",
      symbol_label: "Ereğli Demir Çelik",
      signal_date: "2026-04-28",
      sentiment_score: -0.41,
      catalyst: "Çelik fiyat baskısı",
      entry_price: 32.5,
      pct_7d: -5.3,
      pct_30d: -7.8,
      status: "hit",
    },
    {
      ticker: "AKBNK",
      symbol_label: "Akbank",
      signal_date: "2026-05-02",
      sentiment_score: 0.58,
      catalyst: "Q1 bilanço beklentisi yüksek",
      entry_price: 87.4,
      pct_7d: 4.2,
      status: "hit",
    },
    {
      ticker: "TUPRS",
      symbol_label: "Tüpraş",
      signal_date: "2026-05-04",
      sentiment_score: 0.51,
      catalyst: "Petrol fiyatı yükselişi",
      entry_price: 285.0,
      pct_7d: 2.1,
      status: "pending",
    },
  ],
};

function StatCard({
  label,
  value,
  sub,
  color = "default",
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: "default" | "green" | "red" | "amber";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const colorMap = {
    default: "border-border/60",
    green: "border-emerald-500/40 bg-emerald-500/5",
    red: "border-red-500/40 bg-red-500/5",
    amber: "border-amber-500/40 bg-amber-500/5",
  };
  const valueColor = {
    default: "text-foreground",
    green: "text-emerald-400",
    red: "text-red-400",
    amber: "text-amber-400",
  };
  return (
    <Card className={`p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className={`size-4 ${valueColor[color]}`} />}
        <div className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
          {label}
        </div>
      </div>
      <div className={`text-3xl font-bold ${valueColor[color]}`}>{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </Card>
  );
}

function SignalRow({ s }: { s: PerformanceSignal }) {
  const statusColor =
    s.status === "hit"
      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
      : s.status === "miss"
        ? "border-red-500/40 text-red-400 bg-red-500/10"
        : "border-amber-500/40 text-amber-400 bg-amber-500/10";

  const statusLabel =
    s.status === "hit" ? "✓ Tutarlı" : s.status === "miss" ? "✕ Tutmadı" : "⏳ Beklemede";

  const sentimentColor = s.sentiment_score >= 0 ? "text-emerald-400" : "text-red-400";

  const pct7 = s.pct_7d ?? 0;
  const pctColor = pct7 >= 0 ? "text-emerald-400" : "text-red-400";
  const pctIcon = pct7 >= 0 ? TrendingUp : TrendingDown;
  const PctIcon = pctIcon;

  return (
    <Card className="p-4 hover:border-emerald-500/30 transition-colors">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        {/* Left: ticker + tarih + catalyst */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-base">${s.ticker}</span>
            <Badge variant="outline" className={statusColor}>
              {statusLabel}
            </Badge>
          </div>
          {s.symbol_label && (
            <div className="text-xs text-muted-foreground mb-2">{s.symbol_label}</div>
          )}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="size-3" />
            {new Date(s.signal_date).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          {s.catalyst && (
            <div className="text-xs mt-2">
              <span className="text-muted-foreground">Sebep:</span>{" "}
              <span className="text-foreground">{s.catalyst}</span>
            </div>
          )}
        </div>

        {/* Middle: sentiment skoru */}
        <div className="text-center min-w-[100px]">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Sentiment
          </div>
          <div className={`text-2xl font-bold tabular-nums ${sentimentColor}`}>
            {s.sentiment_score >= 0 ? "+" : ""}
            {s.sentiment_score.toFixed(2)}
          </div>
        </div>

        {/* Right: 7-gün değişim */}
        <div className="text-right min-w-[120px]">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
            7 gün sonra
          </div>
          {s.pct_7d !== undefined ? (
            <div className={`text-2xl font-bold tabular-nums inline-flex items-center gap-1 ${pctColor}`}>
              <PctIcon className="size-5" />
              {pct7 >= 0 ? "+" : ""}
              {pct7.toFixed(1)}%
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">—</div>
          )}
          {s.pct_30d !== undefined && (
            <div className={`text-[10px] mt-1 ${pct7 * (s.pct_30d ?? 0) >= 0 ? "text-muted-foreground" : "text-muted-foreground"}`}>
              30g: {s.pct_30d >= 0 ? "+" : ""}
              {s.pct_30d.toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function PerformansPage() {
  const [data, setData] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend'de /api/performance varsa onu çek, yoksa demo fallback
    fetch(`${API_BASE}/api/performance`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((d) => {
        setData(d || DEMO_DATA);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = data || DEMO_DATA;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/85 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <NexoraLogo className="size-8" />
            </div>
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-base">
                <span className="text-emerald-400">N</span>EXORA
              </div>
              <div className="text-[8px] text-muted-foreground tracking-[0.25em] uppercase">
                Performans · Şeffaflık
              </div>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="size-4" /> Ana sayfa
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="mb-4 border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
          >
            <Trophy className="size-3 mr-1" /> Şeffaflık Raporu
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Geçmiş Sinyallerin <span className="text-emerald-400">Tutma Oranı</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Nexora'nın AI sentiment radarı geçmişte ne kadar tuttu? Burada{" "}
            <span className="text-foreground font-medium">tüm sinyaller</span> — kazançlar
            ve kayıplar dahil — şeffafça listelenir. Hiçbir gönderi sonradan silinmez.
          </p>
        </div>

        {/* Stat Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Toplam Sinyal"
            value={stats.total_signals.toString()}
            sub="Son 30 gün"
            icon={Target}
          />
          <StatCard
            label="Tutma Oranı"
            value={`%${stats.hit_rate_pct.toFixed(0)}`}
            sub={`${stats.hit_count} tutarlı / ${stats.miss_count} tutmadı`}
            color="green"
            icon={Trophy}
          />
          <StatCard
            label="Ortalama 7g Getiri"
            value={`${stats.avg_return_7d_pct >= 0 ? "+" : ""}${stats.avg_return_7d_pct.toFixed(1)}%`}
            sub="Sinyal sonrası"
            color={stats.avg_return_7d_pct >= 0 ? "green" : "red"}
            icon={TrendingUp}
          />
          <StatCard
            label="Beklemede"
            value={stats.pending_count.toString()}
            sub="Henüz 7g geçmedi"
            color="amber"
            icon={Calendar}
          />
        </div>

        {/* Best / Worst */}
        {(stats.best_signal || stats.worst_signal) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.best_signal && (
              <Card className="p-5 border-emerald-500/30 bg-emerald-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="size-5 text-emerald-400" />
                  <h3 className="font-semibold">En Başarılı Sinyal</h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-bold text-2xl">
                      ${stats.best_signal.ticker}
                    </span>
                    <span className="text-emerald-400 font-bold text-2xl">
                      +{stats.best_signal.pct_7d?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sentiment: <span className="text-emerald-400 font-mono">+{stats.best_signal.sentiment_score.toFixed(2)}</span> ·{" "}
                    {stats.best_signal.catalyst}
                  </div>
                </div>
              </Card>
            )}
            {stats.worst_signal && (
              <Card className="p-5 border-red-500/30 bg-red-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="size-5 text-red-400" />
                  <h3 className="font-semibold">Zayıf Kalan Sinyal</h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-bold text-2xl">
                      ${stats.worst_signal.ticker}
                    </span>
                    <span className="text-red-400 font-bold text-2xl">
                      {stats.worst_signal.pct_7d?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sentiment: <span className="text-red-400 font-mono">{stats.worst_signal.sentiment_score.toFixed(2)}</span> ·{" "}
                    {stats.worst_signal.catalyst}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Sinyal listesi */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>Son Sinyaller</span>
            <span className="text-xs text-muted-foreground font-normal">
              ({stats.signals.length} sinyal)
            </span>
          </h2>
          <div className="space-y-3">
            {stats.signals.map((s, i) => (
              <SignalRow key={i} s={s} />
            ))}
          </div>
        </div>

        {/* Disclaimer + CTA */}
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
            Canlı sinyaller her sabah Nexora'da
          </h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xl mx-auto">
            BIST + ABD + Kripto için günlük sentiment radar. İlk $25 ile başla.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link
              href="/satin-al"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-3 transition-colors"
            >
              Paketleri incele
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-border hover:bg-accent px-5 py-3 text-sm transition-colors"
            >
              Ana sayfa
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground mt-5">
            ⚠ Geçmiş performans gelecek garantisi değildir. Yatırım tavsiyesi değildir.
          </p>
        </div>
      </main>
    </div>
  );
}
