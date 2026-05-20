"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { Sparkles, User as UserIcon, Lock, Mail, KeyRound, Loader2 } from "lucide-react";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050505]">
          <Loader2 className="size-6 text-white/40 animate-spin" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const { signup } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const c = searchParams?.get("code");
    if (c) setCode(c.toUpperCase());
  }, [searchParams]);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedRisk, setAcceptedRisk] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms || !acceptedRisk) {
      setErr("Devam etmek için SPK uyarısını ve risk bildirimini onaylamalısın");
      return;
    }
    const emailClean = email.trim().toLowerCase();
    if (!emailClean || !emailClean.includes("@") || emailClean.length < 5) {
      setErr("Geçerli bir e-posta gir");
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      const result = await signup(username, password, code, emailClean);
      router.push(`/auth/verify-pending?email=${encodeURIComponent(result.email)}`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex items-center justify-center px-6 py-12">
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

        <div className="space-y-4">
          <div className="nx-reveal flex items-center gap-3" style={{ animationDelay: "0.2s" }}>
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              Davet Kodu ile Kayıt
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
            Aramıza{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              katıl.
            </em>
          </h1>
          <p className="nx-reveal text-white/55 text-sm" style={{ animationDelay: "0.4s" }}>
            Davet kodunla 30 gün erişim.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="nx-reveal bg-black/40 border border-white/10 backdrop-blur-sm p-7 md:p-8 space-y-5"
          style={{ animationDelay: "0.5s" }}
        >
          <div>
            <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2.5">
              Kullanıcı Adı <span className="text-white/30 normal-case ml-1">— 3-32, a-z, 0-9, _</span>
            </label>
            <div className="relative">
              <UserIcon className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="kullanici_adi"
                autoComplete="username"
                required
                minLength={3}
                maxLength={32}
                pattern="[a-z0-9_]+"
                disabled={loading}
                className="w-full bg-white/[0.02] border border-white/15 pl-10 pr-3 py-3.5 text-base focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2.5">
              Parola <span className="text-white/30 normal-case ml-1">— min 6</span>
            </label>
            <div className="relative">
              <Lock className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={6}
                disabled={loading}
                className="w-full bg-white/[0.02] border border-white/15 pl-10 pr-3 py-3.5 text-base focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2.5">
              Davet Kodu
            </label>
            <div className="relative">
              <KeyRound className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="INV-XXXX-XXXX-XXXX"
                required
                disabled={loading}
                className="w-full font-mono bg-white/[0.02] border border-white/15 pl-10 pr-3 py-3.5 text-base focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2.5">
              E-posta
            </label>
            <div className="relative">
              <Mail className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                required
                minLength={5}
                disabled={loading}
                className="w-full bg-white/[0.02] border border-white/15 pl-10 pr-3 py-3.5 text-base focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* SPK + Risk onayları — editorial blockquote */}
          <div className="border-l-2 border-amber-500/40 bg-amber-500/[0.04] pl-4 py-3 pr-3 space-y-3">
            <label htmlFor="accept-terms" className="flex items-start gap-3 cursor-pointer select-none">
              <input
                id="accept-terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 size-4 rounded-none border-white/30 bg-black/40 accent-emerald-500 cursor-pointer shrink-0"
                disabled={loading}
              />
              <span className="text-[12px] text-white/65 leading-relaxed">
                <a href="/terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-emerald-400 underline-offset-2 hover:underline">
                  Kullanım şartları + SPK
                </a>{" "}
                ve{" "}
                <a href="/kvkk" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-emerald-400 underline-offset-2 hover:underline">
                  KVKK
                </a>
                'yı okudum, kabul ediyorum.
              </span>
            </label>

            <label htmlFor="accept-risk" className="flex items-start gap-3 cursor-pointer select-none">
              <input
                id="accept-risk"
                type="checkbox"
                checked={acceptedRisk}
                onChange={(e) => setAcceptedRisk(e.target.checked)}
                className="mt-0.5 size-4 rounded-none border-white/30 bg-black/40 accent-emerald-500 cursor-pointer shrink-0"
                disabled={loading}
              />
              <span className="text-[12px] text-white/65 leading-relaxed">
                Bu platformun{" "}
                <strong className="text-amber-300">yatırım tavsiyesi vermediğini</strong>,
                yatırım kararlarımın{" "}
                <strong className="text-amber-300">kendi sorumluluğumda</strong>{" "}
                olduğunu kabul ediyorum.
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
            disabled={loading || !username || !password || !code || !email.trim() || !acceptedTerms || !acceptedRisk}
            className="group w-full inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black px-6 py-4 text-base font-semibold transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Oluşturuluyor…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Hesap Oluştur
                <span className="font-mono text-xs opacity-60 group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>

          <div className="pt-3 border-t border-white/5 text-center">
            <Link
              href="/auth/login"
              className="font-mono text-[10px] text-white/50 hover:text-emerald-300 uppercase tracking-[0.18em] transition-colors"
            >
              Hesabın var mı? Giriş yap →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
