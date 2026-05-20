"use client";

import { useEffect, useState } from "react";
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
import { api, fmtDate, fmtUsd, StockSignal } from "@/lib/api";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Target,
  Shield,
  Search,
  Activity,
} from "lucide-react";

function SignalBadge({ type }: { type: string }) {
  if (type === "STRONG_BUY")
    return (
      <Badge className="bg-emerald-500/25 border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/30">
        <TrendingUp className="size-3 mr-1" /> STRONG BUY
      </Badge>
    );
  if (type === "BUY")
    return (
      <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">
        <TrendingUp className="size-3 mr-1" /> BUY
      </Badge>
    );
  if (type === "STRONG_SELL")
    return (
      <Badge className="bg-red-500/25 border-red-500/60 text-red-300 hover:bg-red-500/30">
        <TrendingDown className="size-3 mr-1" /> STRONG SELL
      </Badge>
    );
  if (type === "SELL")
    return (
      <Badge variant="outline" className="border-red-500/40 text-red-400">
        <TrendingDown className="size-3 mr-1" /> SELL
      </Badge>
    );
  if (type === "BEARISH_WATCH")
    return (
      <Badge variant="outline" className="border-amber-500/40 text-amber-400">
        <TrendingDown className="size-3 mr-1" /> BEARISH WATCH
      </Badge>
    );
  return (
    <Badge variant="outline" className="text-muted-foreground">
      <Minus className="size-3 mr-1" /> HOLD
    </Badge>
  );
}

function SignalCard({ s }: { s: StockSignal }) {
  const isBuy = s.signal_type === "STRONG_BUY" || s.signal_type === "BUY";
  const isSell = s.signal_type === "STRONG_SELL" || s.signal_type === "SELL";
  const isBist = s.market === "tr";
  // Midas BIST sembolleri farklı path
  const midasUrl = isBist
    ? `https://getmidas.com/tr/menkul-kiymetler/${s.ticker.toLowerCase()}`
    : `https://getmidas.com/tr/menkul-kiymetler/arama/${s.ticker}`;
  const wsbSearchUrl = `https://www.reddit.com/r/wallstreetbets/search?q=%24${s.ticker}&restrict_sr=1&sort=top&t=week`;
  const tvUrl = isBist
    ? `https://www.tradingview.com/chart/?symbol=BIST:${s.ticker}`
    : `https://www.tradingview.com/chart/?symbol=${s.ticker}`;
  const yahooUrl = isBist
    ? `https://finance.yahoo.com/quote/${s.ticker}.IS`
    : `https://finance.yahoo.com/quote/${s.ticker}`;

  return (
    <Card
      className={
        isBuy
          ? "border-emerald-500/30"
          : isSell
            ? "border-red-500/30"
            : s.signal_type === "BEARISH_WATCH"
              ? "border-amber-500/30"
              : ""
      }
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xl">
                {isBist ? "" : "$"}
                {s.ticker}
              </span>
              {isBist && (
                <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">
                  BIST
                </Badge>
              )}
              <SignalBadge type={s.signal_type} />
              <Badge variant="outline" className="text-xs">
                conf {(s.confidence * 100).toFixed(0)}%
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              {fmtDate(s.created_at)}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold tabular-nums">
              {s.current_price
                ? `${isBist ? "₺" : "$"}${s.current_price.toFixed(2)}`
                : "—"}
            </div>
            {s.price_5d_change_pct != null && (
              <div
                className={`text-xs tabular-nums ${
                  s.price_5d_change_pct >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                5g {s.price_5d_change_pct >= 0 ? "+" : ""}
                {s.price_5d_change_pct.toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {(isBuy || isSell) && s.entry_zone_low != null && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-md border border-border/50 p-2">
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Target className="size-3" /> Entry Zone
              </div>
              <div className="font-mono font-medium tabular-nums">
                {isBist ? "₺" : "$"}{s.entry_zone_low.toFixed(2)} — {isBist ? "₺" : "$"}{s.entry_zone_high?.toFixed(2)}
              </div>
            </div>
            <div className="rounded-md border border-red-500/30 bg-red-500/5 p-2">
              <div className="text-[10px] text-red-400 flex items-center gap-1">
                <Shield className="size-3" /> Stop
              </div>
              <div className="font-mono font-medium tabular-nums">
                {isBist ? "₺" : "$"}{s.stop_loss?.toFixed(2) ?? "—"}
              </div>
              {s.stop_loss && s.current_price && (
                <div className="text-[10px] text-muted-foreground">
                  {(((s.stop_loss - s.current_price) / s.current_price) * 100).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-2">
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Target className="size-3" /> Target
              </div>
              <div className="font-mono font-medium tabular-nums">
                {isBist ? "₺" : "$"}{s.target?.toFixed(2) ?? "—"}
              </div>
              {s.target && s.current_price && (
                <div className="text-[10px] text-muted-foreground">
                  {s.target > s.current_price ? "+" : ""}{(((s.target - s.current_price) / s.current_price) * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        )}

        {s.risk_reward != null && (isBuy || isSell) && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Risk/Reward:</span>
            <span className="font-mono font-medium">{s.risk_reward.toFixed(2)}x</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          {s.rsi_14 != null && <span>RSI {s.rsi_14.toFixed(0)}</span>}
          {s.atr_14 != null && <span>ATR {isBist ? "₺" : "$"}{s.atr_14.toFixed(2)}</span>}
          {s.analyst_score != null && (
            <span>
              AN{" "}
              <span
                className={s.analyst_score > 0.2 ? "text-emerald-400" : s.analyst_score < -0.2 ? "text-red-400" : ""}
              >
                {s.analyst_score >= 0 ? "+" : ""}
                {s.analyst_score.toFixed(2)}
              </span>
            </span>
          )}
          {s.news_score != null && (
            <span>
              NW{" "}
              <span
                className={s.news_score > 0.2 ? "text-emerald-400" : s.news_score < -0.2 ? "text-red-400" : ""}
              >
                {s.news_score >= 0 ? "+" : ""}
                {s.news_score.toFixed(2)}
              </span>
            </span>
          )}
        </div>

        {s.reasoning && (
          <div className="text-sm text-muted-foreground border-l-2 border-border pl-3 italic">
            {s.reasoning}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          <a
            href={wsbSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs rounded-md border border-border px-2.5 py-1 hover:bg-accent transition-colors"
          >
            <Search className="size-3" /> Tartışma <ExternalLink className="size-3" />
          </a>
          <a
            href={tvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs rounded-md border border-border px-2.5 py-1 hover:bg-accent transition-colors"
          >
            <Activity className="size-3" /> Grafik <ExternalLink className="size-3" />
          </a>
          <a
            href={yahooUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs rounded-md border border-border px-2.5 py-1 hover:bg-accent transition-colors"
          >
            Hisse Detay <ExternalLink className="size-3" />
          </a>
          <Link
            href={`/wsb/${s.ticker}`}
            className="inline-flex items-center gap-1 text-xs rounded-md border border-border px-2.5 py-1 hover:bg-accent transition-colors"
          >
            Sentiment detay
          </Link>
          {(isBuy || isSell) && (
            <a
              href={midasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 text-xs rounded-md px-2.5 py-1 transition-colors ml-auto ${
                isBuy
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                  : "bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30"
              }`}
            >
              Midas'ta aç <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<StockSignal[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"us" | "tr">("us");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const s = await api.signals();
        if (alive) {
          setSignals(s);
          setErr(null);
        }
      } catch (e: unknown) {
        if (alive) {
          setErr(e instanceof Error ? e.message : "hata");
          setSignals([]);
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

  // Tüm sinyaller (özet kartlar için)
  const allUs = signals?.filter((s) => s.market !== "tr") ?? [];
  const allTr = signals?.filter((s) => s.market === "tr") ?? [];

  // Aktif tab'a göre filtrelenmiş
  const tabSignals = activeTab === "us" ? allUs : allTr;
  const buys = tabSignals.filter((s) => s.signal_type === "STRONG_BUY" || s.signal_type === "BUY");
  const sells = tabSignals.filter((s) => s.signal_type === "STRONG_SELL" || s.signal_type === "SELL");
  const watches = tabSignals.filter((s) => s.signal_type === "BEARISH_WATCH");
  const holds = tabSignals.filter((s) => s.signal_type === "HOLD");

  return (
    <div className="space-y-6">
      <LegalDisclaimer compact />
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Zap className="size-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
            03 / Birleşik Sinyaller · Semi-Auto
          </span>
        </div>
        <h1
          className="font-display font-medium tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
        >
          Hisse{" "}
          <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
            sinyalleri.
          </em>
        </h1>
        <p className="font-mono text-[10px] text-white/45 uppercase tracking-[0.18em]">
          Topluluk + analist + teknik · 2 saatte bir güncellenir
        </p>
      </div>

      {err && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-sm text-red-400">API hata: {err}</CardContent>
        </Card>
      )}

      {/* Market tabs */}
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("us")}
          className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "us"
              ? "text-emerald-400 border-emerald-400"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          🇺🇸 NASDAQ / NYSE
          <span className="ml-2 text-xs opacity-60">{allUs.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("tr")}
          className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "tr"
              ? "text-amber-400 border-amber-400"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          🇹🇷 BIST
          <span className="ml-2 text-xs opacity-60">{allTr.length}</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>BUY</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-emerald-400">
              {buys.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {buys.filter((b) => b.signal_type === "STRONG_BUY").length} strong
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>SELL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-red-400">
              {sells.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {sells.filter((b) => b.signal_type === "STRONG_SELL").length} strong
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Bearish Watch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-amber-400">
              {watches.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">izleme listesi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{activeTab === "us" ? "🇺🇸 Toplam" : "🇹🇷 Toplam"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {tabSignals.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {holds.length} hold
            </p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      ) : tabSignals.length > 0 ? (
        <>
          {buys.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-emerald-400">🟢 Alım Sinyalleri</h2>
              {buys.map((s) => (
                <SignalCard key={s.id} s={s} />
              ))}
            </div>
          )}
          {sells.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-red-400">🔴 Satış Sinyalleri</h2>
              {sells.map((s) => (
                <SignalCard key={s.id} s={s} />
              ))}
            </div>
          )}
          {watches.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-amber-400">🟡 Bearish Watch</h2>
              {watches.map((s) => (
                <SignalCard key={s.id} s={s} />
              ))}
            </div>
          )}
          {holds.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-muted-foreground">⚪ Hold</h2>
              {holds.map((s) => (
                <SignalCard key={s.id} s={s} />
              ))}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {activeTab === "us"
              ? "🇺🇸 NASDAQ/NYSE sinyali yok. Sistem 2 saatte bir üretir."
              : "🇹🇷 BIST sinyali yok. Sistem 2 saatte bir üretir."}
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed">
        <CardContent className="pt-6 text-xs text-muted-foreground space-y-1.5">
          <div>
            <strong className="text-foreground">Nasıl kullanılır:</strong>
          </div>
          <div>
            <strong>1.</strong> BUY sinyali gördüğünde → <strong>Tartışma</strong> butonuna bas, topluluğun ne dediğine bak
          </div>
          <div>
            <strong>2.</strong> <strong>Grafik</strong> butonuyla teknik analiz yap (support/resistance, trend)
          </div>
          <div>
            <strong>3.</strong> Entry zone + Stop + Target seni yönlendirir
          </div>
          <div>
            <strong>4.</strong> <strong>Midas'ta aç</strong> → manuel emir gir (stop-loss koymayı unutma!)
          </div>
          <div className="pt-2">
            <strong className="text-foreground">Confidence:</strong> 4 kaynağın ortak skoru. %70+ → güçlü sinyal.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
