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
import { api, fmtDate, fmtUsd, Position } from "@/lib/api";

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const p = await api.positions();
        if (alive) setPositions(p);
      } catch {
        if (alive) setPositions([]);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 10_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Açık Pozisyonlar</h1>
        <p className="text-sm text-muted-foreground">
          Canlı — 10 sn'de bir yenilenir
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Aktif Trade{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({positions?.length ?? 0})
            </span>
          </CardTitle>
          <CardDescription>
            Her tier tek pozisyon tutar · entry anında sanal equity'den risk alır
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : positions && positions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Sembol</TableHead>
                  <TableHead>Yön</TableHead>
                  <TableHead className="text-right">Miktar</TableHead>
                  <TableHead className="text-right">Giriş</TableHead>
                  <TableHead className="text-right">Stop</TableHead>
                  <TableHead>Açılış</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.tier_id}</TableCell>
                    <TableCell className="font-mono text-xs">{p.symbol}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          p.side === "long"
                            ? "border-emerald-500/30 text-emerald-400"
                            : "border-red-500/30 text-red-400"
                        }
                      >
                        {p.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {p.qty.toFixed(6)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {fmtUsd(p.entry_price, 4)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {p.stop_price ? fmtUsd(p.stop_price, 4) : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {fmtDate(p.entry_time)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Şu anda açık pozisyon yok.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
