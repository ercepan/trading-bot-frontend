"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Sparkles,
  XCircle,
  AlertTriangle,
  GraduationCap,
  Check,
} from "lucide-react";
import { authApi, type PaymentInfo, type PaymentPlan } from "@/lib/auth";
import { NexoraLogo } from "@/components/nexora-logo";
import {
  TELEGRAM_CHANNEL_URL,
  TELEGRAM_CHANNEL_DISPLAY,
  TWITTER_URL,
  TWITTER_USERNAME,
} from "@/lib/config";
import { XIcon } from "@/components/x-icon";
import {
  getStoredReferralCode,
  checkReferralCode,
  clearReferralCode,
  type ReferralCheck,
} from "@/lib/referral";
import { API_BASE } from "@/lib/api";

function SatinAlInner() {
  const searchParams = useSearchParams();
  const planParam = (searchParams.get("plan") as "signal" | "education") || "signal";

  const [info, setInfo] = useState<PaymentInfo | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"signal" | "education">(planParam);
  const [txHash, setTxHash] = useState("");
  const [contact, setContact] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState<{
    code: string;
    amount: number;
    plan_name?: string;
    is_premium?: boolean;
    ref_applied?: boolean;
    ref_username?: string | null;
  } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState<"address" | "code" | null>(null);

  // Referral durumu
  const [refCode, setRefCode] = useState<string | null>(null);
  const [refCheck, setRefCheck] = useState<ReferralCheck | null>(null);

  useEffect(() => {
    authApi.paymentPublicInfo().then(setInfo).catch(() => {});

    // Cookie'deki referral kodu yakla → backend'de doğrula
    const stored = getStoredReferralCode();
    if (stored) {
      setRefCode(stored);
      checkReferralCode(stored).then((res) => {
        setRefCheck(res);
        if (!res.valid) {
          // Geçersiz kod → cookie temizle
          clearReferralCode();
          setRefCode(null);
        }
      });
    }
  }, []);

  // Plans listesi (backend'den geliyorsa onu, yoksa default static)
  const plans: PaymentPlan[] = useMemo(() => {
    if (info?.plans && info.plans.length > 0) return info.plans;
    return [
      {
        id: "signal",
        name: "Sinyal Paketi",
        price_usd: 25,
        min_usd: 24.5,
        duration_days: 30,
        is_premium: false,
        description: "BIST + ABD radar + sinyaller",
      },
      {
        id: "education",
        name: "Sinyal + Eğitim Seti",
        price_usd: 40,
        min_usd: 39.5,
        duration_days: 30,
        is_premium: true,
        description: "12 ders + sinyaller",
      },
    ];
  }, [info]);

  const selectedPlanData = plans.find((p) => p.id === selectedPlan) || plans[0];

  // Referral indirim hesabı
  const hasValidRef = !!(refCode && refCheck?.valid);
  const discountPct = hasValidRef ? (refCheck?.discount_pct ?? 20) : 0;
  const discountedPrice = hasValidRef
    ? Math.round(selectedPlanData.price_usd * (1 - discountPct / 100) * 100) / 100
    : selectedPlanData.price_usd;
  const discountedMin = hasValidRef
    ? Math.round((selectedPlanData.price_usd * (1 - discountPct / 100) - 0.5) * 100) / 100
    : selectedPlanData.min_usd;

  const copy = async (text: string, kind: "address" | "code") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2500);
    } catch {}
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) {
      setErr("TX hash gerekli");
      return;
    }
    setErr(null);
    setVerifying(true);
    try {
      // ref_code'ı backend'e yolla — direct fetch (lib/auth.ts'in eski signature ile uyumlu kalmak için)
      const res = await fetch(`${API_BASE}/api/payments/buy-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tx_hash: txHash.trim(),
          contact: contact.trim(),
          ref_code: hasValidRef ? refCode : "",
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        let msg = `${res.status}`;
        try {
          const j = JSON.parse(txt);
          msg = j.detail || j.error || msg;
        } catch {}
        throw new Error(msg);
      }
      const r = await res.json();
      setSuccess({
        code: r.code,
        amount: r.amount_usd,
        plan_name: r.plan_name,
        is_premium: r.is_premium,
        ref_applied: r.ref_applied,
        ref_username: r.ref_username,
      });
      setTxHash("");
      setContact("");
      // Başarılı satın alma sonrası ref cookie'sini temizle (kullanılmış)
      if (hasValidRef) clearReferralCode();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Doğrulama başarısız");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/85 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <NexoraLogo className="size-8" />
            </div>
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-base">
                <span className="text-emerald-400">N</span>EXORA
              </div>
              <div className="text-[8px] text-muted-foreground tracking-[0.25em] uppercase">
                BIST · NASDAQ · CRYPTO
              </div>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="size-4" /> Ana sayfa
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="size-7 text-emerald-400" /> Davet Kodu Satın Al
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Hesap açmadan, Telegram'a yazmadan — sadece USDT BEP-20 ile öde, kodun anında
            ekranda çıksın. Sonra hesabını açıp 30 gün boyunca panele erişirsin.
          </p>
        </div>

        {/* Referral indirim banner */}
        {hasValidRef && refCheck?.referrer_username && !success && (
          <div className="rounded-xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-4 flex items-start gap-3">
            <div className="size-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shrink-0">
              🎁
            </div>
            <div className="flex-1">
              <div className="font-bold text-emerald-400 text-sm">
                Referans indirimi aktif — %{discountPct}
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-mono text-emerald-300">{refCode}</span> ·{" "}
                <span className="text-foreground">{refCheck.referrer_username}</span> sayesinde
                indirimli ödeme yapabilirsin.
              </div>
            </div>
            <button
              onClick={() => {
                clearReferralCode();
                setRefCode(null);
                setRefCheck(null);
              }}
              className="text-[10px] text-muted-foreground hover:text-foreground"
              title="İndirim kaldır"
            >
              ✕
            </button>
          </div>
        )}

        {/* Step 0: Plan Seçimi */}
        {!success && (
          <section className="rounded-xl border border-border bg-card/30 p-5 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-emerald-400">①</span>
              <div>
                <h2 className="font-semibold text-lg">Paketi seç</h2>
                <p className="text-xs text-muted-foreground">
                  Gönderdiğin tutara göre paket otomatik belirlenir.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plans.map((plan) => {
                const active = selectedPlan === plan.id;
                const Icon = plan.is_premium ? GraduationCap : ShieldCheck;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id as "signal" | "education")}
                    className={`text-left rounded-lg border-2 p-4 transition-all ${
                      active
                        ? "border-emerald-500/60 bg-emerald-500/10 shadow-md shadow-emerald-500/10"
                        : "border-border/60 hover:border-emerald-500/30 bg-background"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`size-5 ${
                            active ? "text-emerald-400" : "text-muted-foreground"
                          }`}
                        />
                        <span className="font-semibold text-sm">{plan.name}</span>
                      </div>
                      {plan.is_premium && (
                        <span className="text-[9px] uppercase tracking-wide bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded px-1.5 py-0.5 font-bold">
                          Popüler
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-baseline gap-1 flex-wrap">
                      {hasValidRef ? (
                        <>
                          <span className="text-xl font-bold text-muted-foreground line-through">
                            ${plan.price_usd}
                          </span>
                          <span
                            className={`text-3xl font-bold ${
                              active ? "text-emerald-400" : "text-emerald-300"
                            }`}
                          >
                            ${Math.round(plan.price_usd * (1 - discountPct / 100) * 100) / 100}
                          </span>
                        </>
                      ) : (
                        <span
                          className={`text-3xl font-bold ${
                            active ? "text-emerald-400" : ""
                          }`}
                        >
                          ${plan.price_usd}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">/ay</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      {plan.description}
                    </p>
                    {active && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400">
                        <Check className="size-3" />
                        Seçili
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Karşılaştırma chip'leri */}
            <div className="rounded-lg border border-border/40 bg-background/50 p-3 text-xs space-y-1.5">
              <div className="font-medium text-foreground/80 mb-1">İçerik karşılaştırması:</div>
              <div className="flex items-center gap-2">
                <Check className="size-3 text-emerald-400 shrink-0" />
                <span className="text-muted-foreground">
                  Sinyal Paketi → BIST + ABD radar + sinyaller (her 2 saatte taze)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-3 text-emerald-400 shrink-0" />
                <span className="text-muted-foreground">
                  Eğitim Seti → Sinyal + 12 ders (TA, bilanço, kripto, risk yönetimi){" "}
                  <span className="text-emerald-400 font-medium">$15 daha fazla, $25 değer</span>
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-6 space-y-4 shadow-lg shadow-emerald-500/10">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-6 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-emerald-400">
                  Ödeme onaylandı 🎉
                </h3>
                <p className="text-sm text-muted-foreground">
                  {success.amount.toFixed(2)} USDT alındı.
                  {success.plan_name && (
                    <>
                      {" "}
                      Paket:{" "}
                      <span
                        className={`font-medium ${
                          success.is_premium ? "text-emerald-400" : "text-foreground"
                        }`}
                      >
                        {success.plan_name}
                      </span>
                      {success.is_premium && " 🎓"}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="rounded-lg border-2 border-emerald-500/30 bg-background p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                🎫 Davet Kodun
              </div>
              <div className="flex items-center justify-between gap-3">
                <code className="font-mono font-bold text-2xl text-emerald-400 tracking-wider select-all">
                  {success.code}
                </code>
                <button
                  onClick={() => copy(success.code, "code")}
                  className="shrink-0 inline-flex items-center gap-1.5 text-sm rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 transition-colors"
                >
                  {copied === "code" ? (
                    <>
                      <CheckCircle2 className="size-4" /> Kopyalandı
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" /> Kopyala
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-100">
              <strong>⚠️ Önemli:</strong> Bu kodu güvenli bir yere kaydet. Tek-kullanımlık
              ve 30 gün içinde kullanılmazsa iptal olur.
            </div>
            <Link
              href={`/auth/signup?code=${success.code}`}
              className="block w-full text-center rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-3 text-base transition-colors"
            >
              Hesap aç ve panele gir <ArrowRight className="size-4 inline ml-1" />
            </Link>
          </div>
        )}

        {/* Sistem konfigürasyonu */}
        {info && !info.configured && (
          <div className="rounded-md border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
            ⚠️ Ödeme sistemi henüz aktif değil. Lütfen birkaç dakika sonra tekrar dene.
          </div>
        )}

        {/* Step 1: Adres */}
        {info?.configured && !success && (
          <section className="rounded-xl border border-border bg-card/30 p-5 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-emerald-400">②</span>
              <div>
                <h2 className="font-semibold text-lg">USDT (BEP-20) gönder</h2>
                <p className="text-xs text-muted-foreground">
                  Ağ <strong className="text-foreground">BNB Smart Chain (BEP-20)</strong>{" "}
                  · Token <strong className="text-foreground">USDT</strong> · Tutar{" "}
                  {hasValidRef ? (
                    <>
                      <strong className="text-muted-foreground line-through">
                        ${selectedPlanData.price_usd}
                      </strong>{" "}
                      <strong className="text-emerald-400">${discountedPrice}</strong>{" "}
                      <span className="text-emerald-400">(referans %{discountPct} indirimli)</span>
                    </>
                  ) : (
                    <strong className="text-emerald-400">
                      ${selectedPlanData.price_usd}
                    </strong>
                  )}{" "}
                  ({selectedPlanData.name})
                </p>
              </div>
            </div>

            <div className="rounded-lg border-2 border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                Cüzdan adresi
              </div>
              <div className="flex items-center justify-between gap-3">
                <code className="font-mono text-sm break-all flex-1 select-all">
                  {info.address}
                </code>
                <button
                  onClick={() => copy(info.address, "address")}
                  className={`shrink-0 inline-flex items-center gap-1 text-xs rounded-md px-3 py-2 transition-colors ${
                    copied === "address"
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                      : "bg-emerald-500 hover:bg-emerald-600 text-black font-medium"
                  }`}
                >
                  {copied === "address" ? (
                    <>
                      <CheckCircle2 className="size-3" /> Kopyalandı
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" /> Kopyala
                    </>
                  )}
                </button>
              </div>
              <a
                href={`https://bscscan.com/address/${info.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-muted-foreground hover:text-foreground underline inline-flex items-center gap-1 mt-2"
              >
                BscScan'de gör <ExternalLink className="size-2.5" />
              </a>
            </div>

            <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-xs space-y-1.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-3.5 text-amber-400 mt-0.5 shrink-0" />
                <div className="space-y-1 text-foreground/80">
                  <div>
                    <strong className="text-amber-400">Mutlaka BEP-20 (BSC)</strong> ağı
                    seç. TRC20 / ERC20 yanlış ağdır → para kaybolur, geri dönmez.
                  </div>
                  <div>
                    Borsadan: Binance / OKX / Bybit / KuCoin → Para Çek → USDT → BEP20.
                  </div>
                  <div>
                    En az ${discountedMin.toFixed(2)} USDT gönder (komisyon hariç
                    net miktar).{" "}
                    {hasValidRef ? (
                      <span className="text-emerald-300">
                        ✓ Referans indirimi uygulandı, eski $25 yerine ${discountedPrice} yetiyor.
                      </span>
                    ) : (
                      <span className="text-amber-300">$40 üstü = Eğitim Seti otomatik dahil.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: TX hash */}
        {!success && (
          <section className="rounded-xl border border-border bg-card/30 p-5">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-emerald-400">③</span>
              <div>
                <h2 className="font-semibold text-lg">TX hash ile doğrula → kod al</h2>
                <p className="text-xs text-muted-foreground">
                  Transfer onaylanınca BscScan'de görünen hash'i yapıştır.
                </p>
              </div>
            </div>

            <details className="rounded-md border border-blue-500/20 bg-blue-500/5 mb-4">
              <summary className="cursor-pointer p-3 text-xs font-medium text-blue-300 flex items-center gap-2">
                💡 TX hash nereden bulunur?
              </summary>
              <div className="px-3 pb-3 text-xs text-muted-foreground space-y-2 leading-relaxed">
                <div>
                  <strong className="text-foreground">Binance:</strong> Cüzdan → Spot →
                  İşlem Geçmişi → "Para Çek" sekmesi → ilgili işlem →{" "}
                  <strong>TxID</strong> kopyala
                </div>
                <div>
                  <strong className="text-foreground">OKX / Bybit / KuCoin:</strong> Çekme
                  Geçmişi → işleme tıkla → <strong>"View on Blockchain"</strong> veya
                  <strong> "TX Hash"</strong>
                </div>
                <div>
                  <strong className="text-foreground">MetaMask / Trust Wallet:</strong>{" "}
                  Activity → işleme bas → "View on BscScan" → adres çubuğundaki TX hash
                </div>
              </div>
            </details>

            <form onSubmit={onVerify} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Transaction Hash
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="0xabcdef0123456789..."
                  disabled={verifying}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <p className="text-[11px] text-muted-foreground">
                  {txHash.startsWith("0x") && txHash.length === 66 ? (
                    <a
                      href={`https://bscscan.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-emerald-400 inline-flex items-center gap-1"
                    >
                      bscscan'de bu TX'i aç <ExternalLink className="size-2.5" />
                    </a>
                  ) : (
                    "0x ile başlayan 66 karakter (32 byte hex)"
                  )}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  İletişim (opsiyonel)
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Telegram: @kullaniciadin · veya email · veya boş bırak"
                  disabled={verifying}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <p className="text-[11px] text-muted-foreground">
                  Sadece sorun olursa sana ulaşmamız için. Zorunlu değil — kod ekranda
                  çıkar.
                </p>
              </div>

              {err && (
                <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-400 flex items-start gap-2">
                  <XCircle className="size-3.5 mt-0.5 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={verifying || !txHash.trim() || !info?.configured}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-3 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> BscScan kontrol ediliyor…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4" /> Doğrula ve davet kodumu üret
                  </>
                )}
              </button>
            </form>
          </section>
        )}

        {/* Step 4: Sonra ne olacak */}
        {!success && (
          <section className="rounded-xl border border-border bg-card/30 p-5">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-3xl font-bold text-emerald-400">④</span>
              <div>
                <h2 className="font-semibold text-lg">Hesap aç</h2>
                <p className="text-xs text-muted-foreground">
                  Kodun hazır olduğunda{" "}
                  <Link href="/auth/signup" className="underline">
                    buradan
                  </Link>{" "}
                  hesap aç. Kullanıcı adı + parola + bu davet kodu = 30 gün erişim.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Sosyal medya CTA'ları — Telegram + X */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href={TELEGRAM_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-[#0088cc]/30 bg-[#0088cc]/5 hover:bg-[#0088cc]/10 p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[#0088cc]/15 border border-[#0088cc]/40 flex items-center justify-center text-[#3da5e0]">
                <ExternalLink className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-foreground">
                  Telegram Kanalı
                </div>
                <div className="text-xs text-muted-foreground">
                  Günlük sinyal özetleri · {TELEGRAM_CHANNEL_DISPLAY}
                </div>
              </div>
              <span className="text-xs text-[#3da5e0]">Katıl →</span>
            </div>
          </a>

          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/10 p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <XIcon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-foreground">
                  X (Twitter)
                </div>
                <div className="text-xs text-muted-foreground">
                  Anlık piyasa yorumları · @{TWITTER_USERNAME}
                </div>
              </div>
              <span className="text-xs text-white/70">Takip →</span>
            </div>
          </a>
        </div>

        <div className="text-center text-xs text-muted-foreground py-4">
          Sorunla karşılaşırsan{" "}
          <a
            href={TELEGRAM_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Telegram'dan ulaş
          </a>
          .
        </div>
      </main>
    </div>
  );
}

export default function SatinAlPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Yükleniyor…</div>}>
      <SatinAlInner />
    </Suspense>
  );
}
