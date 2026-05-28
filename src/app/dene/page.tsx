"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Lock } from "lucide-react";

/**
 * /dene — DENEME KAYITLARI KAPALI (soft cancel).
 *
 * Bu sayfa eskiden 7 günlük ücretsiz deneme signup'ı için kullanılıyordu.
 * Şu an yeni deneme kayıtları kapalı; mevcut deneme kullanıcıları süreleri
 * (max 7 gün) bitene kadar erişimine devam eder.
 *
 * Backend /api/trial/* endpoint'leri 410 Gone döner — geri açmak için
 * bot/main.py içindeki TRIAL_SIGNUP_DISABLED bayrağını False yap.
 */
export default function DenePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex items-center justify-center px-6 py-12">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full bg-emerald-500/[0.05] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="w-full max-w-xl space-y-10 relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-11 rounded-md bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
            <span
              className="font-display text-emerald-400 text-2xl leading-none"
              style={{ fontStyle: "italic", fontWeight: 600 }}
            >
              N
            </span>
          </div>
          <div>
            <div className="font-display text-lg leading-none">Nexora</div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.25em] mt-1">
              BIST · NASDAQ · Crypto
            </div>
          </div>
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Lock className="size-3.5 text-amber-400" />
            <span className="font-mono text-[11px] text-amber-300 uppercase tracking-[0.28em]">
              Deneme · Şu an kapalı
            </span>
          </div>
          <h1
            className="font-display font-medium tracking-tight"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              lineHeight: "1",
              letterSpacing: "-0.02em",
            }}
          >
            Ücretsiz deneme{" "}
            <em
              className="text-amber-400"
              style={{ fontStyle: "italic", fontWeight: 600 }}
            >
              kapatıldı.
            </em>
          </h1>
          <p className="text-white/55 text-base leading-relaxed">
            Mevcut deneme kullanıcıları süreleri bitene kadar erişimine devam
            ediyor. Yeni kayıt için premium paketlerimizi inceleyebilirsin —
            ilk ay özel fiyat, davet kodu ile ekstra indirim.
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-7 space-y-4">
          <div className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
            Devam etmek için
          </div>
          <Link
            href="/satin-al"
            className="group w-full inline-flex items-center justify-between gap-3 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-4 text-base font-semibold transition-all"
          >
            <span className="inline-flex items-center gap-3">
              <Sparkles className="size-4" />
              Premium paketleri incele
            </span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/auth/login"
            className="w-full inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/85 font-mono text-sm uppercase tracking-[0.22em] px-6 py-3 transition-all"
          >
            Hesabın var mı? Giriş yap
          </Link>
        </div>

        <p className="font-mono text-[10px] text-white/35 text-center uppercase tracking-[0.2em]">
          Yatırım tavsiyesi değildir · SPK lisanssız bilgi servisi
        </p>
      </div>
    </div>
  );
}
