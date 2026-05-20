"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Mail,
  Lock,
  KeyRound,
} from "lucide-react";
import { trialApi } from "@/lib/api";
import { setToken } from "@/lib/auth";

type Step = "form" | "verify" | "success";

export default function DenePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Verify state
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [verifyErr, setVerifyErr] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Success state
  const [successUsername, setSuccessUsername] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErr("Geçerli bir email adresi gir (örn: kullanici@domain.com)");
      return;
    }
    if (password.length < 6) {
      setErr("Parola en az 6 karakter olmalı");
      return;
    }
    if (!acceptedTerms) {
      setErr("Devam etmek için yasal uyarıları okuyup kabul etmen gerekir");
      return;
    }

    setLoading(true);
    try {
      let deviceId = "";
      try {
        deviceId = localStorage.getItem("nx_device_id") || "";
        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem("nx_device_id", deviceId);
        }
      } catch {}

      const res = await trialApi.signup(trimmed, password, deviceId);
      if (!res.ok) {
        setErr(res.error || "Bir hata oluştu");
        setLoading(false);
        return;
      }

      setStep("verify");
      setEmail(trimmed);
      setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }

  function handleCodeChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[idx] = digit;
    setCode(newCode);
    setVerifyErr(null);
    if (digit && idx < 5) {
      codeInputRefs.current[idx + 1]?.focus();
    }
  }

  function handleCodeKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      codeInputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      codeInputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowRight" && idx < 5) {
      codeInputRefs.current[idx + 1]?.focus();
    }
  }

  function handleCodePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 0) return;
    const newCode = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) newCode[i] = pasted[i];
    setCode(newCode);
    const lastFilled = Math.min(pasted.length, 6) - 1;
    codeInputRefs.current[Math.min(lastFilled + 1, 5)]?.focus();
  }

  async function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    setVerifyErr(null);
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setVerifyErr("6 haneli kodun tamamını gir");
      return;
    }
    setVerifyLoading(true);
    try {
      const res = await trialApi.verifyCode(email, fullCode);
      if (!res.ok || !res.token) {
        setVerifyErr(res.error || "Kod doğrulanamadı");
        setVerifyLoading(false);
        setCode(["", "", "", "", "", ""]);
        setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
        return;
      }
      setToken(res.token);
      setSuccessUsername(res.username || "");
      setStep("success");
      setTimeout(() => {
        window.location.href = "/bist";
      }, 1500);
    } catch (e) {
      setVerifyErr(e instanceof Error ? e.message : "Bağlantı hatası");
      setVerifyLoading(false);
    }
  }

  async function handleResendCode() {
    setResending(true);
    setResendMsg(null);
    setVerifyErr(null);
    try {
      const res = await trialApi.resendCode(email);
      if (res.ok) {
        setResendMsg("Yeni kod gönderildi. Email kutunu kontrol et.");
      } else {
        setResendMsg(res.error || "Kod gönderilemedi");
      }
    } finally {
      setResending(false);
    }
  }

  const submittedRef = useRef(false);
  useEffect(() => {
    if (code.every((d) => d) && !verifyLoading && !submittedRef.current) {
      submittedRef.current = true;
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleVerifySubmit(fakeEvent);
    }
    if (code.some((d) => !d)) {
      submittedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, verifyLoading]);

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
      <header className="relative z-10 border-b border-white/10 px-6 md:px-12 py-6">
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
                7 Gün · Ücretsiz
              </div>
            </div>
          </Link>
          <Link href="/auth" className="font-mono text-[11px] text-white/55 hover:text-white uppercase tracking-[0.2em] transition-colors">
            Giriş
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">

        {/* ───── SUCCESS ───── */}
        {step === "success" && (
          <div className="text-center py-16 space-y-8 max-w-2xl mx-auto">
            <div className="nx-reveal inline-flex items-center justify-center" style={{ animationDelay: "0.05s" }}>
              <div className="size-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_60px_-10px_rgba(16,185,129,0.5)]">
                <CheckCircle2 className="size-10 text-emerald-400" />
              </div>
            </div>

            <div className="nx-reveal space-y-3" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-center gap-3">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-[0.28em]">
                  03 / Hesap Aktif
                </span>
              </div>
              <h1
                className="font-display font-medium tracking-tight"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  lineHeight: "0.98",
                  letterSpacing: "-0.02em",
                }}
              >
                Hoş geldin,{" "}
                <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
                  {successUsername}.
                </em>
              </h1>
            </div>

            <p className="nx-reveal text-white/65 text-lg leading-relaxed" style={{ animationDelay: "0.4s" }}>
              Aboneliğin <strong className="text-white">7 gün</strong> aktif. BIST radarına yönlendiriliyorsun…
            </p>
            <Loader2 className="nx-reveal size-5 text-emerald-400 animate-spin mx-auto" style={{ animationDelay: "0.6s" }} />
          </div>
        )}

        {/* ───── VERIFY ───── */}
        {step === "verify" && (
          <div className="max-w-xl mx-auto space-y-10">
            <div className="nx-reveal space-y-5 text-center" style={{ animationDelay: "0.1s" }}>
              <div className="inline-flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
                  02 / Email Doğrulama
                </span>
              </div>
              <h1
                className="font-display font-medium tracking-tight"
                style={{
                  fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                  lineHeight: "1",
                  letterSpacing: "-0.02em",
                }}
              >
                Email'ini{" "}
                <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
                  doğrula.
                </em>
              </h1>
              <p className="text-white/55 leading-relaxed text-sm md:text-base">
                <strong className="text-white font-mono">{email}</strong> adresine 6 haneli kod gönderdik.
                <br className="hidden sm:inline" /> Kod <span className="font-mono text-amber-300">15 dakika</span> geçerli.
              </p>
            </div>

            <form
              onSubmit={handleVerifySubmit}
              className="nx-reveal space-y-6 bg-black/40 border border-white/10 backdrop-blur-sm p-7 md:p-9 shadow-[0_8px_60px_-12px_rgba(16,185,129,0.15)]"
              style={{ animationDelay: "0.3s" }}
            >
              <div>
                <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-3 text-center">
                  Doğrulama Kodu
                </label>
                <div className="flex items-center justify-center gap-2">
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { codeInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                      onPaste={handleCodePaste}
                      disabled={verifyLoading}
                      autoComplete="one-time-code"
                      className="font-mono w-12 h-16 md:w-14 md:h-18 text-center text-2xl md:text-3xl font-semibold bg-white/[0.02] border border-white/15 focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.06] focus:shadow-[0_0_24px_-4px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
                    />
                  ))}
                </div>
              </div>

              {verifyErr && (
                <div className="font-mono text-[11px] text-red-400 bg-red-500/[0.06] border border-red-500/30 px-4 py-2.5 text-center uppercase tracking-wider">
                  {verifyErr}
                </div>
              )}
              {resendMsg && (
                <div className="font-mono text-[11px] text-emerald-300 bg-emerald-500/[0.06] border border-emerald-500/30 px-4 py-2.5 text-center uppercase tracking-wider">
                  {resendMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={verifyLoading || code.some((d) => !d)}
                className="group w-full inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black px-6 py-4 text-base font-semibold transition-all"
              >
                {verifyLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Doğrulanıyor…
                  </>
                ) : (
                  <>
                    Doğrula &amp; Devam Et
                    <span className="font-mono text-xs opacity-60 group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="font-mono text-[10px] text-white/45 hover:text-white uppercase tracking-[0.18em] transition-colors"
                >
                  ← Email'i değiştir
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="font-mono text-[10px] text-white/45 hover:text-emerald-300 disabled:opacity-50 uppercase tracking-[0.18em] inline-flex items-center gap-1.5 transition-colors"
                >
                  {resending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <KeyRound className="size-3" />
                  )}
                  Yeniden gönder
                </button>
              </div>
            </form>

            <p className="nx-reveal text-center font-mono text-[10px] text-white/35 uppercase tracking-[0.2em]" style={{ animationDelay: "0.5s" }}>
              Spam klasörünü kontrol et · iletisim@nexora-trading.net
            </p>
          </div>
        )}

        {/* ───── FORM ───── */}
        {step === "form" && (
          <div className="space-y-14">
            {/* Hero — editorial */}
            <div className="space-y-8 max-w-3xl">
              <div className="nx-reveal flex items-center gap-3" style={{ animationDelay: "0.1s" }}>
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
                  01 / 7 Gün · Kart Bilgisi Yok
                </span>
              </div>

              <h1
                className="font-display nx-reveal font-medium tracking-tight"
                style={{
                  animationDelay: "0.2s",
                  fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)",
                  lineHeight: "0.97",
                  letterSpacing: "-0.02em",
                }}
              >
                Nexora'yı 7 gün{" "}
                <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
                  ücretsiz
                </em>{" "}
                dene.
              </h1>

              <p
                className="nx-reveal max-w-xl text-base md:text-lg leading-relaxed text-white/65 font-light"
                style={{ animationDelay: "0.35s" }}
              >
                Email + parola gir, mailini doğrula, hesabın anında açılır.
                Beğenirsen aylık ₺899 ile devam — beğenmezsen sessizce kapanır.
              </p>
            </div>

            {/* Editorial feature strip — yatay mono satır */}
            <div
              className="nx-reveal grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5 max-w-3xl border-y border-white/10 py-6"
              style={{ animationDelay: "0.5s" }}
            >
              {[
                { num: "01", label: "Anlık AL/SAT" },
                { num: "02", label: "BIST 100 Radar" },
                { num: "03", label: "WSB Sentiment" },
                { num: "04", label: "AI Skor + Haber" },
              ].map((f) => (
                <div key={f.num} className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-emerald-400/70 tabular-nums">{f.num}</span>
                  <span className="text-sm text-white/80">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Form — terminal aesthetic */}
            <form
              onSubmit={handleSubmit}
              className="nx-reveal max-w-xl space-y-5 bg-black/40 border border-white/10 backdrop-blur-sm p-7 md:p-9 shadow-[0_8px_60px_-12px_rgba(16,185,129,0.12)]"
              style={{ animationDelay: "0.65s" }}
            >
              <div>
                <label htmlFor="trial-email" className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                  <input
                    id="trial-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kullanici@domain.com"
                    required
                    autoComplete="email"
                    disabled={loading}
                    className="w-full bg-white/[0.02] border border-white/15 pl-10 pr-3 py-3.5 text-base focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="trial-pass" className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2.5">
                  Parola <span className="text-white/30 normal-case ml-1">— min 6 karakter</span>
                </label>
                <div className="relative">
                  <Lock className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                  <input
                    id="trial-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full bg-white/[0.02] border border-white/15 pl-10 pr-3 py-3.5 text-base focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* SPK / Yatırım Tavsiyesi Onayı */}
              <div className="border-l-2 border-amber-500/40 bg-amber-500/[0.04] pl-4 py-3 pr-3">
                <label htmlFor="accept-terms" className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    id="accept-terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    disabled={loading}
                    className="mt-0.5 size-4 rounded-none border-white/30 bg-black/40 accent-emerald-500 cursor-pointer shrink-0"
                  />
                  <span className="text-[12px] text-white/65 leading-relaxed">
                    Nexora&apos;daki sinyaller, BIST/kripto radarı ve bot performansı bilgilendirme amaçlıdır;{" "}
                    <strong className="text-amber-300">yatırım tavsiyesi değildir</strong>.
                    Geçmiş performans gelecek getiriyi garanti etmez, yüksek kayıp riski vardır.{" "}
                    <Link href="/terms" target="_blank" className="text-emerald-400 underline-offset-2 hover:underline">
                      Kullanım Şartları
                    </Link>{" "}
                    ve{" "}
                    <Link href="/kvkk" target="_blank" className="text-emerald-400 underline-offset-2 hover:underline">
                      KVKK
                    </Link>
                    &apos;yı okudum, kabul ediyorum.
                  </span>
                </label>
              </div>

              {err && (
                <div className="font-mono text-[11px] text-red-400 bg-red-500/[0.06] border border-red-500/30 px-4 py-2.5 uppercase tracking-wider">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim() || password.length < 6 || !acceptedTerms}
                className="group w-full inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black px-6 py-4 text-base font-semibold transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Hazırlanıyor…
                  </>
                ) : (
                  <>
                    Hesabı Aç
                    <span className="font-mono text-xs opacity-60 group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              <p className="font-mono text-[10px] text-white/35 text-center uppercase tracking-[0.2em] leading-relaxed">
                Email doğrulama sonrası hesabın açılır · Kart bilgisi yok
              </p>
            </form>

            {/* Editorial footnote */}
            <div className="nx-reveal max-w-xl space-y-2 pt-2" style={{ animationDelay: "0.85s" }}>
              <div className="flex items-start gap-3">
                <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.22em] mt-1 shrink-0">
                  Not
                </div>
                <p className="text-[11px] text-white/45 leading-relaxed font-light">
                  Trial bitince hesabın silinmez, sadece sinyallere erişim kapanır.
                  Sonradan istersen <strong className="text-white/70">₺899/ay</strong> veya{" "}
                  <strong className="text-white/70">$25 USDT</strong> ile devam edebilirsin.
                  Sorun yaşarsan{" "}
                  <a href="mailto:iletisim@nexora-trading.net" className="text-emerald-400 hover:underline">
                    iletisim@nexora-trading.net
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom legal strip */}
      <div className="relative z-10 border-t border-white/5 py-5 px-6 text-center">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">
          ⚠ Yatırım tavsiyesi değildir · SPK lisansı kapsamı dışındadır
        </p>
      </div>
    </div>
  );
}
