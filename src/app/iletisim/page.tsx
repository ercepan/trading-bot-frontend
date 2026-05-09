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
import { NexoraLogo } from "@/components/nexora-logo";
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
      // Token tek kullanımlık — widget'i resetle
      turnstileRef.current?.reset();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gönderim başarısız");
      // Token tüketilmiş olabilir, resetle
      turnstileRef.current?.reset();
      setTurnstileToken("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                İletişim
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
            <Mail className="size-7 text-emerald-400" /> İletişim
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Soru, geri bildirim, iş birliği — bize yaz. Genelde{" "}
            <strong className="text-foreground">24 saat içinde</strong> dönüş yaparız.
          </p>
        </div>

        {/* Success */}
        {success && (
          <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-emerald-400">Mesajın alındı 🎉</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Talep numaran: <code className="font-mono text-foreground">#{success.id}</code>{" "}
                  · Ekibimiz Telegram üzerinden bildirildi. 24 saat içinde e-postanla dönüş yapılacak.
                </p>
                <button
                  onClick={() => setSuccess(null)}
                  className="mt-3 text-xs text-emerald-400 hover:underline"
                >
                  Yeni mesaj gönder →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card/30 p-5">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Adın *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  disabled={submitting}
                  className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  disabled={submitting}
                  className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Konu (opsiyonel)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Abonelik · Eğitim · Ödeme · Diğer"
                disabled={submitting}
                className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Mesaj *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Sorununu, isteğini veya geri bildirimini yaz..."
                disabled={submitting}
                rows={6}
                className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
              />
              <div className="text-[11px] text-muted-foreground mt-1 text-right">
                {message.length} / 2000
              </div>
            </div>

            {err && (
              <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-400 flex items-start gap-2">
                <XCircle className="size-3.5 mt-0.5 shrink-0" />
                <span>{err}</span>
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-3 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Gönderiliyor…
                </>
              ) : (
                <>
                  <SendIcon className="size-4" /> Mesajı Gönder
                </>
              )}
            </button>

            <p className="text-[11px] text-muted-foreground text-center">
              Mesajların Telegram üzerinden ekibimize anlık olarak iletilir.
            </p>
          </form>
        )}

        {/* Alternatif kanallar */}
        <div className="rounded-xl border border-border bg-card/30 p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <MessageSquare className="size-4 text-emerald-400" />
            Alternatif kanallar
          </h3>
          <div className="space-y-2 text-sm">
            <a
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3 rounded-md border border-[#0088cc]/30 bg-[#0088cc]/5 hover:bg-[#0088cc]/10 transition-colors"
            >
              <div>
                <div className="font-medium">Telegram Kanalı</div>
                <div className="text-xs text-muted-foreground">
                  {TELEGRAM_CHANNEL_DISPLAY} · Hızlı destek
                </div>
              </div>
              <span className="text-xs text-[#3da5e0]">Aç →</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
