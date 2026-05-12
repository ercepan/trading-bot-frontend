"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";
import { NexoraLogo } from "@/components/nexora-logo";
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

  // Referral
  const [refCode, setRefCode] = useState<string | null>(null);
  const [refCheck, setRefCheck] = useState<ReferralCheck | null>(null);

  useEffect(() => {
    // Plans
    fetch(`${API_BASE}/api/billing/shopier/plans`)
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []))
      .catch(() => setPlans([]));

    // Ref code (URL ya da cookie)
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

    if (!email.trim() || !email.includes("@")) {
      setErr("Geçerli bir email adresi gir");
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
      // Redirect to Shopier
      window.location.href = data.checkout_url;
    } catch (e) {
      setErr(String(e));
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 backdrop-blur sticky top-0 bg-black/80 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <NexoraLogo className="size-8" />
            <div>
              <div className="font-bold text-white tracking-tight">NEXORA</div>
              <div className="text-[10px] text-emerald-400 font-mono tracking-widest">
                ₺ TÜRK LİRASI ÖDEMESİ
              </div>
            </div>
          </Link>
          <Link
            href="/satin-al"
            className="text-xs text-white/60 hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="size-3" /> USDT ile öde
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <ShieldCheck className="size-3" /> Shopier güvenli ödeme
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Türk Lirası ile öde
          </h1>
          <p className="text-white/60 text-sm max-w-2xl mx-auto">
            Kredi kartı · banka kartı · havale — Shopier'ın güvenli altyapısı üzerinden.
            Ödeme onaylanır onaylanmaz davet kodun email'ine gelir.
          </p>
        </div>

        {/* Plan picker */}
        {!plans ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 text-white/40 animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-300">
            <AlertTriangle className="size-4 inline mr-2" />
            Shopier ödemesi henüz yapılandırılmadı. USDT ile ödemek için{" "}
            <Link href="/satin-al" className="underline">/satin-al</Link>'a git.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {plans.map((p) => {
                const isSel = selectedPlan === p.id;
                const finalTry = hasValidRef ? p.price_with_ref_try : p.price_try;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`text-left rounded-xl border p-5 transition-all ${
                      isSel
                        ? "border-emerald-400 bg-emerald-500/10 ring-2 ring-emerald-400/40"
                        : "border-white/10 bg-white/5 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {p.is_premium ? (
                          <GraduationCap className="size-5 text-emerald-300" />
                        ) : (
                          <Sparkles className="size-5 text-emerald-300" />
                        )}
                        <span className="font-semibold text-white">{p.name}</span>
                      </div>
                      {isSel && <CheckCircle2 className="size-5 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-white/60 mb-3">{p.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-white">
                        ₺{finalTry.toLocaleString("tr-TR")}
                      </span>
                      <span className="text-xs text-white/40">/ {p.duration_days} gün</span>
                    </div>
                    {hasValidRef && finalTry < p.price_try && (
                      <div className="mt-2 text-[11px] text-emerald-400">
                        Normal ₺{p.price_try.toLocaleString("tr-TR")} ·
                        Referans %{p.discount_referral_pct} indirimli
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Email + Ref + Buy */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-2">
                  E-posta adresin <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full rounded-lg bg-black/40 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-emerald-400"
                />
                <p className="mt-1 text-[11px] text-white/40">
                  Davet kodu bu adrese yollanacak. Hesabını bu emaille açacaksın.
                </p>
              </div>

              {hasValidRef && (
                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
                  <div className="text-emerald-300">
                    🎁 <b>Referans kodu uygulandı:</b> {refCode}
                  </div>
                  <div className="text-emerald-400/70 mt-1">
                    %{currentPlan?.discount_referral_pct} indirim aktif.{" "}
                    {refCheck?.referrer_username && (
                      <span>Davet eden: @{refCheck.referrer_username}</span>
                    )}
                  </div>
                </div>
              )}

              {err && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  {err}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={creating || !email.trim()}
                className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:cursor-not-allowed text-black font-semibold py-3.5 flex items-center justify-center gap-2 transition-colors"
              >
                {creating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Shopier'a yönlendiriliyor...
                  </>
                ) : (
                  <>
                    ₺{finalPriceTry.toLocaleString("tr-TR")} ile öde
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 text-[11px] text-white/40 justify-center flex-wrap">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3" /> 256-bit SSL
                </span>
                <span>•</span>
                <span>3D Secure</span>
                <span>•</span>
                <span>Shopier altyapısı</span>
                <span>•</span>
                <span>Tek seferlik ödeme — otomatik yenileme yok</span>
              </div>
            </div>

            {/* SSS */}
            <details className="rounded-xl border border-white/10 bg-white/5 p-5">
              <summary className="font-semibold text-white cursor-pointer">
                Sık sorulanlar
              </summary>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <div>
                  <div className="text-white font-medium">Ödememi nasıl yapıyorum?</div>
                  Bu sayfada paketini seç, email'ini gir, "Öde" butonuna bas. Shopier'ın
                  güvenli ödeme sayfasına yönlendirileceksin. Kredi/banka kartınla veya
                  havale ile ödeyebilirsin.
                </div>
                <div>
                  <div className="text-white font-medium">Davet kodumu nasıl alacağım?</div>
                  Ödeme onaylanır onaylanmaz davet kodu email adresine yollanır. Aynı
                  zamanda Shopier'dan geri yönlendirildiğin ekranda da göreceksin.
                </div>
                <div>
                  <div className="text-white font-medium">Otomatik yenileme var mı?</div>
                  <b>Hayır.</b> 30 günlük tek seferlik ödeme. Süre bitince istersen tekrar
                  öder uzatırsın. Kartını saklamıyoruz, otomatik çekim yok.
                </div>
                <div>
                  <div className="text-white font-medium">İade politikası?</div>
                  Davet kodu kullanılmadıysa ve ödemeden sonra 24 saat içindeysen iade
                  talebini iletisim@nexora-trading.net'e yaz. Kullanılmış kodlar için iade
                  yapılamıyor (servis sunulmuş kabul edilir).
                </div>
              </div>
            </details>
          </>
        )}
      </main>
    </div>
  );
}

export default function OdemePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <Loader2 className="size-6 text-white/40 animate-spin" />
        </div>
      }
    >
      <OdemeInner />
    </Suspense>
  );
}
