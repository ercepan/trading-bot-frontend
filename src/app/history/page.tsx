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
import { api, fmtDate, fmtPct, fmtUsd, Trade } from "@/lib/api";

export default function HistoryPage() {
  const [trades, setTrades] = useState<Trade[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const t = await api.history();
        if (alive) setTrades(t);
      } catch {
        if (alive) setTrades([]);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Trade Geçmişi</h1>
        <p className="text-sm text-muted-foreground">
          Tüm kapalı pozisyonlar · en yeni üstte
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Kapalı Trade{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({trades?.length ?? 0})
            </span>
          </CardTitle>
          <CardDescription>
            P&amp;L sanal equity'ye yansır · fees dahil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : trades && trades.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Sembol</TableHead>
                  <TableHead>Yön</TableHead>
                  <TableHead className="text-right">Giriş</TableHead>
                  <TableHead className="text-right">Çıkış</TableHead>
                  <TableHead className="text-right">P&amp;L USDT</TableHead>
                  <TableHead className="text-right">P&amp;L %</TableHead>
                  <TableHead>Kapanış</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.tier_id}</TableCell>
                    <TableCell className="font-mono text-xs">{t.symbol}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          t.side === "long"
                            ? "border-emerald-500/30 text-emerald-400"
                            : "border-red-500/30 text-red-400"
                        }
                      >
                        {t.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {fmtUsd(t.entry_price, 4)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {fmtUsd(t.close_price, 4)}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums font-medium ${
                        t.pnl_usdt >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {fmtUsd(t.pnl_usdt)}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums ${
                        t.pnl_pct >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {fmtPct(t.pnl_pct)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {fmtDate(t.close_time)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Henüz kapalı trade yok.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
