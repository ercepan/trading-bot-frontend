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
    const trimmedAddr = payoutAddr.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedAddr)) {
      setPayoutMsg({
        kind: "err",
        text: "Geçerli BSC (BEP-20) adresi gir — 0x ile başlamalı ve 42 karakter olmalı",
      });
      return;
    }
    setSubmitting(true);
    try {
      await referralApi.requestPayout(amt, trimmedAddr);
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
        <Loader2 className="size-6 animate-spin text-white/40" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="bg-black/40 border border-red-500/30 backdrop-blur-sm p-6">
          <div className="font-mono text-[11px] text-red-400 uppercase tracking-[0.22em] mb-3">
            Referans bilgisi alınamadı
          </div>
          {error && (
            <div className="font-mono text-[10px] text-white/50 bg-white/[0.02] border border-white/10 p-2.5 mb-3 break-all">
              {error}
            </div>
          )}
          <div className="text-sm text-white/60 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Olası sebepler</p>
            <ul className="text-xs space-y-1 list-disc list-inside text-white/55">
              <li>Tarayıcı önbelleği eski (sayfayı <strong>Cmd+Shift+R</strong> ile yenile)</li>
              <li>Backend henüz deploy bitmemiş (1-2 dakika bekle)</li>
              <li>Aboneliğin aktif değil — yeniden giriş yap</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold px-4 py-2.5"
          >
            Tekrar dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Hero */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Gift className="size-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
            04 / Davet Programı · Gün Hediyesi
          </span>
        </div>
        <h1
          className="font-display font-medium tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
        >
          Davet et,{" "}
          <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
            kazan.
          </em>
        </h1>
        <p className="font-mono text-[10px] text-white/45 uppercase tracking-[0.18em]">
          Onlar %{stats.discount_pct} indirim · sen %{stats.commission_pct} komisyon
        </p>
      </div>

      {/* Stat row — terminal cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-4">
          <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">Tıklama</div>
          <div className="font-display text-2xl font-medium tabular-nums mt-1.5 tracking-tight">{stats.click_count}</div>
        </div>
        <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-4">
          <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">Kayıt</div>
          <div className="font-display text-2xl font-medium tabular-nums mt-1.5 tracking-tight">{stats.signup_count}</div>
        </div>
        <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-4">
          <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">Aktif</div>
          <div className="font-display text-2xl font-medium tabular-nums mt-1.5 tracking-tight text-emerald-400">{stats.active_count}</div>
        </div>
        <div className="bg-emerald-500/[0.06] border-2 border-emerald-500/40 p-4 shadow-[0_8px_40px_-12px_rgba(16,185,129,0.3)]">
          <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.22em]">Gün Hediyesi</div>
          <div className="font-display text-2xl font-medium tabular-nums mt-1.5 tracking-tight text-emerald-400">
            {stats.balance.earned_days ?? 0}
            <span className="font-mono text-xs font-normal text-emerald-400/70 ml-1">gün</span>
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-4">
          <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">USDT</div>
          <div className="font-display text-2xl font-medium tabular-nums mt-1.5 tracking-tight">
            ${stats.balance.available.toFixed(2)}
          </div>
        </div>
      </div>

      {(stats.balance.earned_days ?? 0) > 0 && (
        <div className="border-l-2 border-emerald-500/40 bg-emerald-500/[0.04] pl-4 py-3 pr-3">
          <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.22em] mb-1">Tebrikler</div>
          <p className="text-sm text-emerald-100/85 leading-relaxed">
            Davet ettiklerin TL ile abone oldu —{" "}
            <strong className="text-emerald-300">{stats.balance.earned_days} gün</strong> ücretsiz abonelik kazandın, otomatik aboneliğine eklendi.
          </p>
        </div>
      )}

      {/* Referral link */}
      <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <Share2 className="size-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
            Referans Linkin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 font-mono text-sm bg-white/[0.02] border border-white/15 px-4 py-3 truncate text-emerald-300">
            {refLink}
          </code>
          <Button
            onClick={() => copy(refLink, "link")}
            className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-none px-4 py-3 font-semibold"
            size="sm"
          >
            {copied === "link" ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
            {copied === "link" ? "Kopyalandı" : "Kopyala"}
          </Button>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-white/50">
          <span className="uppercase tracking-[0.18em]">Kod:</span>
          <code className="text-emerald-400 font-semibold">{stats.code}</code>
          <button
            onClick={() => copy(stats.code || "", "code")}
            className="text-white/40 hover:text-emerald-300 transition-colors"
          >
            {copied === "code" ? "✓" : <Copy className="size-3" />}
          </button>
        </div>

        <div className="pt-5 border-t border-white/5 grid md:grid-cols-2 gap-6">
          <div>
            <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-3">
              Nasıl paylaşırım
            </div>
            <ul className="text-xs text-white/65 space-y-1.5 list-disc list-inside">
              <li>Twitter/X bio'na link ekle</li>
              <li>WhatsApp grup, hikaye</li>
              <li>Telegram kanal/grup</li>
              <li>TikTok bio + video CTA</li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-3">
              Nasıl kazanırım
            </div>
            <ul className="text-xs text-white/65 space-y-1.5 list-disc list-inside">
              <li>Linke tıklayan → çerez 30 gün saklanır</li>
              <li>
                <strong className="text-emerald-400">₺ TL ödeyen</strong> →
                aboneliğine <strong>{Math.round(30 * stats.commission_pct / 100)} gün</strong> eklenir
              </li>
              <li>
                <strong>$ USDT ödeyen</strong> → $25/$40 üzerinden ${(25 * stats.commission_pct / 100).toFixed(2)} / ${(40 * stats.commission_pct / 100).toFixed(2)} kredi
              </li>
              <li>Gün hediyesi otomatik — para çekimi gerekmez</li>
              <li>USDT bakiyesi ${stats.balance.min_payout}+ olunca çekebilirsin</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Referees */}
      {stats.referees.length > 0 && (
        <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Users className="size-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              Davet Ettiklerin · {stats.signup_count}
            </span>
          </div>
          <div className="space-y-1.5">
            {stats.referees.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-2 bg-white/[0.02] border border-white/10 px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-white/85">@{r.username}</span>
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.15em]">
                    {new Date(r.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                {r.is_active ? (
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.18em] border border-emerald-500/30 bg-emerald-500/[0.06] px-2 py-1">
                    Aktif
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em] border border-white/15 px-2 py-1">
                    Pasif
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payout */}
      <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <Wallet className="size-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
            Komisyon Çek · USDT (BEP-20)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.02] border border-white/10 p-4">
            <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">Kazanılan</div>
            <div className="font-display text-xl font-medium tabular-nums mt-1.5 tracking-tight">${stats.balance.earned_total.toFixed(2)}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-4">
            <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">Çekildi</div>
            <div className="font-display text-xl font-medium tabular-nums mt-1.5 tracking-tight">${stats.balance.withdrawn.toFixed(2)}</div>
          </div>
          <div className="bg-emerald-500/[0.06] border border-emerald-500/40 p-4">
            <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.22em]">Çekilebilir</div>
            <div className="font-display text-xl font-medium tabular-nums mt-1.5 tracking-tight text-emerald-400">
              ${stats.balance.available.toFixed(2)}
            </div>
          </div>
        </div>

        {!stats.balance.can_withdraw ? (
          <div className="border-l-2 border-amber-500/40 bg-amber-500/[0.04] pl-4 py-3 pr-3">
            <p className="font-mono text-[11px] text-amber-300/90 leading-relaxed">
              Minimum çekim ${stats.balance.min_payout}. Mevcut: ${stats.balance.available.toFixed(2)}.
              Daha fazla davet edince çekilebilir hale gelir.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmitPayout} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2">
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
                  className="w-full bg-white/[0.02] border border-white/15 px-3 py-3 text-sm font-mono focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2">
                  BSC (BEP-20) USDT Adresin
                </label>
                <input
                  type="text"
                  value={payoutAddr}
                  onChange={(e) => setPayoutAddr(e.target.value)}
                  placeholder="0x..."
                  disabled={submitting}
                  className="w-full bg-white/[0.02] border border-white/15 px-3 py-3 text-xs font-mono focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
                />
              </div>
            </div>
            {payoutMsg && (
              <div
                className={`font-mono text-[11px] px-4 py-2.5 uppercase tracking-wider border ${
                  payoutMsg.kind === "ok"
                    ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300"
                    : "border-red-500/30 bg-red-500/[0.06] text-red-400"
                }`}
              >
                {payoutMsg.text}
              </div>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-none px-6 py-3 font-semibold"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <TrendingUp className="size-4" />}
              Çekim Talebi Oluştur
            </Button>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em]">
              Admin manuel onaylar (24-48 saat) · BSC ağı (BEP-20)
            </p>
          </form>
        )}

        {payouts.length > 0 && (
          <div className="pt-5 border-t border-white/5 space-y-3">
            <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">
              Çekim Geçmişi
            </div>
            <div className="space-y-1.5">
              {payouts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 bg-white/[0.02] border border-white/10 px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display font-medium tabular-nums">${p.amount_usd.toFixed(2)}</span>
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.15em]">
                      {new Date(p.created_at).toLocaleDateString("tr-TR")}
                    </span>
                    {p.tx_hash && (
                      <a
                        href={`https://bscscan.com/tx/${p.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        TX <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 border ${
                      p.status === "approved"
                        ? "border-emerald-500/40 bg-emerald-500/[0.06] text-emerald-400"
                        : p.status === "rejected"
                          ? "border-red-500/40 bg-red-500/[0.06] text-red-400"
                          : "border-amber-500/40 bg-amber-500/[0.06] text-amber-400"
                    }`}
                  >
                    {p.status === "approved" ? "✓ Tamamlandı" : p.status === "rejected" ? "✕ Reddedildi" : "⏳ Bekliyor"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
