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
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Radar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

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

function RankChange({
  rank,
  rank24h,
}: {
  rank: number | null;
  rank24h: number | null;
}) {
  if (rank == null || rank24h == null)
    return <span className="text-muted-foreground text-xs">—</span>;
  const diff = rank24h - rank; // positive = rank improved (rose up)
  if (diff === 0)
    return <span className="text-muted-foreground text-xs tabular-nums">0</span>;
  if (diff > 0)
    return (
      <span className="text-emerald-400 text-xs tabular-nums flex items-center gap-0.5">
        <ArrowUp className="size-3" />
        {diff}
      </span>
    );
  return (
    <span className="text-red-400 text-xs tabular-nums flex items-center gap-0.5">
      <ArrowDown className="size-3" />
      {Math.abs(diff)}
    </span>
  );
}

function MentionChange({ now, prev }: { now: number; prev: number }) {
  const diff = now - prev;
  const pct = prev > 0 ? (diff / prev) * 100 : 0;
  if (diff === 0)
    return <span className="text-muted-foreground text-xs tabular-nums">0%</span>;
  const positive = diff > 0;
  return (
    <span
      className={`text-xs tabular-nums ${
        positive ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {positive ? "+" : ""}
      {pct.toFixed(0)}%
    </span>
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
        const r = await api.wsb_radar(30);
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
            r/wallstreetbets'te en çok konuşulan ABD hisseleri · 24 saat rank ve
            mention momentum
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
            APE Wisdom aggregate · Claude Haiku sentiment · rank diff 24h
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : rows && rows.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead className="text-right">Mentions</TableHead>
                  <TableHead className="text-right">24h Δ</TableHead>
                  <TableHead>Rank Δ</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead className="text-right">Upvotes</TableHead>
                  <TableHead>Reddit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.ticker}>
                    <TableCell className="text-muted-foreground tabular-nums text-sm">
                      {r.rank ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold font-mono">${r.ticker}</span>
                        {r.name && (
                          <span className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                            {r.name.replace(/&amp;/g, "&")}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      {r.mentions}
                    </TableCell>
                    <TableCell className="text-right">
                      <MentionChange now={r.mentions} prev={r.mentions_24h_ago} />
                    </TableCell>
                    <TableCell>
                      <RankChange rank={r.rank} rank24h={r.rank_24h_ago} />
                    </TableCell>
                    <TableCell>
                      <SentimentBadge score={r.sentiment_score} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {r.upvotes.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {r.sample_url ? (
                        <a
                          href={r.sample_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          search <ExternalLink className="size-3" />
                        </a>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Henüz scrape yapılmamış. Bot her 6 saatte bir otomatik tarar.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="pt-6 text-xs text-muted-foreground space-y-1">
          <div>
            <strong className="text-foreground">Veri kaynağı:</strong>{" "}
            <a
              href="https://apewisdom.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              apewisdom.io
            </a>{" "}
            — r/wallstreetbets'i 7/24 scrape edip agregeli mention sayıları sunar.
          </div>
          <div>
            <strong className="text-foreground">Rank Δ:</strong> son 24 saatte kaç
            basamak yükseldi/indi. ↑5 = rank 7'den 2'ye çıkmış (yükselen momentum).
          </div>
          <div>
            <strong className="text-foreground">Sentiment:</strong> Claude Haiku, top
            ticker'ların mention trendine bakıp bullish/bearish/neutral tahmini yapar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
