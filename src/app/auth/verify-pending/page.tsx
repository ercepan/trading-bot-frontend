"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, RotateCcw, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { NexoraLogo } from "@/components/nexora-logo";
import { API_BASE } from "@/lib/api";

export default function VerifyPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Yükleniyor…</div>}>
      <Body />
    </Suspense>
  );
}

function Body() {
  const params = useSearchParams();
  const email = params?.get("email") || "";

  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const onResend = async () => {
    if (!email) {
      setResendMsg({ type: "err", text: "E-posta bilgisi yok — kayıt formundan tekrar dene." });
      return;
    }
    setResending(true);
    setResendMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        let msg = `${res.status}`;
        try {
          msg = JSON.parse(txt).detail || msg;
        } catch {}
        throw new Error(msg);
      }
      setResendMsg({ type: "ok", text: "Onay maili tekrar gönderildi. Spam klasörünü de kontrol et." });
    } catch (e) {
      setResendMsg({
        type: "err",
        text: e instanceof Error ? e.message : "Tekrar gönderim başarısız",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex size-14 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3">
            <NexoraLogo className="size-9" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-emerald-400">N</span>EXORA
          </h1>
          <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
            BIST · NASDAQ · CRYPTO
          </p>
        </div>

        <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="size-12 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
              <Mail className="size-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Hesabını onayla 📬</h2>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Onay linki{" "}
                {email ? (
                  <strong className="text-foreground font-mono text-[13px]">{email}</strong>
                ) : (
                  "e-postana"
                )}{" "}
                adresine gönderildi. Maildeki butona tıkla, hesabın anında aktive olur.
              </p>
            </div>
          </div>

          <div className="bg-background/40 border border-border rounded-md p-3 text-xs space-y-1.5">
            <div className="font-medium text-foreground">Yapılacaklar:</div>
            <ol className="space-y-1 pl-4 list-decimal text-muted-foreground">
              <li>Mail kutunu aç (gelmediyse spam'i kontrol et)</li>
              <li>"E-postayı Onayla" butonuna tıkla</li>
              <li>Otomatik açılan ekranda "Giriş yap"</li>
            </ol>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={onResend}
              disabled={resending || !email}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background hover:bg-muted/50 px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {resending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RotateCcw className="size-3.5" />
              )}
              Onay mailini tekrar gönder
            </button>
            <Link
              href="/auth/login"
              className="w-full inline-flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-2"
            >
              <ArrowLeft className="size-3" /> Giriş ekranına dön
            </Link>
          </div>

          {resendMsg && (
            <div
              className={`text-xs rounded-md px-3 py-2 flex items-start gap-2 ${
                resendMsg.type === "ok"
                  ? "border border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                  : "border border-red-500/30 bg-red-500/5 text-red-300"
              }`}
            >
              {resendMsg.type === "ok" ? (
                <CheckCircle2 className="size-3.5 mt-0.5 shrink-0" />
              ) : null}
              <span>{resendMsg.text}</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-4">
          Mail gelmiyorsa email adresinde yazım hatası olabilir.{" "}
          <Link href="/auth/signup" className="text-emerald-400 hover:underline">
            Kayıt formundan tekrar dene
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
