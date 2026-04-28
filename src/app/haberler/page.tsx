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
import { Newspaper, ExternalLink, RefreshCw, Tag } from "lucide-react";
import { FreshnessBadge } from "@/components/freshness-badge";

const CATEGORY_LABELS: Record<string, string> = {
  borsa: "🏦 Borsa",
  ekonomi: "📊 Ekonomi",
  kripto: "₿ Kripto",
  forex: "💱 Forex",
  indikator: "📈 İndikatör",
  analiz: "🔍 Analiz",
  popular: "🔥 Popüler",
  insider: "👤 Insider",
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

  const latestTs = items[0]?.fetched_at;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2 flex-wrap">
            <Newspaper className="size-5" /> Haberler
            <FreshnessBadge timestamp={latestTs} />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            BIST + Forex + Kripto + Ekonomi · 8 kategoriden derlenmiş haberler ·
            BIST hisseleri otomatik etiketlenir.
          </p>
        </div>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent inline-flex items-center gap-1"
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
            {categories.map((c) => (
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

function NewsRow({ n }: { n: NewsItem }) {
  const dt = n.pubdate ? new Date(n.pubdate.replace(" ", "T") + "Z") : null;
  return (
    <a
      href={n.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-border bg-card/30 p-4 hover:border-emerald-500/30 hover:bg-card/60 transition-all group"
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
          <h3 className="font-medium text-sm leading-snug group-hover:text-emerald-300 transition-colors flex items-start gap-1">
            {n.title}
            <ExternalLink className="size-3 shrink-0 mt-0.5 opacity-50 group-hover:opacity-100" />
          </h3>
          {n.summary && (
            <p className="text-xs text-muted-foreground line-clamp-2">{n.summary}</p>
          )}
        </div>
      </div>
    </a>
  );
}
