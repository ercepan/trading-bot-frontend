"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { authApi } from "@/lib/auth";
import { AlertCircle, X, Mail, Loader2, CheckCircle2 } from "lucide-react";

const DISMISS_KEY = "nexora-email-banner-dismissed-at";
const DISMISS_DAYS = 7;

/**
 * Login olmuş ve email'i olmayan kullanıcılara gösterilen banner.
 * Abonelik bitiş uyarıları + parola sıfırlama için email zorunluluğu hatırlatır.
 *
 * Kullanıcı kapatırsa 7 gün boyunca tekrar gösterilmez.
 */
export function EmailMissingBanner() {
  const { user, refresh } = useAuth();
  const [dismissed, setDismissed] = useState(true); // SSR-safe default
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(DISMISS_KEY);
    if (!stored) {
      setDismissed(false);
      return;
    }
    try {
      const ts = parseInt(stored, 10);
      const ageMs = Date.now() - ts;
      const maxAge = DISMISS_DAYS * 24 * 60 * 60 * 1000;
      setDismissed(ageMs < maxAge);
    } catch {
      setDismissed(false);
    }
  }, []);

  // Sadece subscriber + email yok + dismiss edilmemiş → göster
  const shouldShow =
    !!user && user.role === "subscriber" && !user.email && !dismissed && !success;

  if (!shouldShow) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean.includes("@") || clean.length < 5) {
      setErr("Geçerli bir e-posta gir");
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      await authApi.updateEmail(clean);
      setSuccess(true);
      // Refresh auth context — sunucuda email kayıtlı ama verified=false olabilir
      setTimeout(async () => {
        await refresh();
      }, 1500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Güncelleme başarısız");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 text-xs">
        <AlertCircle className="size-4 text-amber-400 shrink-0" />

        {!showInput && !success && (
          <>
            <span className="flex-1 text-amber-100/90">
              <strong className="text-amber-200">E-postanı ekle.</strong>{" "}
              <span className="text-amber-100/70">
                Aboneliğin bitiş uyarıları, parola sıfırlama ve önemli bildirimler için
                gerekli.
              </span>
            </span>
            <button
              onClick={() => setShowInput(true)}
              className="px-3 py-1 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors inline-flex items-center gap-1"
            >
              <Mail className="size-3" /> E-posta ekle
            </button>
            <button
              onClick={handleDismiss}
              className="text-amber-200/60 hover:text-amber-200 p-0.5"
              aria-label="Kapat"
            >
              <X className="size-4" />
            </button>
          </>
        )}

        {showInput && !success && (
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              autoFocus
              disabled={submitting}
              className="flex-1 max-w-xs rounded border border-amber-500/40 bg-background/40 px-2.5 py-1 text-sm text-foreground focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={submitting || !email.trim()}
              className="px-3 py-1 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-50 inline-flex items-center gap-1"
            >
              {submitting ? <Loader2 className="size-3 animate-spin" /> : null}
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => {
                setShowInput(false);
                setErr(null);
              }}
              disabled={submitting}
              className="text-amber-200/60 hover:text-amber-200 px-2 py-1"
            >
              İptal
            </button>
            {err && <span className="text-red-400 text-xs">· {err}</span>}
          </form>
        )}

        {success && (
          <span className="flex-1 text-emerald-300 inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4" />
            Onay maili gönderildi — kutuna bak, linke tıkla 📬
          </span>
        )}
      </div>
    </div>
  );
}
