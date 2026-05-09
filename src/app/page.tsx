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
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NexoraLogo } from "@/components/nexora-logo";
import { useAuth } from "@/components/auth-context";
import {
  TELEGRAM_CHANNEL_URL,
  TELEGRAM_CHANNEL_DISPLAY,
  TWITTER_URL,
  TWITTER_USERNAME,
} from "@/lib/config";
import { XIcon } from "@/components/x-icon";
import { captureReferralFromUrl, checkReferralCode } from "@/lib/referral";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [refBanner, setRefBanner] = useState<{ code: string; from: string; pct: number } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Referral capture — ?ref=KOD geldiyse cookie'ye kaydet, banner göster
  useEffect(() => {
    captureReferralFromUrl().then((code) => {
      if (!code) return;
      checkReferralCode(code).then((res) => {
        if (res.valid && res.referrer_username) {
          setRefBanner({
            code,
            from: res.referrer_username,
            pct: res.discount_pct ?? 20,
          });
        }
      });
    });
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
            <div className="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <NexoraLogo className="size-8" />
            </div>
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-base sm:text-lg">
                <span className="text-emerald-400">N</span>EXORA
              </div>
              <div className="text-[8px] sm:text-[9px] text-muted-foreground tracking-[0.25em] uppercase">
                BIST · NASDAQ · CRYPTO
              </div>
            </div>
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
              href="#yorumlar"
              className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
            >
              Yorumlar
            </Link>
            <Link
              href="#fiyat"
              className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
            >
              Fiyat
            </Link>
            <Link
              href="/iletisim"
              className="hidden sm:inline text-sm text-muted-foreground hover:text-emerald-400 transition-colors px-3 py-1.5"
            >
              İletişim
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
                  href="/satin-al"
                  className="inline-flex items-center gap-1.5 text-sm rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-medium px-4 py-2 transition-colors"
                >
                  Davet kodu al <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Referral indirim banner — sadece ?ref= ile gelmiş ziyaretçilere */}
      {refBanner && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-emerald-500/95 text-black text-center py-2.5 px-4 text-sm font-medium shadow-lg backdrop-blur">
          🎁 <span className="font-bold">{refBanner.from}</span>{" "}
          sayesinde <span className="font-bold">%{refBanner.pct} indirim</span> aktif —
          satın al sayfasında otomatik uygulanır
        </div>
      )}

      {/* Hero */}
      <section className={`relative pb-20 px-4 md:px-6 overflow-hidden ${refBanner ? "pt-44" : "pt-32"}`}>
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
              href="/satin-al"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 text-base transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="size-4" />
              Paketleri incele · $25 / $40
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-border hover:bg-accent text-foreground px-6 py-3 text-base transition-colors"
            >
              Davet kodum var · Giriş yap
            </Link>
          </div>
          {/* Sosyal kanal CTA'lar — Telegram (sinyal) + X (sosyal) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <a
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#0088cc]/40 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#3da5e0] px-4 py-2 text-sm transition-colors"
            >
              <Send className="size-3.5" />
              <span>Telegram</span>
              <span className="text-[#3da5e0]/70 font-mono text-[12px]">{TELEGRAM_CHANNEL_DISPLAY}</span>
            </a>
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white/10 text-white px-4 py-2 text-sm transition-colors"
            >
              <XIcon className="size-3.5" />
              <span>X (Twitter)</span>
              <span className="text-white/60 font-mono text-[12px]">@{TWITTER_USERNAME}</span>
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            USDT BEP-20 · Otomatik onay · 30 sn içinde kod ekranda · Tek cihaz, 30 gün
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
      {/* Track Record / Şeffaflık preview — durmusborsa.com'dan ilham */}
      <section id="trackrecord" className="py-16 px-4 md:px-6 border-t border-border/50 bg-gradient-to-b from-emerald-500/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-400 bg-emerald-500/5">
              <Trophy className="size-3 mr-1" /> Şeffaflık Raporu
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Geçmiş sinyaller — <span className="text-emerald-400">şeffafça</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Her sinyal — kazanç olsun, kayıp olsun — silinmez. Ne kadar tuttuğumuzu
              kendi gözünle gör.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="rounded-xl border border-border/60 bg-background/40 p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">24</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide mt-1">
                Toplam Sinyal
              </div>
            </div>
            <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400">%76</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide mt-1">
                Tutma Oranı
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400">+%4.8</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide mt-1">
                Ort. 7g Getiri
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">30</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide mt-1">
                Gün Şeffaf
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/performans"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 transition-colors"
            >
              <TrendingUp className="size-4" />
              Tüm Geçmiş Sinyalleri Gör
              <ArrowRight className="size-4" />
            </Link>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Hesap açmadan görüntülenebilir · Şeffaflık herkesin hakkı
            </p>
          </div>
        </div>
      </section>

      {/* Üye Yorumları / Testimonials */}
      <section id="yorumlar" className="py-20 px-4 md:px-6 border-t border-border/50 bg-gradient-to-b from-transparent to-emerald-500/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
            >
              <Sparkles className="size-3 mr-1" /> Üye Yorumları
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Türkiye'nin dört bir yanından
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Trader, mühendis, doktor, esnaf, öğrenci — herkes Nexora'da farklı
              bir şey buluyor.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Ahmet Y.",
                role: "Mühendis · İstanbul",
                avatar: "AY",
                color: "from-emerald-400 to-cyan-400",
                stars: 5,
                text: "BIST radarı mesai sonrası bakmak için ideal. Her sabah 5 dakikada o günkü sentiment'a göre pozisyonlarımı gözden geçiriyorum. ASELS sinyali tek başına 3 aylık aboneliği geri ödedi.",
              },
              {
                name: "Selin K.",
                role: "Finans Öğrencisi · Ankara",
                avatar: "SK",
                color: "from-purple-400 to-pink-400",
                stars: 5,
                text: "Eğitim seti ders kitaplarından daha sade. Risk yönetimi ve psikoloji bölümleri uygulamalı, sınava değil hayata yönelik. Tavsiye ederim.",
              },
              {
                name: "Erdem T.",
                role: "Esnaf · İzmir",
                avatar: "ET",
                color: "from-amber-400 to-orange-400",
                stars: 5,
                text: "Borsadan anlamayan bir esnafım, ama Telegram kanalından gelen sinyaller net. Stop-loss diyince stop-loss, hedef diyince hedef. Karışık olmadan, dürüst.",
              },
              {
                name: "Can A.",
                role: "Yazılımcı · Berlin",
                avatar: "CA",
                color: "from-blue-400 to-indigo-400",
                stars: 5,
                text: "Yurtdışından Türk piyasasını takip etmenin zor olduğu düşünülürse, Nexora'nın WSB + KAP bütünleşik radar olması altın değerinde. Performans sayfası şeffaflık için çok güzel.",
              },
              {
                name: "Burak D.",
                role: "Doktor · Bursa",
                avatar: "BD",
                color: "from-red-400 to-pink-400",
                stars: 5,
                text: "Mesleğim gereği vaktim çok kısıtlı. Telegram bildirimleri sadece kritik anlarda geliyor, gereksiz spam yok. Sentiment skorları beklediğimden çok daha tutarlı.",
              },
              {
                name: "Zeynep Ö.",
                role: "Pazarlama Müdürü · İstanbul",
                avatar: "ZÖ",
                color: "from-teal-400 to-emerald-400",
                stars: 5,
                text: "Kripto tarafında Nexora'nın sentiment göstergesi anlamlı bir filtreleme yapıyor. Önceden tüm coin'lere bakmaya çalışıyordum, şimdi sadece radar yeşillerine odaklanıyorum.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 hover:border-emerald-500/30 transition-all p-5 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j} className="text-amber-400 text-sm">
                      ★
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-sm text-muted-foreground/95 leading-relaxed flex-1 mb-4 italic">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <div
                    className={`size-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center font-bold text-black text-sm shrink-0`}
                  >
                    {t.avatar}
                  </div>
                  <div className="leading-tight">
                    <div className="font-semibold text-sm text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#3da5e0] hover:underline"
            >
              <Send className="size-3.5" />
              Telegram kanalında daha fazla yorum + canlı topluluk
            </Link>
          </div>
        </div>
      </section>

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
                title: "USDT BEP-20 gönder",
                desc:
                  "Davet kodu sayfasında cüzdan adresi gösterilir. Binance/OKX'ten BEP-20 ağı ile $25 USDT yolla. Telegram'a yazmana gerek yok.",
              },
              {
                num: "02",
                title: "TX hash'i yapıştır → kod anında gelsin",
                desc:
                  "Transfer onaylandıktan sonra TX hash'i sayfaya yapıştır. Sistem BscScan üzerinden 30 sn içinde otomatik doğrular ve davet kodun ekranda çıkar.",
              },
              {
                num: "03",
                title: "Hesabını aç & 30 gün takip",
                desc:
                  "Kullanıcı adı + parola + davet kodu. Tek cihaza bağlı, e-posta/telefon istemiyoruz. Sinyaller, sentiment, Telegram bildirimleri açılır.",
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

      {/* Fiyat — 2 plan kartı */}
      <section id="fiyat" className="py-20 px-4 md:px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              İhtiyacına göre seç
            </h2>
            <p className="text-muted-foreground mt-2">
              Sinyal tek başına ya da Eğitim Seti ile birlikte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sinyal Paketi $25 */}
            <div className="relative rounded-2xl border-2 border-border/60 bg-gradient-to-br from-muted/20 to-transparent p-7 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <NexoraLogo className="size-8" />
                </div>
                <div>
                  <div className="font-bold text-lg">Sinyal Paketi</div>
                  <div className="text-xs text-muted-foreground">
                    Tek cihaz · 30 gün
                  </div>
                </div>
              </div>

              <div className="my-5 flex items-baseline gap-2">
                <span className="text-5xl font-bold">$25</span>
                <span className="text-muted-foreground">/ ay</span>
              </div>

              <ul className="space-y-2.5 text-sm mb-6">
                {[
                  "BIST100 + ABD radarları",
                  "AI hisse sinyalleri (BUY/SELL/HOLD)",
                  "Resmi açıklama özetleri",
                  "Telegram anlık bildirim",
                  "2 saatte bir güncel veri",
                  "30 gün kesintisiz",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/satin-al?plan=signal"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-400 font-semibold px-6 py-3 transition-colors"
              >
                Sinyal — $25 al
              </Link>
            </div>

            {/* Sinyal + Eğitim Paketi $40 (POPULAR) */}
            <div className="relative rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent p-7 shadow-xl shadow-emerald-500/15">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-black text-[11px] font-bold tracking-wide">
                EN POPÜLER · TASARRUFLU
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div>
                  <div className="font-bold text-lg">
                    Sinyal <span className="text-emerald-400">+</span> Eğitim Seti
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tek cihaz · 30 gün · 12 ders dahil
                  </div>
                </div>
              </div>

              <div className="my-5 flex items-baseline gap-2">
                <span className="text-5xl font-bold text-emerald-400">$40</span>
                <span className="text-muted-foreground">/ ay</span>
                <span className="ml-auto text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-1">
                  $10 tasarruf
                </span>
              </div>

              <ul className="space-y-2.5 text-sm mb-6">
                <li className="flex items-start gap-2 text-emerald-300">
                  <Check className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="font-medium">Sinyal Paketi içeriğinin tamamı</span>
                </li>
                {[
                  "12 kapsamlı ders (TA + bilanço + risk)",
                  "Mum okuma, EMA, RSI, MACD, sentiment",
                  "BIST temelleri + bilanço okuma rehberi",
                  "Hisse seçim stratejileri (değer/büyüme)",
                  "Kripto döngüleri + on-chain temelleri",
                  "Risk yönetimi + trade psikolojisi",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/satin-al?plan=education"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 transition-colors"
              >
                <Sparkles className="size-4" />
                Eğitim + Sinyal — $40 al
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Davet kodum var → hesap aç
            </Link>
            <p className="text-xs text-muted-foreground mt-2">
              Otomatik onay · 30 sn içinde kod ekranda · İade yok
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
                a: "/satin-al sayfasına git, $25 USDT'yi BEP-20 ağı üzerinden gönder, TX hash'i yapıştır. Sistem 30 sn içinde otomatik doğrular ve kodun ekranda çıkar. Telegram'a yazmana gerek yok.",
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
              href="/satin-al"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 transition-colors"
            >
              <Sparkles className="size-4" /> Davet kodu al
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-border hover:bg-accent text-foreground px-6 py-3 transition-colors"
            >
              <Lock className="size-4" /> Hesabım var
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <NexoraLogo className="size-6" withRing={false} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                <span className="text-emerald-400">N</span>EXORA
              </div>
              <div className="text-[8px] text-muted-foreground tracking-[0.2em] uppercase">
                BIST · NASDAQ · CRYPTO
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground flex-wrap">
            <Link href="/performans" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
              📈 Geçmiş Performans
            </Link>
            <Link href="/iletisim" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
              📬 İletişim
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Kullanım Şartları
            </Link>
            <Link href="/kvkk" className="hover:text-foreground transition-colors">
              KVKK
            </Link>
            <a
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <Send className="size-3" /> {TELEGRAM_CHANNEL_DISPLAY}
            </a>
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <XIcon className="size-3" /> @{TWITTER_USERNAME}
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 text-center text-[11px] text-muted-foreground/70">
          ⚠️ Yatırım tavsiyesi değildir. SPK mevzuatı kapsamında yatırım
          danışmanlığı hizmeti sunulmamaktadır. © 2026 Nexora.
        </div>
      </footer>
    </div>
  );
}
