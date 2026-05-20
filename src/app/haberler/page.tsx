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
import { authApi, NewsItem } from "@/lib/auth";
import { Newspaper, RefreshCw, Tag } from "lucide-react";
import { FreshnessBadge } from "@/components/freshness-badge";

const CATEGORY_LABELS: Record<string, string> = {
  borsa: "🏦 Borsa",
  ekonomi: "📊 Ekonomi",
  kripto: "₿ Kripto",
  "kripto-en": "₿ Kripto (EN)",
  forex: "💱 Forex",
  indikator: "📈 İndikatör",
  analiz: "🔍 Analiz",
  popular: "🔥 Popüler",
  insider: "👤 Insider",
  genel: "📡 Genel",
};

export default function HaberlerPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<
    { category: string; n: number; latest_pubdate: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [tickerFilter, setTickerFilter] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await authApi.news({
        category: filter ?? undefined,
        ticker: tickerFilter.trim() || undefined,
        // /haberler sayfasında "analiz" görünmesin — onlar /analizler sayfasında
        exclude: filter ? undefined : ["analiz"],
        limit: 80,
      });
      setItems(r.items);
      setCategories(r.categories);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "yükleme hatası");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60 * 1000); // 5 dk
    return () => clearInterval(t);
  }, [filter, tickerFilter]);

  // Son güncelleme: tüm haberlerin fetched_at MAX'ı (sıralı geldiğinden ilki en yenidir)
  const latestTs = items.reduce<string | undefined>((acc, it) => {
    if (!it.fetched_at) return acc;
    if (!acc) return it.fetched_at;
    return it.fetched_at > acc ? it.fetched_at : acc;
  }, undefined);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Newspaper className="size-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              07 / Haberler · Çoklu Kaynak
            </span>
            <FreshnessBadge timestamp={latestTs} />
          </div>
          <h1
            className="font-display font-medium tracking-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
          >
            Piyasa{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              haberleri.
            </em>
          </h1>
          <p className="font-mono text-[10px] text-white/45 uppercase tracking-[0.18em]">
            BIST · Forex · Kripto · Ekonomi · 8 kategori
          </p>
        </div>
        <button
          onClick={load}
          className="font-mono text-[10px] uppercase tracking-[0.22em] border border-white/15 hover:border-emerald-400/40 hover:bg-emerald-500/[0.04] px-3 py-2 text-white/60 hover:text-emerald-300 inline-flex items-center gap-2 transition-all"
        >
          <RefreshCw className="size-3" /> Yenile
        </button>
      </div>

      {/* Filtreler */}
      <Card>
        <CardContent className="pt-5 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter(null)}
              className={`text-xs rounded-md border px-2.5 py-1 transition-colors ${
                filter === null
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-border bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              Tümü
            </button>
            {categories
              .filter((c) => c.category !== "analiz")
              .map((c) => (
                <button
                  key={c.category}
                  onClick={() => setFilter(c.category)}
                  className={`text-xs rounded-md border px-2.5 py-1 transition-colors ${
                    filter === c.category
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                      : "border-border bg-background text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {CATEGORY_LABELS[c.category] ?? c.category}{" "}
                  <span className="opacity-60">({c.n})</span>
                </button>
              ))}
          </div>
          <div className="flex items-center gap-2">
            <Tag className="size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={tickerFilter}
              onChange={(e) => setTickerFilter(e.target.value.toUpperCase())}
              placeholder="Ticker filtre (THYAO, AAPL, BTC...)"
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {tickerFilter && (
              <button
                onClick={() => setTickerFilter("")}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                temizle
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {err && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-5 text-sm text-red-400">{err}</CardContent>
        </Card>
      )}

      {/* Liste */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Bu filtrede haber yok.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <NewsRow key={n.id} n={n} />
          ))}
        </div>
      )}
    </div>
  );
}

function parseNewsDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  // ISO 8601 (yeni format: 2026-04-28T14:41:48Z)
  let d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  // Eski format fallback: "2026-04-28 14:41:48"
  d = new Date(s.replace(" ", "T") + "Z");
  if (!isNaN(d.getTime())) return d;
  return null;
}

function NewsRow({ n }: { n: NewsItem }) {
  const dt = parseNewsDate(n.pubdate);
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded((e) => !e)}
      className="rounded-lg border border-border bg-card/30 p-4 hover:border-emerald-500/30 hover:bg-card/60 transition-all cursor-pointer"
    >
      <div className="flex gap-3">
        {n.image_url && (
          <div className="hidden sm:block shrink-0 w-24 h-16 rounded overflow-hidden bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={n.image_url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px]">
              {CATEGORY_LABELS[n.category] ?? n.category}
            </Badge>
            {n.ticker_mentions.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="text-[10px] border-emerald-500/40 text-emerald-400"
              >
                ${t}
              </Badge>
            ))}
            {dt && (
              <span className="text-[10px] text-muted-foreground ml-auto">
                {dt.toLocaleString("tr-TR", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          <h3 className="font-medium text-sm leading-snug">
            {n.title}
          </h3>
          {n.summary && (
            <p
              className={`text-xs text-muted-foreground leading-relaxed ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {n.summary}
            </p>
          )}
          {n.summary && n.summary.length > 200 && (
            <button
              type="button"
              className="text-[11px] text-emerald-400 hover:text-emerald-300"
            >
              {expanded ? "▲ kapat" : "▼ devamı"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
