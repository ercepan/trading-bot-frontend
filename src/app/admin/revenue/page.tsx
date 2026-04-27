"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/auth";
import { useAuth } from "@/components/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Ticket,
  DollarSign,
  AlertCircle,
  Database,
  Loader2,
  CheckCircle2,
} from "lucide-react";

type Revenue = Awaited<ReturnType<typeof authApi.revenue>>;

export default function AdminRevenuePage() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<Revenue | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [backupResult, setBackupResult] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    try {
      const r = await authApi.revenue();
      setData(r);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Yüklenemedi");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") load();
  }, [user]);

  const runBackup = async () => {
    setBusy(true);
    setBackupResult(null);
    try {
      const r = await authApi.triggerBackup();
      if (r.ok) {
        setBackupResult(
          `✓ Backup OK — ${((r.size_bytes ?? 0) / 1024).toFixed(1)} KB${
            r.sent_to_telegram ? " · Telegram'a gönderildi" : " · Telegram gönderim yok (env eksik)"
          }`,
        );
      } else {
        setBackupResult(`✗ Hata: ${r.error}`);
      }
    } catch (e) {
      setBackupResult(`✗ ${e instanceof Error ? e.message : "Hata"}`);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Yükleniyor…</div>;
  if (user?.role !== "admin") {
    return (
      <Card className="max-w-md">
        <CardContent className="pt-6 text-sm">
          Bu sayfa sadece admin için.
        </CardContent>
      </Card>
    );
  }

  if (err)
    return (
      <Card className="border-red-500/30 bg-red-500/5">
        <CardContent className="pt-6 text-sm text-red-400">{err}</CardContent>
      </Card>
    );
  if (!data) return <div className="text-sm text-muted-foreground">Yükleniyor…</div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <DollarSign className="size-6" /> Revenue & Abonelik
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sadece admin görür. {data.price_per_month_usd > 0
              ? `Aylık fiyat: $${data.price_per_month_usd}`
              : "Fiyat env (PRICE_PER_MONTH_USD) ayarlı değil → MRR hesaplanmıyor."}
          </p>
        </div>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent"
        >
          Yenile
        </button>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Aktif Abone
              </span>
              <Users className="size-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-semibold mt-2">{data.active_subscribers}</div>
            <div className="text-[11px] text-muted-foreground">/ {data.total_users} toplam</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                MRR (tahmini)
              </span>
              <TrendingUp className="size-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-semibold mt-2 text-emerald-400">
              ${data.mrr_usd.toFixed(2)}
            </div>
            <div className="text-[11px] text-muted-foreground">aylık tekrarlayan</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Son 30g Gelir
              </span>
              <DollarSign className="size-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-semibold mt-2">${data.last_30d_revenue_usd.toFixed(2)}</div>
            <div className="text-[11px] text-muted-foreground">kullanılan kodlar</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Kod Dönüşümü
              </span>
              <Ticket className="size-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-semibold mt-2">{data.code_conversion_pct}%</div>
            <div className="text-[11px] text-muted-foreground">
              {data.codes_used}/{data.total_codes_generated} kullanıldı
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Davet Kodu Durumu</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Toplam üretilen</div>
              <div className="text-xl font-semibold">{data.total_codes_generated}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Kullanılan</div>
              <div className="text-xl font-semibold text-emerald-400">{data.codes_used}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Kullanılmayan</div>
              <div className="text-xl font-semibold text-amber-400">{data.codes_unused}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">İptal edilen</div>
              <div className="text-xl font-semibold text-red-400">{data.codes_revoked}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiring soon */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="size-4 text-amber-400" /> Bitişe 7 Günden Az Kalan Aboneler
          </CardTitle>
          <CardDescription>
            Bu kullanıcılara Telegram üzerinden yenileme hatırlatması yapabilirsin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.expiring_soon.length === 0 ? (
            <div className="text-sm text-muted-foreground">Hepsi 7+ gün üstü, sıkıntı yok.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left py-2">Kullanıcı</th>
                  <th className="text-left py-2">Bitiş</th>
                  <th className="text-right py-2">Kalan</th>
                </tr>
              </thead>
              <tbody>
                {data.expiring_soon.map((s) => (
                  <tr key={s.username} className="border-b border-border/30">
                    <td className="py-2 font-mono">{s.username}</td>
                    <td className="py-2 text-xs text-muted-foreground">
                      {s.expires_at.slice(0, 10)}
                    </td>
                    <td className="py-2 text-right">
                      <Badge
                        variant="outline"
                        className={
                          s.days_left <= 1
                            ? "border-red-500/30 text-red-400"
                            : s.days_left <= 3
                              ? "border-amber-500/30 text-amber-400"
                              : "border-emerald-500/30 text-emerald-400"
                        }
                      >
                        {s.days_left} gün
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Growth */}
      {data.monthly_growth.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aylık Yeni Kayıt (son 6 ay)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {data.monthly_growth.map((m) => {
                const max = Math.max(...data.monthly_growth.map((x) => x.n), 1);
                const w = (m.n / max) * 100;
                return (
                  <div key={m.ym} className="flex items-center gap-3 text-xs">
                    <span className="font-mono w-16 text-muted-foreground">{m.ym}</span>
                    <div className="flex-1 bg-muted/30 rounded-sm h-5 overflow-hidden">
                      <div
                        className="bg-emerald-500/40 h-full"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                    <span className="w-8 text-right">{m.n}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="size-4" /> Veritabanı Yedekleme
          </CardTitle>
          <CardDescription>
            Otomatik: her gün UTC 03:00. Manuel tetikleme aşağıdaki butonla. Yedek Telegram admin
            chat'ine gönderilir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button
            onClick={runBackup}
            disabled={busy}
            className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {busy ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="size-3.5" />
            )}
            Manuel Backup Çalıştır
          </button>
          {backupResult && (
            <div className="mt-3 text-xs text-muted-foreground">{backupResult}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
