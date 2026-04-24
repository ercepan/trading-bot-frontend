"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE, api, PortfolioSummary } from "@/lib/api";
import { Code2, Server, Webhook } from "lucide-react";

export default function SettingsPage() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const p = await api.portfolio();
        if (alive) setPortfolio(p);
      } catch {
        /* ignore */
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const items = [
    {
      label: "API Base",
      value: API_BASE,
      icon: Server,
    },
    {
      label: "Webhook URL",
      value: `${API_BASE}/webhook/{tier_id}`,
      icon: Webhook,
    },
    {
      label: "Frontend",
      value: "Next.js 15 · shadcn/ui · Tailwind",
      icon: Code2,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">
          Konfigürasyon salt-okunur — değişiklik için Railway env düzenlenir
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sistem</CardTitle>
          <CardDescription>Bot altyapısı</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((i) => {
            const Icon = i.icon;
            return (
              <div
                key={i.label}
                className="flex items-start gap-3 p-3 rounded-md border border-border/50"
              >
                <Icon className="size-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{i.label}</div>
                  <div className="text-sm font-mono break-all">{i.value}</div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tier Konfigürasyonu</CardTitle>
          <CardDescription>
            Her tier'ın risk, kaldıraç ve allocation ayarı
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {portfolio?.tiers.map((t) => (
                <div
                  key={t.tier_id}
                  className="p-4 rounded-md border border-border/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{t.name}</span>
                    <Badge variant="outline">{t.market}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Allocation</div>
                      <div className="font-mono">
                        {(t.allocation * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Risk</div>
                      <div className="font-mono">
                        {(t.risk_pct * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Kaldıraç</div>
                      <div className="font-mono">{t.leverage}x</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {t.symbol ?? "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
