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
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-emerald-400" /> Equity Curve
            </CardTitle>
            <CardDescription>
              Son 90 gün portföy büyümesi · 6 saatte bir snapshot
            </CardDescription>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-muted-foreground">Sanal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-400" style={{ borderTop: "2px dashed #60a5fa" }} />
              <span className="text-muted-foreground">Gerçek MEXC</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : hasData ? (
          <div className="h-[280px] w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data!} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="eqVirtual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="eqReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#3a3a3a"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#a1a1aa", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: "#3a3a3a" }}
                  minTickGap={32}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 11, fill: "#a1a1aa", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v.toFixed(0)}`}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f0f10",
                    border: "1px solid #10b981",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
                  }}
                  labelStyle={{ color: "#10b981", fontWeight: 600 }}
                  formatter={(value, name) => [
                    typeof value === "number" ? fmtUsd(value) : "—",
                    name === "virtual" ? "Sanal" : "Gerçek MEXC",
                  ]}
                />
                <ReferenceLine
                  y={initial}
                  stroke="#71717a"
                  strokeDasharray="4 4"
                  label={{
                    value: `Başlangıç $${initial.toFixed(0)}`,
                    position: "insideTopRight",
                    fill: "#71717a",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="virtual"
                  stroke="#10b981"
                  fill="url(#eqVirtual)"
                  strokeWidth={2.5}
                  name="virtual"
                  dot={false}
                  activeDot={{ r: 5, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="real"
                  stroke="#60a5fa"
                  fill="url(#eqReal)"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  name="real"
                  connectNulls
                  dot={false}
                  activeDot={{ r: 4, fill: "#60a5fa", stroke: "#fff", strokeWidth: 2 }}
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
