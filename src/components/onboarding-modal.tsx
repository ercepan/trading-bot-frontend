"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import {
  Sparkles,
  Globe,
  Zap,
  Send,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
} from "lucide-react";
import { TELEGRAM_CHANNEL_URL, TELEGRAM_CHANNEL_DISPLAY } from "@/lib/config";

const STORAGE_KEY = "nexora-onboarding-completed-v1";

type Step = {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  body: React.ReactNode;
  cta?: { label: string; href: string; external?: boolean };
};

const STEPS: Step[] = [
  {
    icon: Sparkles,
    iconColor: "text-emerald-400",
    title: "Nexora'ya hoş geldin 🎉",
    body: (
      <>
        Aboneliğin aktif. Şimdi sana hızlıca <strong>3 dakikalık</strong>{" "}
        bir tur atalım — neyi nerede bulacağını görelim.
      </>
    ),
  },
  {
    icon: Globe,
    iconColor: "text-emerald-400",
    title: "BIST + ABD + Kripto Radar",
    body: (
      <>
        Her gün AI destekli <strong>sentiment skoru</strong> ile takip ettiğin
        hisseleri sıralayan radar. Yeşil = pozitif sentiment, kırmızı = negatif.
        Tıklayınca detaylar + gerçek fiyat grafiği açılır.
      </>
    ),
    cta: { label: "BIST Radar'ı aç", href: "/bist" },
  },
  {
    icon: Zap,
    iconColor: "text-amber-400",
    title: "Hisse Sinyalleri",
    body: (
      <>
        Radar tarafından üretilen <strong>somut alım/satım sinyalleri</strong>:
        giriş bandı, stop-loss, hedef + risk/ödül oranı. Geçmiş sinyallerin
        gerçek track record'unu <Link href="/performans" className="text-emerald-400 underline">/performans</Link> sayfasında görebilirsin.
      </>
    ),
    cta: { label: "Sinyalleri gör", href: "/signals" },
  },
  {
    icon: Send,
    iconColor: "text-[#3da5e0]",
    title: "Telegram Kanalı",
    body: (
      <>
        Anlık bildirimler için Telegram özel kanalına katıl.
        Yeni sinyaller, sıcak haberler, Q&A — hepsi orada.
      </>
    ),
    cta: { label: `${TELEGRAM_CHANNEL_DISPLAY} kanalına katıl`, href: TELEGRAM_CHANNEL_URL, external: true },
  },
  {
    icon: GraduationCap,
    iconColor: "text-purple-400",
    title: "Eğitim Modülleri",
    body: (
      <>
        12 ders + 9 SVG diyagram. Teknik analiz, risk yönetimi, BIST
        özellikleri, kripto döngüleri, trader psikolojisi.
        <br />
        <em className="text-muted-foreground text-xs">Premium plana özel.</em>
      </>
    ),
    cta: { label: "Eğitim setine git", href: "/egitim" },
  },
];

export function OnboardingModal() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen && user && user.role === "subscriber") {
      // Yeni subscriber → onboarding göster
      setOpen(true);
    }
  }, [user]);

  if (!hydrated || !open || !user || user.role !== "subscriber") return null;

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setOpen(false);
  };

  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const cur = STEPS[step];
  const Icon = cur.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  i === step ? "bg-emerald-500" : i < step ? "bg-emerald-500/40" : "bg-border"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleClose}
            className="size-7 inline-flex items-center justify-center rounded-md hover:bg-muted/50 text-muted-foreground"
            aria-label="Kapat"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 min-h-[280px]">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Icon className={`size-6 ${cur.iconColor}`} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">{cur.title}</h2>
          </div>

          <div className="text-sm text-muted-foreground leading-relaxed pt-2">
            {cur.body}
          </div>

          {cur.cta && (
            <div>
              {cur.cta.external ? (
                <a
                  href={cur.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:underline"
                >
                  {cur.cta.label} →
                </a>
              ) : (
                <Link
                  href={cur.cta.href}
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:underline"
                >
                  {cur.cta.label} →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border/50">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={isFirst}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="size-3.5" />
            Önceki
          </button>

          <div className="text-xs text-muted-foreground">
            {step + 1} / {STEPS.length}
          </div>

          {!isLast ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-1.5 text-sm transition-colors"
            >
              Sonraki
              <ArrowRight className="size-3.5" />
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-1.5 text-sm transition-colors"
            >
              <CheckCircle2 className="size-3.5" />
              Bitir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
