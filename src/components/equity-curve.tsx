"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, fmtUsd } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";

export function EquityCurve() {
  const [data, setData] = useState<{ ts: number; label: string; virtual: number; real: number | null }[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await api.equity_curve(90);
        if (!alive) return;
        const mapped = rows.map((r) => ({
          ts: new Date(r.snapshot_at).getTime(),
          label: new Date(r.snapshot_at).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
          }),
          virtual: r.total_equity,
          real: r.real_total,
        }));
        setData(mapped);
      } catch {
        if (alive) setData([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    const t = setInterval(async () => {
      try {
        const rows = await api.equity_curve(90);
        if (alive) {
          const mapped = rows.map((r) => ({
            ts: new Date(r.snapshot_at).getTime(),
            label: new Date(r.snapshot_at).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
            }),
            virtual: r.total_equity,
            real: r.real_total,
          }));
          setData(mapped);
        }
      } catch {}
    }, 5 * 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const hasData = data && data.length >= 2;
  const initial = data && data.length > 0 ? data[0].virtual : 500;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-5" /> Equity Curve
        </CardTitle>
        <CardDescription>
          Son 90 gün portföy büyümesi · 6 saatte bir snapshot
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[240px] w-full" />
        ) : hasData ? (
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data!}>
                <defs>
                  <linearGradient id="eqVirtual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(52 211 153)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="rgb(52 211 153)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="eqReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(96 165 250)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="rgb(96 165 250)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v.toFixed(0)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                  formatter={(value) =>
                    typeof value === "number" ? fmtUsd(value) : "—"
                  }
                />
                <ReferenceLine
                  y={initial}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  label={{
                    value: "start",
                    position: "insideTopRight",
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 10,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="virtual"
                  stroke="rgb(52 211 153)"
                  fill="url(#eqVirtual)"
                  strokeWidth={2}
                  name="Sanal equity"
                />
                <Area
                  type="monotone"
                  dataKey="real"
                  stroke="rgb(96 165 250)"
                  fill="url(#eqReal)"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  name="Gerçek MEXC"
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Henüz yeterli snapshot yok. Bot 6 saatte bir kaydediyor.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
