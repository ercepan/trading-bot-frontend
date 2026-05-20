"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * /preview — Landing redesign deneme.
 * Editorial Magazine × Bloomberg Terminal hybrid.
 * Type: Fraunces (variable serif, editorial) + Geist + JetBrains Mono.
 * Composition: asimetrik 7/5 split, terminal canlı widget sağda.
 * Beğenilirse /'ye yedek, beğenilmezse sadece bu route silinir.
 */
export default function PreviewLanding() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const tickers = [
    { t: "TUPRS", c: "Tüpraş Petrol",  s: "+0.75", bull: true,  vol: "892M" },
    { t: "GUBRF", c: "Gübre Fabrikaları", s: "+0.64", bull: true,  vol: "234M" },
    { t: "EREGL", c: "Ereğli Demir Çelik", s: "+0.41", bull: true,  vol: "1.2B" },
    { t: "HUBVC", c: "Hub Girişim",   s: "-1.00", bull: false, vol: "87M"  },
  ];

  return (
    <>
      {/* Google Fonts — editorial display + clean body */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Geist:wght@300..900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .nx-preview, .nx-preview * { font-family: 'Geist', -apple-system, system-ui, sans-serif; }
        .nx-preview .display { font-family: 'Fraunces', Georgia, serif; font-variation-settings: "opsz" 144, "SOFT" 100; }
        .nx-preview .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        @keyframes nxFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .nx-preview .reveal { opacity: 0; animation: nxFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .nx-preview .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="nx-preview min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
        {/* Background atmosphere */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full bg-emerald-500/[0.07] blur-[140px]" />
          <div className="absolute top-[55%] right-[2%] size-[420px] rounded-full bg-amber-500/[0.04] blur-[110px]" />
        </div>

        {/* Subtle grid */}
        <div
          className="fixed inset-0 -z-10 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Grain overlay */}
        <div className="grain fixed inset-0 -z-10 opacity-[0.025] mix-blend-overlay pointer-events-none" />

        {/* Header */}
        <header
          className="relative z-10 px-6 md:px-12 lg:px-16 py-7 flex items-center justify-between reveal"
          style={{ animationDelay: "0.05s" }}
        >
          <Link href="/preview" className="flex items-center gap-3 group">
            <div className="size-10 rounded-md bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
              <span className="display text-emerald-400 text-2xl leading-none" style={{ fontStyle: "italic", fontWeight: 600 }}>
                N
              </span>
            </div>
            <div>
              <div className="display text-lg leading-none">Nexora</div>
              <div className="mono text-[10px] text-white/40 uppercase tracking-[0.25em] mt-1">
                Sentiment Terminal
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm">
            <Link href="/performans" className="text-white/55 hover:text-white transition-colors">
              Performans
            </Link>
            <Link href="/iletisim" className="text-white/55 hover:text-white transition-colors">
              İletişim
            </Link>
            <Link href="/auth/login" className="text-white/55 hover:text-white transition-colors">
              Giriş
            </Link>
            <Link
              href="/dene"
              className="bg-emerald-500 text-black px-4 py-2 rounded-sm text-sm font-semibold hover:bg-emerald-400 transition-colors"
            >
              7 gün ücretsiz dene
            </Link>
          </nav>
          <Link
            href="/dene"
            className="md:hidden bg-emerald-500 text-black px-3 py-1.5 rounded-sm text-xs font-semibold"
          >
            Dene
          </Link>
        </header>

        {/* HERO — asimetrik split */}
        <section className="relative z-10 px-6 md:px-12 lg:px-16 pt-10 md:pt-16 pb-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* SOL — Editorial başlık (7 sütun) */}
            <div className="lg:col-span-7 space-y-9">
              {/* Kicker */}
              <div className="reveal flex items-center gap-3" style={{ animationDelay: "0.25s" }}>
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
                  01 / BIST · NASDAQ · Crypto · Live
                </span>
              </div>

              {/* Massive editorial headline */}
              <h1
                className="display reveal font-medium tracking-tight"
                style={{
                  animationDelay: "0.35s",
                  fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)",
                  lineHeight: "0.96",
                  letterSpacing: "-0.02em",
                }}
              >
                Borsada{" "}
                <em
                  className="text-emerald-400"
                  style={{ fontStyle: "italic", fontWeight: 600 }}
                >
                  sakin kal,
                </em>
                <br />
                doğru veriyle hareket et.
              </h1>

              {/* Body */}
              <p
                className="reveal max-w-xl text-base md:text-lg leading-relaxed text-white/65 font-light"
                style={{ animationDelay: "0.55s" }}
              >
                Topluluk mention'ı, resmi açıklamalar ve AI sentiment — üç ayrı
                veri kaynağını tek bir skor altında topla. BIST 100 ve ABD
                hisseleri, her 2 saatte taze.
              </p>

              {/* CTA */}
              <div
                className="reveal flex flex-wrap items-center gap-3 pt-2"
                style={{ animationDelay: "0.75s" }}
              >
                <Link
                  href="/dene"
                  className="group inline-flex items-center gap-3 bg-emerald-500 text-black px-7 py-4 text-sm md:text-base font-semibold hover:bg-emerald-400 transition-all hover:scale-[1.02]"
                >
                  <span>7 gün ücretsiz dene</span>
                  <span className="mono text-xs opacity-60 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
                <Link
                  href="/odeme"
                  className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 px-6 py-4 text-sm md:text-base text-white/80 hover:text-white transition-all"
                >
                  TL ile al · ₺899
                </Link>
              </div>

              {/* Fine print */}
              <div
                className="reveal flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 text-[11px] text-white/35 mono uppercase tracking-[0.18em]"
                style={{ animationDelay: "0.95s" }}
              >
                <span>Kart bilgisi yok</span>
                <span className="size-1 rounded-full bg-white/20" />
                <span>30 sn'de içeride</span>
                <span className="size-1 rounded-full bg-white/20" />
                <span>Tek cihaz</span>
                <span className="size-1 rounded-full bg-white/20" />
                <Link href="/auth/login" className="hover:text-white/80 underline-offset-4 hover:underline">
                  Davet kodum var
                </Link>
              </div>
            </div>

            {/* SAĞ — Terminal canlı widget (5 sütun) */}
            <div
              className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-white/10 reveal"
              style={{ animationDelay: "0.85s" }}
            >
              <div className="bg-black/40 border border-white/10 backdrop-blur-sm shadow-[0_8px_60px_-12px_rgba(16,185,129,0.15)]">
                {/* Terminal header */}
                <div className="border-b border-white/10 px-5 py-3 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                    <span className="mono text-[10px] text-white/65 uppercase tracking-[0.22em]">
                      BIST Radar · Canlı
                    </span>
                  </div>
                  <span className="mono text-[10px] text-white/40">{time}</span>
                </div>

                {/* Terminal rows */}
                <div className="divide-y divide-white/5">
                  {tickers.map((r, i) => (
                    <div
                      key={r.t}
                      className="group px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.025] transition-colors cursor-default"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="mono text-[10px] text-white/25 w-5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <div className="mono text-sm font-semibold truncate">{r.t}</div>
                          <div className="text-[10px] text-white/40 truncate">{r.c}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-3">
                        <div
                          className={`mono text-sm font-semibold ${
                            r.bull ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {r.s}
                        </div>
                        <div className="text-[10px] text-white/30 mono">{r.vol}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Terminal footer */}
                <div className="border-t border-white/10 px-5 py-3 flex items-center justify-between bg-white/[0.02]">
                  <span className="mono text-[10px] text-white/40 uppercase tracking-[0.18em]">
                    Top 4 · 24h
                  </span>
                  <Link
                    href="/bist"
                    className="mono text-[10px] text-emerald-400 hover:text-emerald-300 uppercase tracking-[0.18em] inline-flex items-center gap-1.5"
                  >
                    Tamamı <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Editorial figure caption */}
              <div className="mt-5 flex items-start gap-3 max-w-sm ml-auto">
                <div className="mono text-[9px] text-white/30 uppercase tracking-[0.22em] mt-1 shrink-0">
                  Fig.01
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed font-light">
                  Topluluk + resmi açıklama + AI sentiment skoruyla canlı BIST
                  radarı. Demo veri — gerçek ekran üyelikte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom — editorial quote + back link */}
        <div
          className="relative z-10 border-t border-white/10 py-10 px-6 md:px-12 lg:px-16 reveal"
          style={{ animationDelay: "1.1s" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p
              className="display text-white/55 text-lg md:text-xl max-w-2xl leading-snug"
              style={{ fontStyle: "italic", fontWeight: 400 }}
            >
              "Bilgi yetmez, zamanlama da yetmez — ikisi aynı yerde olmalı."
            </p>
            <Link
              href="/"
              className="mono text-[10px] text-white/35 hover:text-white/70 uppercase tracking-[0.25em] inline-flex items-center gap-2 shrink-0"
            >
              <span>←</span> Eski tasarıma dön
            </Link>
          </div>
        </div>

        {/* Yasal alt-not */}
        <div className="relative z-10 border-t border-white/5 py-5 px-6 md:px-12 lg:px-16 text-center">
          <p className="text-[10px] text-white/30 mono uppercase tracking-[0.2em]">
            ⚠ Yatırım tavsiyesi değildir · SPK lisansı kapsamı dışındadır
          </p>
        </div>
      </div>
    </>
  );
}
