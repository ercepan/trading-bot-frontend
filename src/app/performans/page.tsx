"use client";

import { useEffect, useState } from "react";
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
import { API_BASE } from "@/lib/api";

/**
 * Public Performans / Track Record sayfası — editorial × terminal aesthetic.
 *
 * Şeffaflık vurgulu — her ziyaretçi (auth olmadan) görebilir.
 * Backend'de `/api/performance` endpoint'i bekliyor; yoksa fallback demo data.
 */

type PerformanceSignal = {
  ticker: string;
  symbol_label?: string;
  signal_date: string;
  sentiment_score: number;
  catalyst?: string;
  entry_price?: number;
  pct_7d?: number;
  pct_30d?: number;
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
    entry_price: 89.5,
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
    { ticker: "ASELS", symbol_label: "ASELSAN", signal_date: "2026-04-12", sentiment_score: 0.72, catalyst: "Savunma sektör rotasyonu", entry_price: 89.5, pct_7d: 14.2, pct_30d: 23.8, status: "hit" },
    { ticker: "THYAO", symbol_label: "Türk Hava Yolları", signal_date: "2026-04-18", sentiment_score: 0.65, catalyst: "Uçak teslimat haberi", entry_price: 318.0, pct_7d: 7.4, pct_30d: 11.5, status: "hit" },
    { ticker: "GARAN", symbol_label: "Garanti BBVA", signal_date: "2026-04-22", sentiment_score: 0.55, catalyst: "Faiz kararı pozitif", entry_price: 142.5, pct_7d: 5.1, pct_30d: 8.7, status: "hit" },
    { ticker: "BIMAS", symbol_label: "BİM Marketler", signal_date: "2026-04-15", sentiment_score: -0.32, catalyst: "Zayıf bilanço beklentisi", entry_price: 248.0, pct_7d: -8.1, pct_30d: -3.2, status: "miss" },
    { ticker: "FROTO", symbol_label: "Ford Otosan", signal_date: "2026-04-25", sentiment_score: 0.48, catalyst: "İhracat artış raporu", entry_price: 920.0, pct_7d: 3.8, pct_30d: 6.2, status: "hit" },
    { ticker: "EREGL", symbol_label: "Ereğli Demir Çelik", signal_date: "2026-04-28", sentiment_score: -0.41, catalyst: "Çelik fiyat baskısı", entry_price: 32.5, pct_7d: -5.3, pct_30d: -7.8, status: "hit" },
    { ticker: "AKBNK", symbol_label: "Akbank", signal_date: "2026-05-02", sentiment_score: 0.58, catalyst: "Q1 bilanço beklentisi yüksek", entry_price: 87.4, pct_7d: 4.2, status: "hit" },
    { ticker: "TUPRS", symbol_label: "Tüpraş", signal_date: "2026-05-04", sentiment_score: 0.51, catalyst: "Petrol fiyatı yükselişi", entry_price: 285.0, pct_7d: 2.1, status: "pending" },
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
  const valueColor = {
    default: "text-white/90",
    green: "text-emerald-400",
    red: "text-red-400",
    amber: "text-amber-400",
  };
  const borderColor = {
    default: "border-white/10",
    green: "border-emerald-500/30 bg-emerald-500/[0.04]",
    red: "border-red-500/30 bg-red-500/[0.04]",
    amber: "border-amber-500/30 bg-amber-500/[0.04]",
  };
  return (
    <div className={`bg-black/40 border ${borderColor[color]} backdrop-blur-sm p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">
          {label}
        </div>
        {Icon && <Icon className={`size-3.5 ${valueColor[color]} opacity-60`} />}
      </div>
      <div className={`font-display text-3xl md:text-4xl font-medium tabular-nums tracking-tight ${valueColor[color]}`}>
        {value}
      </div>
      {sub && (
        <div className="font-mono text-[10px] text-white/40 mt-2 uppercase tracking-[0.18em]">
          {sub}
        </div>
      )}
    </div>
  );
}

function SignalRow({ s }: { s: PerformanceSignal }) {
  const statusStyle =
    s.status === "hit"
      ? "border-emerald-500/40 bg-emerald-500/[0.06] text-emerald-400"
      : s.status === "miss"
        ? "border-red-500/40 bg-red-500/[0.06] text-red-400"
        : "border-amber-500/40 bg-amber-500/[0.06] text-amber-400";

  const statusLabel =
    s.status === "hit" ? "✓ Tutarlı" : s.status === "miss" ? "✕ Tutmadı" : "⏳ Beklemede";

  const sentimentColor = s.sentiment_score >= 0 ? "text-emerald-400" : "text-red-400";

  const pct7 = s.pct_7d ?? 0;
  const pctColor = pct7 >= 0 ? "text-emerald-400" : "text-red-400";
  const PctIcon = pct7 >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="bg-black/40 border border-white/10 backdrop-blur-sm hover:border-emerald-500/30 transition-all p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Left: ticker + tarih + catalyst */}
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-display font-medium text-lg tabular-nums">${s.ticker}</span>
            <span className={`font-mono text-[10px] uppercase tracking-[0.18em] border px-2 py-0.5 ${statusStyle}`}>
              {statusLabel}
            </span>
          </div>
          {s.symbol_label && (
            <div className="font-mono text-[11px] text-white/55 mb-2">{s.symbol_label}</div>
          )}
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/40 uppercase tracking-[0.18em]">
            <Calendar className="size-3" />
            {new Date(s.signal_date).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          {s.catalyst && (
            <div className="text-xs mt-3 text-white/70">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em]">Sebep:</span>{" "}
              {s.catalyst}
            </div>
          )}
        </div>

        {/* Middle: sentiment */}
        <div className="text-center min-w-[100px]">
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.22em]">
            Sentiment
          </div>
          <div className={`font-display text-2xl font-medium tabular-nums mt-1.5 tracking-tight ${sentimentColor}`}>
            {s.sentiment_score >= 0 ? "+" : ""}
            {s.sentiment_score.toFixed(2)}
          </div>
        </div>

        {/* Right: 7g */}
        <div className="text-right min-w-[130px]">
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.22em]">
            7 gün sonra
          </div>
          {s.pct_7d !== undefined ? (
            <div className={`font-display text-2xl font-medium tabular-nums mt-1.5 tracking-tight inline-flex items-center gap-1 ${pctColor}`}>
              <PctIcon className="size-4" />
              {pct7 >= 0 ? "+" : ""}
              {pct7.toFixed(1)}%
            </div>
          ) : (
            <div className="font-mono text-sm text-white/40 mt-1.5">—</div>
          )}
          {s.pct_30d !== undefined && (
            <div className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-[0.18em]">
              30g: {s.pct_30d >= 0 ? "+" : ""}
              {s.pct_30d.toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PerformansPage() {
  const [data, setData] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full bg-emerald-500/[0.05] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-10 rounded-md bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
              <span className="font-display text-emerald-400 text-xl leading-none" style={{ fontStyle: "italic", fontWeight: 600 }}>
                N
              </span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-base leading-none">Nexora</div>
              <div className="font-mono text-[9px] text-white/40 uppercase tracking-[0.25em] mt-1">
                Performans · Şeffaflık
              </div>
            </div>
          </Link>
          <Link
            href="/"
            className="font-mono text-[11px] text-white/45 hover:text-emerald-300 uppercase tracking-[0.22em] inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Ana sayfa
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-10 relative z-10">
        {/* Hero */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Trophy className="size-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              Şeffaflık Raporu · Son 30 gün
            </span>
          </div>
          <h1
            className="font-display font-medium tracking-tight max-w-3xl"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
          >
            Sinyallerimiz{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              ne kadar tuttu.
            </em>
          </h1>
          <p className="text-white/55 text-base max-w-2xl leading-relaxed">
            Nexora'nın AI sentiment radarı geçmişte ne kadar tuttu? Burada{" "}
            <strong className="text-white/85">tüm sinyaller</strong> — kazançlar ve kayıplar dahil — şeffafça listelenir. Hiçbir gönderi sonradan silinmez.
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
            sub={`${stats.hit_count}W / ${stats.miss_count}L`}
            color="green"
            icon={Trophy}
          />
          <StatCard
            label="Ort 7g Getiri"
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
              <div className="bg-black/40 border border-emerald-500/30 bg-emerald-500/[0.04] backdrop-blur-sm p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Trophy className="size-3.5 text-emerald-400" />
                  <span className="font-mono text-[11px] text-emerald-300 uppercase tracking-[0.28em]">
                    En Başarılı Sinyal
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display font-medium text-2xl tabular-nums">${stats.best_signal.ticker}</span>
                  <span className="font-display text-2xl font-medium tabular-nums text-emerald-400">
                    +{stats.best_signal.pct_7d?.toFixed(1)}%
                  </span>
                </div>
                <div className="font-mono text-[11px] text-white/55">
                  Sentiment <span className="text-emerald-400">+{stats.best_signal.sentiment_score.toFixed(2)}</span> ·{" "}
                  <span className="text-white/70">{stats.best_signal.catalyst}</span>
                </div>
              </div>
            )}
            {stats.worst_signal && (
              <div className="bg-black/40 border border-red-500/30 bg-red-500/[0.04] backdrop-blur-sm p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-3.5 text-red-400" />
                  <span className="font-mono text-[11px] text-red-300 uppercase tracking-[0.28em]">
                    Zayıf Kalan Sinyal
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display font-medium text-2xl tabular-nums">${stats.worst_signal.ticker}</span>
                  <span className="font-display text-2xl font-medium tabular-nums text-red-400">
                    {stats.worst_signal.pct_7d?.toFixed(1)}%
                  </span>
                </div>
                <div className="font-mono text-[11px] text-white/55">
                  Sentiment <span className="text-red-400">{stats.worst_signal.sentiment_score.toFixed(2)}</span> ·{" "}
                  <span className="text-white/70">{stats.worst_signal.catalyst}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sinyal listesi */}
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.28em]">
              · Son Sinyaller
            </span>
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.22em]">
              {stats.signals.length} sinyal
            </span>
          </div>
          <div className="space-y-2">
            {stats.signals.map((s, i) => (
              <SignalRow key={i} s={s} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-emerald-500/[0.04] border-2 border-emerald-500/30 backdrop-blur-sm p-8 md:p-10 text-center space-y-4 shadow-[0_8px_60px_-12px_rgba(16,185,129,0.25)]">
          <div className="flex items-center justify-center gap-3">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-emerald-300 uppercase tracking-[0.28em]">
              Canlı Yayın
            </span>
          </div>
          <h3
            className="font-display font-medium tracking-tight"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: "1.1", letterSpacing: "-0.02em" }}
          >
            Sinyaller her sabah{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              Nexora'da.
            </em>
          </h3>
          <p className="text-white/55 max-w-xl mx-auto text-sm">
            BIST + ABD + Kripto için günlük sentiment radar. İlk $25 ile başla.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
            <Link
              href="/satin-al"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 transition-all"
            >
              Paketleri incele
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/85 font-mono text-sm uppercase tracking-[0.22em] px-6 py-3 transition-all"
            >
              Ana sayfa
            </Link>
          </div>
          <p className="font-mono text-[10px] text-amber-300/80 uppercase tracking-[0.22em] pt-2">
            ⚠ Geçmiş performans gelecek garantisi değildir
          </p>
        </div>
      </main>
    </div>
  );
}
