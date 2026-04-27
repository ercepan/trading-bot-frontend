"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * "Son güncelleme: 5 dk önce" rozet — kullanıcıya veri tazeliğini göster.
 *
 * Renk:
 *   < 1h   → emerald (canlı)
 *   1h-4h  → amber (yenileniyor)
 *   > 4h   → red (eski)
 */
export function FreshnessBadge({
  timestamp,
  prefix = "Son güncelleme",
  fallback = "—",
}: {
  timestamp: string | null | undefined;
  prefix?: string;
  fallback?: string;
}) {
  const [, setTick] = useState(0);

  // Her 30 saniyede bir yeniden render — "X dk önce" güncellensin
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!timestamp) {
    return (
      <Badge variant="outline" className="gap-1 text-muted-foreground">
        <WifiOff className="size-3" /> {fallback}
      </Badge>
    );
  }

  // SQLite "YYYY-MM-DD HH:MM:SS" → Date
  const ts = new Date(timestamp.replace(" ", "T") + (timestamp.endsWith("Z") ? "" : "Z"));
  const ageSec = Math.max(0, (Date.now() - ts.getTime()) / 1000);
  const ageMin = ageSec / 60;
  const ageHr = ageMin / 60;

  let label: string;
  if (ageMin < 1) label = "şimdi";
  else if (ageMin < 60) label = `${Math.round(ageMin)} dk önce`;
  else if (ageHr < 24) label = `${Math.round(ageHr)}s önce`;
  else label = `${Math.round(ageHr / 24)}g önce`;

  let className = "gap-1 ";
  let Icon = Wifi;
  if (ageHr < 1) {
    className += "border-emerald-500/40 text-emerald-400";
  } else if (ageHr < 4) {
    className += "border-amber-500/40 text-amber-400";
    Icon = Clock;
  } else {
    className += "border-red-500/40 text-red-400";
    Icon = WifiOff;
  }

  return (
    <Badge variant="outline" className={className} title={ts.toISOString()}>
      <Icon className="size-3" />
      <span className="text-[10px] uppercase tracking-wider opacity-70">{prefix}:</span>
      <span className="font-medium">{label}</span>
    </Badge>
  );
}
