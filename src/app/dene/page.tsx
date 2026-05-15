"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Mail,
  Sparkles,
  Shield,
  TrendingUp,
  Radar,
  BarChart3,
  ArrowRight,
  Lock,
  KeyRound,
} from "lucide-react";
import { NexoraLogo } from "@/components/nexora-logo";
import { trialApi } from "@/lib/api";
import { setToken } from "@/lib/auth";

type Step = "form" | "verify" | "success";

export default function DenePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      // Verify step'e geç
      setStep("verify");
      setEmail(trimmed); // normalize edilmiş halini hatırla
      // İlk input'a focus
      setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }

  // Code input — her hane ayrı box, auto-jump
  function handleCodeChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1); // sadece son karakter, rakam
    const newCode = [...code];
    newCode[idx] = digit;
    setCode(newCode);
    setVerifyErr(null);
    // İleri git
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
        // Kod yanlışsa temizle, ilk box'a focus
        setCode(["", "", "", "", "", ""]);
        setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
        return;
      }
      setToken(res.token);
      setSuccessUsername(res.username || "");
      setStep("success");
      setTimeout(() => router.push("/dashboard"), 1800);
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

  // Auto-submit when 6 digits filled
  useEffect(() => {
    if (code.every((d) => d) && !verifyLoading) {
      // Synthetic submit
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleVerifySubmit(fakeEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <NexoraLogo className="size-8" />
            <div>
              <div className="font-bold">NEXORA</div>
              <div className="text-[10px] text-emerald-400 font-mono tracking-widest">
                7 GÜN ÜCRETSİZ
              </div>
            </div>
          </Link>
          <Link href="/auth" className="text-sm text-white/60 hover:text-white">
            Giriş
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* SUCCESS */}
        {step === "success" && (
          <div className="space-y-6 text-center py-12">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/20 border border-emerald-500/40">
              <CheckCircle2 className="size-12 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold">Hoş geldin, {successUsername}! 🚀</h1>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed">
              Aboneliğin 7 gün boyunca aktif. Dashboard'a yönlendiriliyorsun…
            </p>
            <Loader2 className="size-6 text-emerald-400 animate-spin mx-auto" />
          </div>
        )}

        {/* VERIFY */}
        {step === "verify" && (
          <div className="space-y-8 max-w-xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <Mail className="size-7 text-emerald-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Email'ini doğrula</h1>
              <p className="text-white/60 leading-relaxed">
                <strong className="text-white">{email}</strong> adresine 6 haneli kod
                gönderdik. Kod 15 dakika geçerli.
              </p>
            </div>

            <form
              onSubmit={handleVerifySubmit}
              className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 md:p-8 space-y-5"
            >
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
                    onPaste={idx === 0 ? handleCodePaste : undefined}
                    disabled={verifyLoading}
                    className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl md:text-3xl font-bold bg-black/40 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60 disabled:opacity-50"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              {verifyErr && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-center">
                  {verifyErr}
                </div>
              )}
              {resendMsg && (
                <div className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-md px-3 py-2 text-center">
                  {resendMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={verifyLoading || code.some((d) => !d)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-6 py-3.5 text-base transition-colors"
              >
                {verifyLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Doğrulanıyor...
                  </>
                ) : (
                  <>
                    Doğrula &amp; Devam Et
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-white/50 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="hover:text-white"
                >
                  ← Email'i değiştir
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="hover:text-emerald-300 disabled:opacity-50 inline-flex items-center gap-1"
                >
                  {resending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <KeyRound className="size-3" />
                  )}
                  Kod gelmedi? Yeniden gönder
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-white/40">
              Spam klasörünü de kontrol et. Mail "iletisim@nexora-trading.net"'ten geliyor.
            </p>
          </div>
        )}

        {/* FORM */}
        {step === "form" && (
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                <Sparkles className="size-3.5" />
                7 gün ücretsiz · kart bilgisi yok
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Nexora'yı 7 gün <span className="text-emerald-400">ücretsiz</span> dene
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                Email + parola gir, mailini doğrula, hesabın anında açılır.
                Beğenirsen aylık ₺899 ile devam.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: TrendingUp, label: "Anlık AL/SAT sinyalleri" },
                { icon: BarChart3, label: "BIST radar (skor + bilanço)" },
                { icon: Radar, label: "WSB global hisse radarı" },
                { icon: Shield, label: "Sentiment + haber takibi" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center space-y-2"
                >
                  <Icon className="size-6 mx-auto text-emerald-400" />
                  <div className="text-xs text-white/80 leading-snug">{label}</div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 md:p-8 space-y-4 max-w-xl mx-auto"
            >
              <div>
                <label htmlFor="trial-email" className="block text-sm font-medium mb-2">
                  Email adresin
                </label>
                <div className="relative">
                  <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  <input
                    id="trial-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kullanici@domain.com"
                    required
                    autoComplete="email"
                    disabled={loading}
                    className="w-full bg-black/40 border border-white/15 rounded-md pl-10 pr-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="trial-pass" className="block text-sm font-medium mb-2">
                  Parola (min 6 karakter)
                </label>
                <div className="relative">
                  <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
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
                    className="w-full bg-black/40 border border-white/15 rounded-md pl-10 pr-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
                  />
                </div>
              </div>

              {err && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim() || password.length < 6}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-6 py-3.5 text-base transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Hazırlanıyor...
                  </>
                ) : (
                  <>
                    Devam Et
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-white/40 text-center leading-relaxed">
                Email doğrulamadan sonra hesabın açılır. Kart bilgisi yok.
                Trial bitince hesabın silinmez, sadece sinyallere erişim kapanır.
              </p>
            </form>

            <div className="text-center space-y-2 text-sm text-white/50">
              <p>
                Trial bitince: <strong className="text-white">Aylık ₺899</strong> (TL) veya{" "}
                <strong className="text-white">$25 USDT</strong> ile devam — istersen.
              </p>
              <p>
                Sorun yaşarsan{" "}
                <a
                  href="mailto:iletisim@nexora-trading.net"
                  className="text-emerald-400 hover:underline"
                >
                  iletisim@nexora-trading.net
                </a>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
