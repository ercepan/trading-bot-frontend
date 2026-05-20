"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Send as SendIcon,
  CheckCircle2,
  Loader2,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { API_BASE } from "@/lib/api";
import { TELEGRAM_CHANNEL_URL, TELEGRAM_CHANNEL_DISPLAY } from "@/lib/config";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export default function IletisimPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErr("Ad, e-posta ve mesaj zorunlu.");
      return;
    }
    if (!email.includes("@") || email.length < 5) {
      setErr("Geçerli bir e-posta gir.");
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setErr("Bot doğrulaması bekleniyor — birkaç saniye bekle.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          turnstile_token: turnstileToken,
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        let msg = `${res.status}`;
        try {
          msg = JSON.parse(txt).detail || msg;
        } catch {}
        throw new Error(msg);
      }
      const r = await res.json();
      setSuccess({ id: r.id });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTurnstileToken("");
      turnstileRef.current?.reset();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gönderim başarısız");
      turnstileRef.current?.reset();
      setTurnstileToken("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full bg-emerald-500/[0.05] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-10 rounded-md bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
              <span className="font-display text-emerald-400 text-xl leading-none" style={{ fontStyle: "italic", fontWeight: 600 }}>
                N
              </span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-base leading-none">Nexora</div>
              <div className="font-mono text-[9px] text-white/40 uppercase tracking-[0.25em] mt-1">
                İletişim
              </div>
            </div>
          </Link>
          <Link
            href="/"
            className="font-mono text-[11px] text-white/45 hover:text-emerald-300 uppercase tracking-[0.22em] inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Ana sayfa
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12 space-y-8 relative z-10">
        {/* Hero */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="size-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              İletişim · 24 saat içinde dönüş
            </span>
          </div>
          <h1
            className="font-display font-medium tracking-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
          >
            Bize{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              yaz.
            </em>
          </h1>
          <p className="font-mono text-[10px] text-white/45 uppercase tracking-[0.18em]">
            Soru · geri bildirim · iş birliği
          </p>
        </div>

        {/* Success */}
        {success && (
          <div className="border-l-2 border-emerald-500/50 bg-emerald-500/[0.05] pl-5 py-5 pr-5 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] text-emerald-300 uppercase tracking-[0.28em]">
                Mesajın Alındı
              </span>
            </div>
            <p className="text-sm text-white/75 leading-relaxed">
              Talep numaran:{" "}
              <code className="font-mono text-emerald-400 font-semibold">#{success.id}</code> ·
              Ekibimiz Telegram üzerinden bildirildi. 24 saat içinde e-postanla dönüş yapılacak.
            </p>
            <button
              onClick={() => setSuccess(null)}
              className="font-mono text-[10px] text-emerald-300 hover:text-emerald-200 uppercase tracking-[0.22em] transition-colors"
            >
              Yeni mesaj gönder →
            </button>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form
            onSubmit={onSubmit}
            className="bg-black/40 border border-white/10 backdrop-blur-sm p-7 md:p-8 space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2">
                  Adın *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  disabled={submitting}
                  className="w-full bg-white/[0.02] border border-white/15 px-3 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  disabled={submitting}
                  className="w-full bg-white/[0.02] border border-white/15 px-3 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2">
                Konu <span className="text-white/30 normal-case ml-1">— opsiyonel</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Abonelik · Eğitim · Ödeme · Diğer"
                disabled={submitting}
                className="w-full bg-white/[0.02] border border-white/15 px-3 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2">
                Mesaj *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Sorununu, isteğini veya geri bildirimini yaz..."
                disabled={submitting}
                rows={6}
                className="w-full bg-white/[0.02] border border-white/15 px-3 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all resize-none disabled:opacity-60"
              />
              <div className="font-mono text-[10px] text-white/35 mt-1 text-right uppercase tracking-[0.18em]">
                {message.length} / 2000
              </div>
            </div>

            {err && (
              <div className="font-mono text-[11px] text-red-400 bg-red-500/[0.06] border border-red-500/30 px-4 py-2.5 uppercase tracking-wider flex items-start gap-2">
                <XCircle className="size-3.5 mt-0.5 shrink-0" />
                <span className="normal-case tracking-normal">{err}</span>
              </div>
            )}

            {TURNSTILE_SITE_KEY && (
              <div className="flex justify-center pt-1">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken("")}
                  onExpire={() => setTurnstileToken("")}
                  options={{ theme: "dark", size: "flexible" }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !name.trim() || !email.trim() || !message.trim() || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
              className="group w-full inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black px-6 py-4 text-base font-semibold transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Gönderiliyor…
                </>
              ) : (
                <>
                  <SendIcon className="size-4" /> Mesajı Gönder
                  <span className="font-mono text-xs opacity-60 group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>

            <p className="font-mono text-[10px] text-white/35 text-center uppercase tracking-[0.2em]">
              Mesajlar Telegram'a anlık iletilir
            </p>
          </form>
        )}

        {/* Alternatif kanallar */}
        <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-7 space-y-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="size-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              Alternatif Kanallar
            </span>
          </div>
          <a
            href={TELEGRAM_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 border border-[#0088cc]/30 bg-[#0088cc]/[0.06] hover:bg-[#0088cc]/[0.12] hover:border-[#0088cc]/50 p-4 transition-all"
          >
            <div>
              <div className="font-display text-base font-medium">Telegram Kanalı</div>
              <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mt-1">
                {TELEGRAM_CHANNEL_DISPLAY} · Hızlı destek
              </div>
            </div>
            <span className="font-mono text-[11px] text-[#3da5e0] uppercase tracking-[0.22em]">
              Aç →
            </span>
          </a>
        </div>
      </main>
    </div>
  );
}
