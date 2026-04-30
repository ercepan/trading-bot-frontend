"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { authApi, NewsItem } from "@/lib/auth";
import { Search, RefreshCw, Tag } from "lucide-react";
import { FreshnessBadge } from "@/components/freshness-badge";

export default function AnalizlerPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tickerFilter, setTickerFilter] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await authApi.news({
        category: "analiz",
        ticker: tickerFilter.trim() || undefined,
        limit: 80,
      });
      setItems(r.items);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "yükleme hatası");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [tickerFilter]);

  const latestTs = items.reduce<string | undefined>((acc, it) => {
    if (!it.fetched_at) return acc;
    if (!acc) return it.fetched_at;
    return it.fetched_at > acc ? it.fetched_at : acc;
  }, undefined);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2 flex-wrap">
            <Search className="size-5" /> Analizler
            <FreshnessBadge timestamp={latestTs} />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Investing.com TR analiz yazıları · Uzman yorumları, teknik
            değerlendirmeler · Hisse bazlı filtreleme.
          </p>
        </div>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent inline-flex items-center gap-1"
        >
          <RefreshCw className="size-3" /> Yenile
        </button>
      </div>

      {/* Ticker filter */}
      <Card>
        <CardContent className="pt-5">
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
            Bu filtrede analiz yok.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <AnalysisRow key={n.id} n={n} />
          ))}
        </div>
      )}
    </div>
  );
}

function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  let d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  d = new Date(s.replace(" ", "T") + "Z");
  if (!isNaN(d.getTime())) return d;
  return null;
}

function AnalysisRow({ n }: { n: NewsItem }) {
  const dt = parseDate(n.pubdate);
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
            <Badge
              variant="outline"
              className="text-[10px] border-violet-500/40 text-violet-400"
            >
              🔍 Analiz
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
          <h3 className="font-medium text-sm leading-snug">{n.title}</h3>
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
