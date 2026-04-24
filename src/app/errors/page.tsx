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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { api, ErrorLog, fmtDate } from "@/lib/api";

export default function ErrorsPage() {
  const [errors, setErrors] = useState<ErrorLog[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const e = await api.errors();
        if (alive) setErrors(e);
      } catch {
        if (alive) setErrors([]);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 20_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hata Log</h1>
        <p className="text-sm text-muted-foreground">
          Son 50 hata · MEXC / webhook / strateji
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Sistem Hataları{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({errors?.length ?? 0})
            </span>
          </CardTitle>
          <CardDescription>Telegram bildirimi ile eşleşir</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : errors && errors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zaman</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Mesaj</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errors.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {fmtDate(e.timestamp)}
                    </TableCell>
                    <TableCell>{e.tier_id ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-red-500/30 text-red-400">
                        {e.error_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-[500px] truncate" title={e.error_msg}>
                      {e.error_msg}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-sm text-emerald-400">
              ✓ Son dönemde hata yok — sistem temiz çalışıyor.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
