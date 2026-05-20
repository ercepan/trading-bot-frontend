"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import {
  getStoredReferralCode,
  storeReferralCode,
  checkReferralCode,
  clearReferralCode,
  type ReferralCheck,
} from "@/lib/referral";

type ShopierPlan = {
  id: "signal" | "training";
  name: string;
  price_try: number;
  duration_days: number;
  is_premium: boolean;
  description: string;
  discount_referral_pct: number;
  price_with_ref_try: number;
};

function OdemeInner() {
  const searchParams = useSearchParams();
  const planParam = (searchParams.get("plan") as "signal" | "training") || "signal";

  const [plans, setPlans] = useState<ShopierPlan[] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"signal" | "training">(planParam);
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [refCode, setRefCode] = useState<string | null>(null);
  const [refCheck, setRefCheck] = useState<ReferralCheck | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/billing/shopier/plans`)
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []))
      .catch(() => setPlans([]));

    const urlRef = searchParams.get("ref");
    let codeToCheck: string | null = null;
    if (urlRef) {
      storeReferralCode(urlRef);
      codeToCheck = urlRef.toUpperCase();
    } else {
      codeToCheck = getStoredReferralCode();
    }
    if (codeToCheck) {
      setRefCode(codeToCheck);
      checkReferralCode(codeToCheck).then((res) => {
        setRefCheck(res);
        if (!res.valid) {
          clearReferralCode();
          setRefCode(null);
        }
      });
    }
  }, [searchParams]);

  const currentPlan = plans?.find((p) => p.id === selectedPlan);
  const hasValidRef = refCheck?.valid && refCode;
  const finalPriceTry = hasValidRef && currentPlan
    ? currentPlan.price_with_ref_try
    : currentPlan?.price_try ?? 0;

  async function handleCheckout() {
    setErr(null);
    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErr("Geçerli bir email adresi gir (örn: kullanici@domain.com)");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/api/billing/shopier/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: selectedPlan,
          email: email.trim().toLowerCase(),
          ref_code: hasValidRef ? refCode : null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkout_url) {
        setErr(data.detail || data.error || "Ödeme başlatılamadı");
        setCreating(false);
        return;
      }
      window.location.href = data.checkout_url;
    } catch (e) {
      setErr(String(e));
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
      {/* Background atmosphere */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full bg-emerald-500/[0.07] blur-[140px]" />
        <div className="absolute top-[55%] right-[2%] size-[420px] rounded-full bg-amber-500/[0.04] blur-[110px]" />
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

      {/* Editorial header */}
      <header className="relative z-10 border-b border-white/10 px-6 md:px-12 py-6 backdrop-blur sticky top-0 bg-[#050505]/80">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-10 rounded-md bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
              <span className="font-display text-emerald-400 text-2xl leading-none" style={{ fontStyle: "italic", fontWeight: 600 }}>
                N
              </span>
            </div>
            <div>
              <div className="font-display text-lg leading-none">Nexora</div>
              <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.25em] mt-1">
                ₺ Türk Lirası Ödemesi
              </div>
            </div>
          </Link>
          <Link
            href="/satin-al"
            className="font-mono text-[11px] text-white/55 hover:text-white uppercase tracking-[0.18em] inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-3" /> USDT ile öde
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20 space-y-14">
        {/* Hero — editorial */}
        <div className="space-y-7 max-w-3xl">
          <div className="nx-reveal flex items-center gap-3" style={{ animationDelay: "0.1s" }}>
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              01 / Shopier · Güvenli Ödeme
            </span>
          </div>

          <h1
            className="font-display nx-reveal font-medium tracking-tight"
            style={{
              animationDelay: "0.2s",
              fontSize: "clamp(2.5rem, 6.5vw, 5rem)",
              lineHeight: "0.97",
              letterSpacing: "-0.02em",
            }}
          >
            Türk Lirası ile{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              öde.
            </em>
          </h1>

          <p
            className="nx-reveal max-w-xl text-base md:text-lg leading-relaxed text-white/65 font-light"
            style={{ animationDelay: "0.35s" }}
          >
            Kredi/banka kartı veya havale — Shopier'ın güvenli altyapısı.
            Ödeme onaylanır onaylanmaz davet kodun email'ine gelir.
          </p>
        </div>

        {/* Plan picker + Form */}
        {!plans ? (
          <div className="flex items-center justify-center py-20 nx-reveal" style={{ animationDelay: "0.4s" }}>
            <Loader2 className="size-6 text-white/40 animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="nx-reveal border-l-2 border-amber-500/40 bg-amber-500/[0.04] pl-4 py-3 pr-4 text-sm text-amber-200/80" style={{ animationDelay: "0.4s" }}>
            <AlertTriangle className="size-4 inline mr-2" />
            Shopier ödemesi henüz yapılandırılmadı. USDT ile ödemek için{" "}
            <Link href="/satin-al" className="text-emerald-400 underline">/satin-al</Link>'a git.
          </div>
        ) : (
          <>
            {/* Plan cards — editorial terminal */}
            <div className="nx-reveal grid md:grid-cols-2 gap-4" style={{ animationDelay: "0.5s" }}>
              {plans.map((p) => {
                const isSel = selectedPlan === p.id;
                const finalTry = hasValidRef ? p.price_with_ref_try : p.price_try;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`text-left relative bg-black/40 backdrop-blur-sm p-6 transition-all ${
                      isSel
                        ? "border-2 border-emerald-400 shadow-[0_8px_60px_-12px_rgba(16,185,129,0.3)]"
                        : "border border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-9 rounded-md flex items-center justify-center ${
                          isSel ? "bg-emerald-500/20 border border-emerald-400/50" : "bg-white/[0.04] border border-white/10"
                        }`}>
                          {p.is_premium ? (
                            <GraduationCap className="size-4 text-emerald-300" />
                          ) : (
                            <Sparkles className="size-4 text-emerald-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-display text-base leading-none">{p.name}</div>
                          <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em] mt-1.5">
                            {p.duration_days} Gün
                          </div>
                        </div>
                      </div>
                      {isSel && <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />}
                    </div>

                    <p className="text-xs text-white/55 mb-4 leading-relaxed">{p.description}</p>

                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl font-medium tracking-tight">
                        ₺{finalTry.toLocaleString("tr-TR")}
                      </span>
                      {hasValidRef && finalTry < p.price_try && (
                        <span className="font-mono text-xs text-white/35 line-through">
                          ₺{p.price_try.toLocaleString("tr-TR")}
                        </span>
                      )}
                    </div>

                    {hasValidRef && finalTry < p.price_try && (
                      <div className="mt-2 font-mono text-[10px] text-emerald-400 uppercase tracking-[0.18em]">
                        Referans · %{p.discount_referral_pct} indirim
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Email + Buy form */}
            <div
              className="nx-reveal bg-black/40 border border-white/10 backdrop-blur-sm p-7 md:p-9 space-y-6"
              style={{ animationDelay: "0.7s" }}
            >
              <div>
                <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2.5">
                  E-posta <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full bg-white/[0.02] border border-white/15 text-white text-base px-4 py-3.5 focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all"
                />
                <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.18em] mt-2">
                  Davet kodu bu adrese yollanır
                </p>
              </div>

              {hasValidRef && (
                <div className="border-l-2 border-emerald-500/50 bg-emerald-500/[0.04] pl-4 py-3 pr-3">
                  <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.2em] mb-1">
                    Referans Aktif
                  </div>
                  <div className="text-sm text-emerald-200/90">
                    <strong className="font-mono">{refCode}</strong> · %{currentPlan?.discount_referral_pct} indirim
                    {refCheck?.referrer_username && (
                      <span className="text-white/55"> · @{refCheck.referrer_username}</span>
                    )}
                  </div>
                </div>
              )}

              {err && (
                <div className="font-mono text-[11px] text-red-400 bg-red-500/[0.06] border border-red-500/30 px-4 py-2.5 uppercase tracking-wider">
                  {err}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={creating || !email.trim()}
                className="group w-full inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black px-6 py-4 text-base font-semibold transition-all"
              >
                {creating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Shopier'a yönlendiriliyor…
                  </>
                ) : (
                  <>
                    ₺{finalPriceTry.toLocaleString("tr-TR")} ile öde
                    <span className="font-mono text-xs opacity-60 group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              <div className="font-mono text-[10px] text-white/35 uppercase tracking-[0.18em] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 border-t border-white/5">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-3" /> 256-bit SSL
                </span>
                <span className="size-1 rounded-full bg-white/20" />
                <span>3D Secure</span>
                <span className="size-1 rounded-full bg-white/20" />
                <span>Shopier</span>
                <span className="size-1 rounded-full bg-white/20" />
                <span>Tek seferlik</span>
              </div>
            </div>

            {/* SSS — editorial */}
            <div className="nx-reveal max-w-3xl space-y-6 border-t border-white/10 pt-10" style={{ animationDelay: "0.9s" }}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-white/40 uppercase tracking-[0.28em]">
                  02 / Sık Sorulanlar
                </span>
              </div>

              <div className="space-y-5">
                {[
                  {
                    q: "Ödememi nasıl yapıyorum?",
                    a: "Bu sayfada paketini seç, email'ini gir, ödeme butonuna bas. Shopier'ın güvenli ödeme sayfasına yönlendirileceksin. Kredi/banka kartınla veya havale ile ödeyebilirsin.",
                  },
                  {
                    q: "Davet kodumu nasıl alacağım?",
                    a: "Ödeme onaylanır onaylanmaz davet kodu email adresine yollanır. Aynı zamanda Shopier'dan geri yönlendirildiğin ekranda da göreceksin.",
                  },
                  {
                    q: "Otomatik yenileme var mı?",
                    a: "Hayır. 30 günlük tek seferlik ödeme. Süre bitince istersen tekrar öder uzatırsın. Kartını saklamıyoruz, otomatik çekim yok.",
                  },
                  {
                    q: "İade politikası?",
                    a: "Davet kodu kullanılmadıysa ve ödemeden sonra 24 saat içindeysen iade talebini iletisim@nexora-trading.net'e yaz. Kullanılmış kodlar için iade yapılamıyor (servis sunulmuş kabul edilir).",
                  },
                ].map((item, i) => (
                  <div key={i} className="grid grid-cols-[auto_1fr] gap-5 border-b border-white/5 pb-5 last:border-0">
                    <span className="font-mono text-[11px] text-emerald-400/70 tabular-nums pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="space-y-2">
                      <div className="font-display text-base text-white">{item.q}</div>
                      <p className="text-sm text-white/55 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Bottom legal */}
      <div className="relative z-10 border-t border-white/5 py-5 px-6 text-center">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">
          ⚠ Yatırım tavsiyesi değildir · SPK lisansı kapsamı dışındadır
        </p>
      </div>
    </div>
  );
}

export default function OdemePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050505]">
          <Loader2 className="size-6 text-white/40 animate-spin" />
        </div>
      }
    >
      <OdemeInner />
    </Suspense>
  );
}
