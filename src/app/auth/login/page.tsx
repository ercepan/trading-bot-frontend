"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { Lock, Mail, User as UserIcon, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [showVerifyHelp, setShowVerifyHelp] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setShowVerifyHelp(false);
    setLoading(true);
    try {
      await login(username, password);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Giriş başarısız";
      setErr(msg);
      if (msg.toLowerCase().includes("onayl") || msg.toLowerCase().includes("verify")) {
        setShowVerifyHelp(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Background atmosphere */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full bg-emerald-500/[0.07] blur-[140px]" />
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

      <div className="w-full max-w-md space-y-10 relative z-10">
        {/* Logo + kicker */}
        <Link href="/" className="nx-reveal flex items-center gap-3 group" style={{ animationDelay: "0.1s" }}>
          <div className="size-11 rounded-md bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
            <span className="font-display text-emerald-400 text-2xl leading-none" style={{ fontStyle: "italic", fontWeight: 600 }}>
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

        {/* Hero */}
        <div className="space-y-4">
          <div className="nx-reveal flex items-center gap-3" style={{ animationDelay: "0.2s" }}>
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              Giriş Yap
            </span>
          </div>
          <h1
            className="font-display nx-reveal font-medium tracking-tight"
            style={{
              animationDelay: "0.3s",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              lineHeight: "1",
              letterSpacing: "-0.02em",
            }}
          >
            Tekrar{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              hoş geldin.
            </em>
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="nx-reveal bg-black/40 border border-white/10 backdrop-blur-sm p-7 md:p-8 space-y-5 shadow-[0_8px_60px_-12px_rgba(16,185,129,0.12)]"
          style={{ animationDelay: "0.45s" }}
        >
          <div>
            <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2.5">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <UserIcon className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kullanici_adi"
                autoComplete="username"
                required
                disabled={loading}
                className="w-full bg-white/[0.02] border border-white/15 pl-10 pr-3 py-3.5 text-base focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2.5">
              Parola
            </label>
            <div className="relative">
              <Lock className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full bg-white/[0.02] border border-white/15 pl-10 pr-3 py-3.5 text-base focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {err && (
            <div className="font-mono text-[11px] text-red-400 bg-red-500/[0.06] border border-red-500/30 px-4 py-3 uppercase tracking-wider space-y-2">
              <div>{err}</div>
              {showVerifyHelp && (
                <Link
                  href="/auth/verify-pending"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 normal-case tracking-normal"
                >
                  <Mail className="size-3" /> Onay mailini tekrar gönder →
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="group w-full inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black px-6 py-4 text-base font-semibold transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Giriş yapılıyor…
              </>
            ) : (
              <>
                Giriş Yap
                <span className="font-mono text-xs opacity-60 group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-4 text-xs">
            <Link
              href="/auth/signup"
              className="font-mono text-[10px] text-white/50 hover:text-emerald-300 uppercase tracking-[0.18em] transition-colors"
            >
              Davet kodu ile kayıt
            </Link>
            <Link
              href="/dene"
              className="font-mono text-[10px] text-white/50 hover:text-emerald-300 uppercase tracking-[0.18em] transition-colors"
            >
              7 gün ücretsiz dene →
            </Link>
          </div>
        </form>

        {/* Editorial footer caption */}
        <div className="nx-reveal flex items-start gap-3 max-w-sm" style={{ animationDelay: "0.7s" }}>
          <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.22em] mt-1 shrink-0">
            Not
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed font-light">
            Hesabını unutursan{" "}
            <a href="mailto:iletisim@nexora-trading.net" className="text-emerald-400 hover:underline">
              iletisim@nexora-trading.net
            </a>
            'a yaz.
          </p>
        </div>
      </div>
    </div>
  );
}
