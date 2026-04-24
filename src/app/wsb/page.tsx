"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, fmtDate, WsbTicker } from "@/lib/api";
import { TrendingUp, TrendingDown, Minus, ExternalLink, Radar } from "lucide-react";

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

function SentimentBar({ bullish, bearish, neutral }: { bullish: number; bearish: number; neutral: number }) {
  const total = bullish + bearish + neutral || 1;
  const bPct = (bullish / total) * 100;
  const rPct = (bearish / total) * 100;
  const nPct = (neutral / total) * 100;
  return (
    <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-muted/30">
      <div className="bg-emerald-400/80" style={{ width: `${bPct}%` }} />
      <div className="bg-muted-foreground/40" style={{ width: `${nPct}%` }} />
      <div className="bg-red-400/80" style={{ width: `${rPct}%` }} />
    </div>
  );
}

export default function WsbPage() {
  const [rows, setRows] = useState<WsbTicker[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await api.wsb_radar(25);
        if (alive) {
          setRows(r);
          setErr(null);
        }
      } catch (e: unknown) {
        if (alive) {
          const msg = e instanceof Error ? e.message : "hata";
          setErr(msg);
          setRows([]);
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

  const scrapedAt = rows && rows.length > 0 ? rows[0].scraped_at : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Radar className="size-5" /> WSB Radar
          </h1>
          <p className="text-sm text-muted-foreground">
            r/wallstreetbets'te en çok konuşulan ABD hisseleri · Claude Haiku sentiment
          </p>
        </div>
        {scrapedAt && (
          <div className="text-right text-xs text-muted-foreground">
            <div>Son tarama:</div>
            <div className="font-mono">{fmtDate(scrapedAt)}</div>
          </div>
        )}
      </div>

      {err && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-sm text-red-400">API hata: {err}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Top Mentions{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({rows?.length ?? 0})
            </span>
          </CardTitle>
          <CardDescription>
            Top/hot/rising postlardan son 24 saat · %20+ bullish/bearish fark = etiketli
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : rows && rows.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead className="text-right">Mentions</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Dağılım</TableHead>
                  <TableHead>Örnek başlık</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.ticker}>
                    <TableCell className="font-semibold font-mono">
                      ${r.ticker}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <span className="font-semibold">{r.mentions}</span>
                    </TableCell>
                    <TableCell>
                      <SentimentBadge score={r.sentiment_score} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <SentimentBar
                          bullish={r.bullish}
                          bearish={r.bearish}
                          neutral={r.neutral}
                        />
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {r.bullish}B · {r.neutral}N · {r.bearish}R
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      {r.sample_url ? (
                        <a
                          href={r.sample_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs hover:text-foreground text-muted-foreground flex items-center gap-1 group"
                        >
                          <span className="truncate max-w-[340px]">
                            {r.sample_title}
                          </span>
                          <ExternalLink className="size-3 flex-shrink-0 opacity-0 group-hover:opacity-100" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground truncate">
                          {r.sample_title}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Henüz scrape yapılmamış. Bot günde 1 kez otomatik tarar, ya da admin
              manuel tetikleyebilir.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="pt-6 text-xs text-muted-foreground space-y-1">
          <div>
            <strong className="text-foreground">Nasıl çalışır:</strong> Bot her gün
            r/wallstreetbets'ten top/hot/rising postları çeker (son 24 saat, ~150 post).
          </div>
          <div>
            Başlık + gövdede `$TSLA` formatı veya 3+ harfli bilinen ticker'ları (~300
            whitelist) sayar. Ardından Claude Haiku her ticker için örnek başlıkları
            bullish/bearish/neutral etiketler.
          </div>
          <div>
            Sentiment skoru: <code className="font-mono">(bullish - bearish) / toplam</code>
            · -1 (tam bearish) ile +1 (tam bullish) arası.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
