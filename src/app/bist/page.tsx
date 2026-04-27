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
import { api, fmtDate, BistSnapshotMeta, BistTicker } from "@/lib/api";
import { AdminOnly } from "@/components/admin-only";
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Clock,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

function ScoreDot({ score, label }: { score: number | null; label: string }) {
  if (score == null || score === 0) {
    return (
      <span className="text-[10px] text-muted-foreground/50 tabular-nums" title={`${label}: veri yok`}>
        —
      </span>
    );
  }
  const color = score > 0.2 ? "text-emerald-400" : score < -0.2 ? "text-red-400" : "text-muted-foreground";
  return (
    <span className={`text-[10px] tabular-nums ${color}`} title={`${label}: ${score.toFixed(2)}`}>
      {score >= 0 ? "+" : ""}
      {score.toFixed(2)}
    </span>
  );
}

function SourceBreakdown({ r }: { r: BistTicker }) {
  return (
    <div className="flex flex-col gap-0.5 font-mono">
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-muted-foreground w-8">NW</span>
        <ScoreDot score={r.news_score} label="News" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-muted-foreground w-8">KAP</span>
        <ScoreDot score={r.kap_score} label="KAP" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-muted-foreground w-8">PR</span>
        <ScoreDot score={r.price_score} label="Price" />
      </div>
    </div>
  );
}

export default function BistPage() {
  const [rows, setRows] = useState<BistTicker[] | null>(null);
  const [snapshots, setSnapshots] = useState<BistSnapshotMeta[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "bullish" | "bearish" | "kap">("all");

  useEffect(() => {
    let alive = true;
    api.bist_snapshots(30).then((s) => alive && setSnapshots(s)).catch(() => {});
    const t = setInterval(() => {
      api.bist_snapshots(30).then((s) => alive && setSnapshots(s)).catch(() => {});
    }, 120_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = selectedSnapshot
          ? await api.bist_snapshot_at(selectedSnapshot, 100)
          : await api.bist_radar(100);
        if (alive) {
          setRows(r);
          setErr(null);
        }
      } catch (e: unknown) {
        if (alive) {
          setErr(e instanceof Error ? e.message : "hata");
          setRows([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    if (!selectedSnapshot) {
      const t = setInterval(load, 60_000);
      return () => {
        alive = false;
        clearInterval(t);
      };
    }
    return () => {
      alive = false;
    };
  }, [selectedSnapshot]);

  const scrapedAt = rows && rows.length > 0 ? rows[0].scraped_at : null;
  const filteredRows = rows
    ? rows.filter((r) => {
        if (filter === "bullish") return (r.final_score ?? 0) > 0.2;
        if (filter === "bearish") return (r.final_score ?? 0) < -0.2;
        if (filter === "kap") return r.kap_count > 0;
        return true;
      })
    : null;

  const bullish = rows?.filter((r) => (r.final_score ?? 0) > 0.2).length ?? 0;
  const bearish = rows?.filter((r) => (r.final_score ?? 0) < -0.2).length ?? 0;
  const kapCount = rows?.filter((r) => r.kap_count > 0).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Globe className="size-5" /> BIST100 Radar
          </h1>
          <p className="text-sm text-muted-foreground">
            Türk borsası · resmi açıklama + Türkçe haber + AI sentiment
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {snapshots.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 text-xs rounded-md border border-border bg-background px-3 py-1.5 hover:bg-accent transition-colors">
                <Clock className="size-3.5" />
                {selectedSnapshot ? fmtDate(selectedSnapshot) : "Son tarama"}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-[400px] overflow-y-auto">
                <DropdownMenuItem onClick={() => setSelectedSnapshot(null)}>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Son tarama (canlı)</span>
                    <span className="text-[11px] text-muted-foreground">otomatik yenilenir</span>
                  </div>
                </DropdownMenuItem>
                {snapshots.map((s) => (
                  <DropdownMenuItem key={s.scraped_at} onClick={() => setSelectedSnapshot(s.scraped_at)}>
                    <div className="flex flex-col">
                      <span className="text-sm font-mono">{fmtDate(s.scraped_at)}</span>
                      <span className="text-[11px] text-muted-foreground">{s.ticker_count} ticker</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {scrapedAt && (
            <div className="text-right text-xs text-muted-foreground">
              <div>Görüntülenen:</div>
              <div className="font-mono">{fmtDate(scrapedAt)}</div>
            </div>
          )}
        </div>
      </div>

      {err && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-sm text-red-400">API hata: {err}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{rows?.length ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>🟢 Bullish</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-emerald-400">{bullish}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>🔴 Bearish</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-red-400">{bearish}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <FileText className="size-3" /> KAP Açıklaması
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-amber-400">{kapCount}</div>
            <p className="text-xs text-muted-foreground mt-1">son 2 gün</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        {(["all", "bullish", "bearish", "kap"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs rounded-md border px-3 py-1.5 transition-colors ${
              filter === f
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            }`}
          >
            {f === "all" ? "Tümü" : f === "bullish" ? "🟢 Bullish" : f === "bearish" ? "🔴 Bearish" : "📋 KAP olan"}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            BIST100 Hisseler{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({filteredRows?.length ?? 0})
            </span>
          </CardTitle>
          <CardDescription>
            Final = 0.45×News + 0.25×KAP + 0.30×Price · Midas için manual al/sat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filteredRows && filteredRows.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Ticker</TableHead>
                    <TableHead className="text-right">Fiyat</TableHead>
                    <TableHead className="text-right">Hacim</TableHead>
                    <TableHead>Kaynaklar</TableHead>
                    <TableHead>KAP</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Neden</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((r, i) => {
                    const midasUrl = `https://getmidas.com/tr/menkul-kiymetler/arama/${r.ticker}`;
                    const tvUrl = `https://www.tradingview.com/chart/?symbol=BIST:${r.ticker}`;
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="text-muted-foreground tabular-nums text-xs">{i + 1}</TableCell>
                        <TableCell>
                          <Link href={`/bist/${r.ticker}`} className="flex flex-col group hover:text-foreground">
                            <span className="font-semibold font-mono group-hover:underline">{r.ticker}</span>
                            {r.company_name && (
                              <span className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                                {r.company_name}
                              </span>
                            )}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {r.price_current != null ? (
                            <div className="flex flex-col items-end">
                              <span>₺{r.price_current.toFixed(2)}</span>
                              <span
                                className={`text-[10px] ${
                                  (r.price_change_pct ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                                }`}
                              >
                                {(r.price_change_pct ?? 0) >= 0 ? "+" : ""}
                                {(r.price_change_pct ?? 0).toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-xs text-muted-foreground">
                          {r.volume != null ? (r.volume / 1_000_000).toFixed(1) + "M" : "—"}
                        </TableCell>
                        <TableCell>
                          <SourceBreakdown r={r} />
                        </TableCell>
                        <TableCell>
                          {r.kap_count > 0 ? (
                            <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-[10px]">
                              {r.kap_count} açıklama
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <SentimentBadge score={r.final_score} label={r.sentiment_label} />
                        </TableCell>
                        <TableCell className="max-w-[260px]">
                          <span className="text-[11px] text-muted-foreground line-clamp-2" title={r.kap_summary || r.news_reason || ""}>
                            {r.kap_summary || r.news_reason || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <a
                              href={midasUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] rounded border border-border px-1.5 py-0.5 hover:bg-accent"
                              title="Midas'ta aç"
                            >
                              Midas
                            </a>
                            <a
                              href={tvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] rounded border border-border px-1.5 py-0.5 hover:bg-accent"
                              title="TradingView"
                            >
                              TV <ExternalLink className="size-2.5 inline" />
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Henüz BIST taraması yok. Bot 6 saatte bir tarar.
            </div>
          )}
        </CardContent>
      </Card>

      <AdminOnly>
        <Card className="border-dashed">
          <CardContent className="pt-6 text-xs text-muted-foreground space-y-1.5">
            <div>
              <strong className="text-foreground">Veri kaynakları (admin):</strong>
            </div>
            <div>📊 <strong>yfinance</strong>: BIST hisse fiyat + hacim (gerçek-zamanlı, ücretsiz)</div>
            <div>📋 <strong>KAP</strong>: Kamuyu Aydınlatma Platformu — şirketlerin resmi açıklamaları (en güçlü sinyal)</div>
            <div>📰 <strong>Bigpara</strong>: Türkçe finans haberleri (her hisse için son 5 başlık)</div>
            <div>🤖 <strong>Claude Haiku</strong>: Türkçe haberleri ve KAP açıklamalarını okuyup bullish/bearish etiketler</div>
            <div className="pt-2">
              <strong className="text-foreground">Final formül:</strong> 0.45×News + 0.25×KAP + 0.30×Price
            </div>
          </CardContent>
        </Card>
      </AdminOnly>
    </div>
  );
}
