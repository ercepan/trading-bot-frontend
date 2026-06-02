"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Banknote, Bitcoin } from "lucide-react";

/**
 * /paketler — Ödeme yöntemi hub'ı.
 *
 * Landing CTA "Premium paketleri incele" buradan geçer.
 * Kullanıcı 2 yoldan birini seçer:
 *   • TL (Shopier)  → /odeme  — 3 plan: Sentiment Giriş ₺200/15g · Sinyal ₺899/30g · Sinyal+Eğitim ₺1499/30g
 *   • Kripto (USDT) → /satin-al — 2 plan: Signal $25 · Premium $40 (BSC BEP-20 transfer)
 *
 * Editorial × terminal aesthetic: mono kicker + Plus Jakarta Sans display headline
 * + italic emerald accent + 2 büyük metod kartı.
 */
export default function PaketlerPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden py-12 px-4">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full bg-emerald-500/[0.06] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <style>{`
        @keyframes nxFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .nx-reveal { opacity: 0; animation: nxFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        {/* Üst nav */}
        <Link
          href="/"
          className="nx-reveal font-mono text-[11px] text-white/45 hover:text-emerald-300 uppercase tracking-[0.22em] inline-flex items-center gap-2 transition-colors"
          style={{ animationDelay: "0.05s" }}
        >
          <ArrowLeft className="size-3.5" /> Ana sayfa
        </Link>

        {/* Hero */}
        <div className="space-y-4">
          <div className="nx-reveal flex items-center gap-3" style={{ animationDelay: "0.15s" }}>
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              Ödeme yöntemi seç
            </span>
          </div>
          <h1
            className="font-display nx-reveal font-medium tracking-tight"
            style={{
              animationDelay: "0.25s",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              lineHeight: "1",
              letterSpacing: "-0.02em",
            }}
          >
            Nasıl{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              ödemek istersin?
            </em>
          </h1>
          <p
            className="nx-reveal text-white/55 text-base leading-relaxed max-w-xl"
            style={{ animationDelay: "0.35s" }}
          >
            İki yol: Türk Lirası ile Shopier üzerinden (kart/havale) veya kripto USDT ile (anonim,
            kart yok). Seç, paketleri gör, dene.
          </p>
        </div>

        {/* İki büyük metod kartı */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* TL — Shopier */}
          <Link
            href="/odeme"
            className="nx-reveal group block bg-black/40 border-2 border-white/10 hover:border-emerald-500/50 backdrop-blur-sm p-7 md:p-8 transition-all hover:bg-emerald-500/[0.03]"
            style={{ animationDelay: "0.45s" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-md bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                  <Banknote className="size-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-emerald-300 uppercase tracking-[0.22em]">
                    01 / TL
                  </div>
                  <div className="font-display text-2xl font-medium tracking-tight">
                    Türk Lirası
                  </div>
                </div>
              </div>
              <ArrowRight className="size-5 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>

            <p className="text-sm text-white/55 leading-relaxed mb-5">
              Kart / havale ile Shopier üzerinden — anonim, hesap açmaya gerek yok.
              Ödeme sonrası mailine davet kodu gelir.
            </p>

            {/* TL plan preview — 3 plan */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] text-white/60 uppercase tracking-[0.18em]">
                  Sentiment Giriş
                </span>
                <span className="font-display tabular-nums text-white/80">
                  <span className="text-emerald-400">200 TL</span>
                  <span className="text-white/40 text-sm"> / 15 gün</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] text-white/60 uppercase tracking-[0.18em]">
                  Sinyal Paketi
                </span>
                <span className="font-display tabular-nums text-white/80">
                  <span className="text-emerald-400">899 TL</span>
                  <span className="text-white/40 text-sm"> / 30 gün</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] text-white/60 uppercase tracking-[0.18em]">
                  Sinyal + Eğitim
                </span>
                <span className="font-display tabular-nums text-white/80">
                  <span className="text-emerald-400">1.499 TL</span>
                  <span className="text-white/40 text-sm"> / 30 gün</span>
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 font-mono text-[10px] text-white/40 uppercase tracking-[0.18em]">
              Shopier · kart · havale · 3D Secure
            </div>
          </Link>

          {/* Kripto — USDT */}
          <Link
            href="/satin-al"
            className="nx-reveal group block bg-black/40 border-2 border-white/10 hover:border-amber-500/50 backdrop-blur-sm p-7 md:p-8 transition-all hover:bg-amber-500/[0.03]"
            style={{ animationDelay: "0.55s" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-md bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
                  <Bitcoin className="size-5 text-amber-400" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-amber-300 uppercase tracking-[0.22em]">
                    02 / Kripto
                  </div>
                  <div className="font-display text-2xl font-medium tracking-tight">
                    USDT (BEP-20)
                  </div>
                </div>
              </div>
              <ArrowRight className="size-5 text-white/30 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>

            <p className="text-sm text-white/55 leading-relaxed mb-5">
              BSC (Binance Smart Chain) üzerinden USDT transferi. Kart yok, KYC yok.
              TX hash'ini yapıştır → bot otomatik doğrular → kod anında üretilir.
            </p>

            {/* Kripto plan preview — 2 plan */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] text-white/60 uppercase tracking-[0.18em]">
                  Signal Pack
                </span>
                <span className="font-display tabular-nums text-white/80">
                  <span className="text-amber-400">$25</span>
                  <span className="text-white/40 text-sm"> / 30 gün</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] text-white/60 uppercase tracking-[0.18em]">
                  Premium (Sinyal + Eğitim)
                </span>
                <span className="font-display tabular-nums text-white/80">
                  <span className="text-amber-400">$40</span>
                  <span className="text-white/40 text-sm"> / 30 gün</span>
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 font-mono text-[10px] text-white/40 uppercase tracking-[0.18em]">
              On-chain · anonim · BscScan doğrulama
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div
          className="nx-reveal space-y-3 pt-4 border-t border-white/5"
          style={{ animationDelay: "0.7s" }}
        >
          <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.22em]">
            Davet kodun var mı?{" "}
            <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300">
              Giriş yap →
            </Link>
          </p>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.22em]">
            Yatırım tavsiyesi değildir · SPK lisanssız bilgi servisi
          </p>
        </div>
      </div>
    </div>
  );
}
