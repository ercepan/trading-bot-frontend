"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Copy,
  CheckCircle2,
  Wallet,
  TrendingUp,
  Loader2,
  Gift,
  Share2,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-context";
import { referralApi, type ReferralStats } from "@/lib/referral";
import { SITE_URL } from "@/lib/config";

export default function ReferansPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  const [payouts, setPayouts] = useState<Awaited<ReturnType<typeof referralApi.payouts>>["payouts"]>([]);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutAddr, setPayoutAddr] = useState("");
  const [payoutMsg, setPayoutMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([referralApi.myStats(), referralApi.payouts()])
      .then(([s, p]) => {
        setStats(s);
        setPayouts(p.payouts);
        setError(null);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => setLoading(false));
  }, []);

  const refLink = stats?.code ? `${SITE_URL}?ref=${stats.code}` : "";

  const copy = async (text: string, kind: "link" | "code") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2500);
    } catch {}
  };

  const onSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutMsg(null);
    const amt = parseFloat(payoutAmount);
    if (!amt || amt <= 0) {
      setPayoutMsg({ kind: "err", text: "Geçerli tutar gir" });
      return;
    }
    setSubmitting(true);
    try {
      await referralApi.requestPayout(amt, payoutAddr.trim());
      setPayoutMsg({ kind: "ok", text: "Çekim talebin alındı, admin onayı bekleniyor" });
      setPayoutAmount("");
      setPayoutAddr("");
      // Refresh
      const [s, p] = await Promise.all([referralApi.myStats(), referralApi.payouts()]);
      setStats(s);
      setPayouts(p.payouts);
    } catch (e) {
      setPayoutMsg({ kind: "err", text: e instanceof Error ? e.message : "Hata" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-5">
          <div className="font-semibold text-red-400 mb-2">
            Referans bilgisi alınamadı
          </div>
          {error && (
            <div className="text-xs font-mono text-muted-foreground bg-background/40 rounded p-2 mb-3 break-all">
              {error}
            </div>
          )}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Olası sebepler:</p>
            <ul className="list-disc list-inside text-xs space-y-0.5 mt-1">
              <li>Tarayıcı önbelleği eski (sayfayı <strong>Cmd+Shift+R</strong> ile yenile)</li>
              <li>Backend henüz deploy bitmemiş (1-2 dakika bekle)</li>
              <li>Aboneliğin aktif değil — yeniden giriş yap</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-semibold px-4 py-2"
          >
            Tekrar dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero */}
      <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Gift className="size-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Referans <span className="text-emerald-400">Sistemi</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Arkadaşlarına linkini paylaş — onlar %{stats.discount_pct} indirim al,
              sen %{stats.commission_pct} komisyon kazan.
            </p>
          </div>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          <Card className="p-3 border-border/60">
            <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Tıklama</div>
            <div className="text-2xl font-bold mt-1">{stats.click_count}</div>
          </Card>
          <Card className="p-3 border-border/60">
            <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Kayıt olan</div>
            <div className="text-2xl font-bold mt-1">{stats.signup_count}</div>
          </Card>
          <Card className="p-3 border-border/60">
            <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Aktif abone</div>
            <div className="text-2xl font-bold mt-1 text-emerald-400">{stats.active_count}</div>
          </Card>
          <Card className="p-3 border-emerald-500/40 bg-emerald-500/5">
            <div className="text-[11px] text-emerald-400 uppercase tracking-wide font-medium">
              🎁 Gün hediyesi
            </div>
            <div className="text-2xl font-bold mt-1 text-emerald-400">
              {stats.balance.earned_days ?? 0}
              <span className="text-sm font-normal text-emerald-400/70 ml-1">gün</span>
            </div>
          </Card>
          <Card className="p-3 border-border/60">
            <div className="text-[11px] text-muted-foreground uppercase tracking-wide">USDT bakiye</div>
            <div className="text-2xl font-bold mt-1">
              ${stats.balance.available.toFixed(2)}
            </div>
          </Card>
        </div>

        {(stats.balance.earned_days ?? 0) > 0 && (
          <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 text-sm">
            <span className="text-emerald-300">🎉</span>{" "}
            <span className="text-emerald-200">
              Davet ettiklerin TL ile abone oldu —{" "}
              <b>{stats.balance.earned_days} gün</b> ücretsiz abonelik kazandın, otomatik aboneliğine eklendi.
            </span>
          </div>
        )}
      </div>

      {/* Senin linkin */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="size-5 text-emerald-400" />
          <h2 className="font-semibold text-lg">Referans Linkin</h2>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <code className="flex-1 font-mono text-sm bg-muted/40 border border-border/60 rounded-md px-3 py-2 truncate">
            {refLink}
          </code>
          <Button
            onClick={() => copy(refLink, "link")}
            className="bg-emerald-500 hover:bg-emerald-600 text-black"
            size="sm"
          >
            {copied === "link" ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
            {copied === "link" ? "Kopyalandı" : "Kopyala"}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Referans Kodu:</span>
          <code className="font-mono text-emerald-400 font-bold">{stats.code}</code>
          <button
            onClick={() => copy(stats.code || "", "code")}
            className="text-muted-foreground hover:text-foreground"
          >
            {copied === "code" ? "✓" : <Copy className="size-3" />}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-border/40 grid md:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div>
            <strong className="text-foreground block mb-1">Nasıl paylaşırım?</strong>
            <ul className="space-y-1 list-disc list-inside">
              <li>Twitter/X bio'na link ekle</li>
              <li>WhatsApp grup, hikaye</li>
              <li>Telegram kanal/grup</li>
              <li>TikTok bio + video CTA</li>
            </ul>
          </div>
          <div>
            <strong className="text-foreground block mb-1">Nasıl kazanırım?</strong>
            <ul className="space-y-1 list-disc list-inside">
              <li>Linke tıklayan → çerez 30 gün saklanır</li>
              <li>
                <b className="text-emerald-400">₺ TL ödeyen</b> →
                aboneliğine <b>{Math.round(30 * stats.commission_pct / 100)} gün</b> eklenir
              </li>
              <li>
                <b>$ USDT ödeyen</b> → $25/$40 üzerinden ${(25 * stats.commission_pct / 100).toFixed(2)} / ${(40 * stats.commission_pct / 100).toFixed(2)} kredi
              </li>
              <li>Gün hediyesi otomatik — para çekimi gerekmez</li>
              <li>USDT bakiyesi ${stats.balance.min_payout}+ olunca çekebilirsin</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Davet ettiklerin listesi */}
      {stats.referees.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="size-5 text-emerald-400" />
            <h2 className="font-semibold text-lg">Davet Ettiklerin ({stats.signup_count})</h2>
          </div>
          <div className="space-y-2">
            {stats.referees.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border/40 bg-muted/20 px-3 py-2"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono">@{r.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                {r.is_active ? (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                    Aktif
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Pasif
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Payout — çekim */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="size-5 text-emerald-400" />
          <h2 className="font-semibold text-lg">Komisyon Çek</h2>
        </div>

        <div className="rounded-md border border-border/40 bg-muted/20 p-3 text-sm mb-4 grid grid-cols-3 gap-3">
          <div>
            <div className="text-[11px] text-muted-foreground uppercase">Kazanılan</div>
            <div className="font-semibold mt-0.5">${stats.balance.earned_total.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground uppercase">Çekildi/Bekleyen</div>
            <div className="font-semibold mt-0.5">${stats.balance.withdrawn.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-[11px] text-emerald-400 uppercase font-medium">Çekilebilir</div>
            <div className="font-bold mt-0.5 text-emerald-400">
              ${stats.balance.available.toFixed(2)}
            </div>
          </div>
        </div>

        {!stats.balance.can_withdraw ? (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-300">
            Minimum çekim ${stats.balance.min_payout}. Mevcut: ${stats.balance.available.toFixed(2)}.
            Daha fazla davet edince çekilebilir hale gelir.
          </div>
        ) : (
          <form onSubmit={onSubmitPayout} className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Tutar (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={stats.balance.min_payout}
                  max={stats.balance.available}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder={`min ${stats.balance.min_payout}`}
                  disabled={submitting}
                  className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  BSC (BEP-20) USDT adresin
                </label>
                <input
                  type="text"
                  value={payoutAddr}
                  onChange={(e) => setPayoutAddr(e.target.value)}
                  placeholder="0x..."
                  disabled={submitting}
                  className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>
            {payoutMsg && (
              <div
                className={`rounded-md border px-3 py-2 text-xs ${
                  payoutMsg.kind === "ok"
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                    : "border-red-500/30 bg-red-500/5 text-red-300"
                }`}
              >
                {payoutMsg.text}
              </div>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-600 text-black"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <TrendingUp className="size-4" />}
              Çekim Talebi Oluştur
            </Button>
            <p className="text-[11px] text-muted-foreground">
              Admin manuel onaylar (24-48 saat). USDT adresinin BSC ağı (BEP-20) olduğundan emin ol.
            </p>
          </form>
        )}

        {/* Payout history */}
        {payouts.length > 0 && (
          <div className="mt-5 pt-5 border-t border-border/40">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Çekim Geçmişi
            </div>
            <div className="space-y-2">
              {payouts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 text-xs rounded-md border border-border/40 bg-muted/10 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">${p.amount_usd.toFixed(2)}</span>
                    <span className="text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString("tr-TR")}
                    </span>
                    {p.tx_hash && (
                      <a
                        href={`https://bscscan.com/tx/${p.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline inline-flex items-center gap-0.5"
                      >
                        TX <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      p.status === "approved"
                        ? "border-emerald-500/40 text-emerald-400"
                        : p.status === "rejected"
                          ? "border-red-500/40 text-red-400"
                          : "border-amber-500/40 text-amber-400"
                    }
                  >
                    {p.status === "approved" ? "✓ Tamamlandı" : p.status === "rejected" ? "✕ Reddedildi" : "⏳ Bekliyor"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
