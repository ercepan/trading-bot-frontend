"use client";

import { useState } from "react";
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
} from "lucide-react";
import { NexoraLogo } from "@/components/nexora-logo";
import { trialApi } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function DenePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ username: string; expires_at: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

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
      // Device ID — basit local marker
      let deviceId = "";
      try {
        deviceId = localStorage.getItem("nx_device_id") || "";
        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem("nx_device_id", deviceId);
        }
      } catch {}

      const res = await trialApi.signup(trimmed, password, deviceId);
      if (!res.ok || !res.token) {
        setErr(res.error || "Bir hata oluştu");
        setLoading(false);
        return;
      }

      // Token kaydet — kullanıcı zaten login
      setToken(res.token);
      setSuccess({
        username: res.username || "",
        expires_at: res.expires_at || "",
      });

      // 1.5 saniye başarı ekranı sonra dashboard'a yönlendir
      setTimeout(() => {
        router.push("/dashboard");
      }, 1800);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Bağlantı hatası");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
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
          <Link
            href="/auth"
            className="text-sm text-white/60 hover:text-white"
          >
            Giriş
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {success ? (
          <div className="space-y-6 text-center py-12">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/20 border border-emerald-500/40">
              <CheckCircle2 className="size-12 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold">Hoş geldin, {success.username}! 🚀</h1>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed">
              Aboneliğin 7 gün boyunca aktif. Dashboard'a yönlendiriliyorsun…
            </p>
            <Loader2 className="size-6 text-emerald-400 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Hero */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                <Sparkles className="size-3.5" />
                7 gün ücretsiz · kart bilgisi yok
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Nexora'yı 7 gün <span className="text-emerald-400">ücretsiz</span> dene
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                Email + parola gir, hesap anında açılır, dashboard'a girersin.
                Beğenirsen aylık ₺899 ile devam.
              </p>
            </div>

            {/* Features */}
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

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 md:p-8 space-y-4 max-w-xl mx-auto"
            >
              <div>
                <label
                  htmlFor="trial-email"
                  className="block text-sm font-medium mb-2"
                >
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
                <label
                  htmlFor="trial-pass"
                  className="block text-sm font-medium mb-2"
                >
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
                    Hesap açılıyor...
                  </>
                ) : (
                  <>
                    Hesabı Aç &amp; Başla
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-white/40 text-center leading-relaxed">
                Kart bilgisi vermiyorsun. Kullanıcı adı otomatik üretilir.
                Trial bitince hesabın silinmez, sadece sinyallere erişim kapanır.
              </p>
            </form>

            {/* Trust */}
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
