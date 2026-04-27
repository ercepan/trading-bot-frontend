"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Globe,
  Radar,
  Zap,
  Bell,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Check,
  Sparkles,
  Lock,
  Send,
} from "lucide-react";
import { BullLogo } from "@/components/bull-logo";
import { useAuth } from "@/components/auth-context";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Login olmuş kullanıcı için CTA → dashboard'a (admin) veya bist'e (subscriber)
  const dashboardHref = user
    ? user.role === "admin"
      ? "/dashboard"
      : "/bist"
    : "/auth/login";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/85 backdrop-blur-md border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <BullLogo className="size-6" />
            </div>
            <span className="font-bold tracking-tight text-base sm:text-lg">
              BULLS <span className="text-emerald-400">OF</span> NASDAQ
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="#ozellikler"
              className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
            >
              Özellikler
            </Link>
            <Link
              href="#nasil"
              className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
            >
              Nasıl Çalışır
            </Link>
            <Link
              href="#fiyat"
              className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
            >
              Fiyat
            </Link>
            {!loading && user ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-1.5 text-sm rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-medium px-4 py-2 transition-colors"
              >
                Panele git <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
                >
                  Giriş
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-1.5 text-sm rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-medium px-4 py-2 transition-colors"
                >
                  Hesap aç <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 md:px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute top-40 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 mb-6">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-300">Topluluk · Resmi Açıklama · AI Sentiment</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            Borsada{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              sakin kal
            </span>
            ,
            <br className="hidden sm:inline" />
            doğru veriyle hareket et.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            BIST100 ve ABD hisselerinin nabzını topluluk mention'ı, resmi
            açıklamalar ve AI sentiment ile tek panelde topla. Sinyaller her 2
            saatte taze, Telegram'a anlık.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 text-base transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="size-4" />
              Aramıza katıl
            </Link>
            <Link
              href="#nasil"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-border hover:bg-accent text-foreground px-6 py-3 text-base transition-colors"
            >
              Nasıl çalışır?
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Davet kodu gerekli · Tek cihaz · 1 aylık abonelik
          </p>
        </div>

        {/* Mock dashboard preview */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="relative rounded-xl border border-border bg-card/50 backdrop-blur p-1 shadow-2xl shadow-emerald-500/5">
            <div className="rounded-lg bg-background/80 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Canlı Örnek · BIST Radar
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  güncellendi
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  { t: "TUPRS", c: "Petrol Rafineri", s: "+0.75", b: true },
                  { t: "GUBRF", c: "Gübre Fabrikaları", s: "+0.64", b: true },
                  { t: "HUBVC", c: "Hub Girişim", s: "-1.00", b: false },
                ].map((r) => (
                  <div
                    key={r.t}
                    className="rounded-md border border-border p-3 hover:border-emerald-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold">{r.t}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          r.b
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {r.b ? "yükseliş" : "düşüş"}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {r.c}
                    </div>
                    <div
                      className={`text-sm font-mono mt-2 ${
                        r.b ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      skor {r.s}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section id="ozellikler" className="py-20 px-4 md:px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Bir panelde her şey
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Türk ve Amerikan piyasalarını farklı uygulamalarda takip etmeyi
              bırak. Sinyaller, sentiment, resmi açıklamalar tek yerde.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Globe,
                title: "BIST100 Radarı",
                desc:
                  "88 hisse · resmi açıklamalar + Türkçe haber sentiment + fiyat momentum birleşik skor.",
                color: "text-emerald-400",
              },
              {
                icon: Radar,
                title: "ABD Sentiment",
                desc:
                  "ABD topluluk forumlarında en çok konuşulan 30 hisse · 24 saat sıralama momentum.",
                color: "text-blue-400",
              },
              {
                icon: Zap,
                title: "Hisse Sinyalleri",
                desc:
                  "AI destekli BUY/SELL/HOLD · giriş bölgesi, stop, hedef · güven skorlu.",
                color: "text-amber-400",
              },
              {
                icon: Bell,
                title: "Telegram Anlık",
                desc:
                  "Her yeni sinyal Telegram'a düşer · günlük özet · drawdown uyarısı.",
                color: "text-purple-400",
              },
              {
                icon: ShieldCheck,
                title: "Resmi Açıklama Filtresi",
                desc:
                  "Şirketlerin SPK'ya sundukları resmi açıklamalar AI ile özetlenir, bullish/bearish etiketlenir.",
                color: "text-amber-400",
              },
              {
                icon: TrendingUp,
                title: "2 Saatte Bir Güncel",
                desc:
                  "Veri 7/24 toplanır · sinyaller bayatlamaz · panel her zaman taze.",
                color: "text-emerald-400",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-xl border border-border bg-card/30 p-6 hover:border-emerald-500/30 hover:bg-card/60 transition-all"
                >
                  <div
                    className={`inline-flex items-center justify-center size-10 rounded-lg bg-background border border-border ${f.color} mb-4`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section id="nasil" className="py-20 px-4 md:px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              3 adımda başla
            </h2>
            <p className="mt-3 text-muted-foreground">
              60 saniye içinde panele giriş yaparsın.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                num: "01",
                title: "Davet kodu al",
                desc:
                  "Telegram'dan ulaş, ödeme bilgisini al ve kripto/USDT ile ödeme yap. Karşılığında 16 karakterlik davet kodun gelir.",
              },
              {
                num: "02",
                title: "Hesabını aç",
                desc:
                  "Kullanıcı adı + parola + davet kodu. E-posta veya telefon istemiyoruz. Tek cihaza bağlı, 30 gün aktif.",
              },
              {
                num: "03",
                title: "Sinyalleri takip et",
                desc:
                  "BIST + ABD radarları, AI sinyaller ve Telegram bildirimleri otomatik gelir. Sen sadece kararı veriyorsun.",
              },
            ].map((s) => (
              <div
                key={s.num}
                className="flex gap-5 items-start rounded-xl border border-border bg-card/30 p-5 hover:border-emerald-500/30 transition-colors"
              >
                <div className="font-mono text-2xl font-bold text-emerald-400 shrink-0 w-12">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fiyat */}
      <section id="fiyat" className="py-20 px-4 md:px-6 border-t border-border/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Sade fiyat. Saklı maliyet yok.
            </h2>
          </div>

          <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 to-transparent p-8 shadow-xl shadow-emerald-500/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <BullLogo className="size-6" />
              </div>
              <div>
                <div className="font-bold text-lg">Aylık Abonelik</div>
                <div className="text-xs text-muted-foreground">
                  Tek cihaz · 30 gün aktif · iade yok
                </div>
              </div>
            </div>

            <div className="my-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold">$25</span>
              <span className="text-muted-foreground">/ ay</span>
            </div>

            <ul className="space-y-2.5 text-sm mb-6">
              {[
                "BIST100 + ABD radarları",
                "AI hisse sinyalleri (BUY / SELL / HOLD)",
                "Resmi açıklama özetleri",
                "Telegram anlık bildirim + günlük özet",
                "2 saatte bir güncel veri",
                "30 gün, kesintisiz",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 transition-colors"
            >
              <Sparkles className="size-4" />
              Davet kodum var, hesap açmak istiyorum
            </Link>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Davet kodun yoksa{" "}
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground inline-flex items-center gap-1"
              >
                <Send className="size-3" /> Telegram'dan ulaş
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* SSS / Trust */}
      <section className="py-20 px-4 md:px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Sıkça sorulanlar
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Bu yatırım tavsiyesi mi?",
                a: "Hayır. Platform SPK'dan yatırım danışmanlığı lisansı almamıştır. Sunulan tüm bilgiler genel bilgilendirme amaçlıdır. Yatırım kararları tarafınıza aittir.",
              },
              {
                q: "Verilerimi kim görür?",
                a: "Sadece kullanıcı adı + parola hash'i + cihaz UUID'si saklanır. E-posta, telefon, T.C. kimlik veya finansal bilgi toplanmaz. Detay için /kvkk sayfasına bakın.",
              },
              {
                q: "Davet kodunu nasıl alırım?",
                a: "Telegram üzerinden iletişime geçin. Ödeme onaylandığında 16 karakterlik tek-kullanımlık davet kodu gönderilir.",
              },
              {
                q: "Aboneliğimi nasıl yenilerim?",
                a: "Süre dolduğunda yeni davet kodu satın alır, profilinde 'Yenile' butonundan girersin. Mevcut hesabın korunur.",
              },
              {
                q: "Birden fazla cihazda kullanabilir miyim?",
                a: "Hayır, kötüye kullanımı önlemek için tek cihaza bağlı. Cihaz değiştirmek için admin'e Telegram'dan ulaş.",
              },
            ].map((f, i) => (
              <details
                key={i}
                className="group rounded-lg border border-border bg-card/30 hover:border-emerald-500/30 transition-colors"
              >
                <summary className="cursor-pointer p-4 font-medium text-sm flex items-center justify-between">
                  {f.q}
                  <span className="text-emerald-400 group-open:rotate-180 transition-transform">
                    ↓
                  </span>
                </summary>
                <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 md:px-6 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Doğru veri, sakin karar.
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Topluluk paniğine kapılmadan, eline sağlam veri alarak hareket et.
            Davet kodun varsa 60 saniyede başla.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 transition-colors"
            >
              <Sparkles className="size-4" /> Hesap aç
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-border hover:bg-accent text-foreground px-6 py-3 transition-colors"
            >
              <Lock className="size-4" /> Giriş yap
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <BullLogo className="size-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              BULLS <span className="text-emerald-400">OF</span> NASDAQ
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Kullanım Şartları
            </Link>
            <Link href="/kvkk" className="hover:text-foreground transition-colors">
              KVKK
            </Link>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <Send className="size-3" /> Telegram
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 text-center text-[11px] text-muted-foreground/70">
          ⚠️ Yatırım tavsiyesi değildir. SPK mevzuatı kapsamında yatırım
          danışmanlığı hizmeti sunulmamaktadır. © 2026 Bulls of Nasdaq.
        </div>
      </footer>
    </div>
  );
}
