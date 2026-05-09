"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Mail, LogIn } from "lucide-react";
import { NexoraLogo } from "@/components/nexora-logo";
import { API_BASE } from "@/lib/api";

type VerifyState =
  | { status: "verifying" }
  | { status: "success"; email: string; username: string; justVerified: boolean }
  | { status: "error"; error: string };

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Yükleniyor…</div>}>
      <Body />
    </Suspense>
  );
}

function Body() {
  const params = useSearchParams();
  const token = params?.get("token") || "";
  const [state, setState] = useState<VerifyState>({ status: "verifying" });

  useEffect(() => {
    if (!token) {
      setState({ status: "error", error: "Token eksik. Onay linkini doğru kopyaladığından emin ol." });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          let msg = `${res.status}`;
          try {
            msg = JSON.parse(txt).detail || msg;
          } catch {}
          throw new Error(msg);
        }
        const data = await res.json();
        if (!cancelled) {
          setState({
            status: "success",
            email: data.email,
            username: data.username,
            justVerified: !!data.just_verified,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            status: "error",
            error: e instanceof Error ? e.message : "Doğrulama başarısız",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

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
        </div>

        {state.status === "verifying" && (
          <div className="rounded-xl border border-border bg-card/40 p-8 text-center space-y-3">
            <Loader2 className="size-10 mx-auto text-emerald-400 animate-spin" />
            <p className="text-sm text-muted-foreground">E-postan doğrulanıyor…</p>
          </div>
        )}

        {state.status === "success" && (
          <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-6 text-center space-y-4">
            <div className="size-16 rounded-full bg-emerald-500/15 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-9 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {state.justVerified ? "Onaylandı! 🎉" : "Zaten onaylı"}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {state.justVerified ? (
                  <>
                    <strong className="text-foreground">{state.email}</strong> aktif.
                    Welcome maili kutuna gelecek.
                  </>
                ) : (
                  <>
                    <strong className="text-foreground">{state.email}</strong> bu adres zaten
                    onaylanmış. Direkt giriş yapabilirsin.
                  </>
                )}
              </p>
            </div>
            <Link
              href="/auth/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-3 text-sm transition-colors"
            >
              <LogIn className="size-4" /> Giriş yap →
            </Link>
          </div>
        )}

        {state.status === "error" && (
          <div className="rounded-xl border-2 border-red-500/30 bg-red-500/5 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
                <XCircle className="size-6 text-red-400" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight text-red-300">
                  Doğrulama başarısız
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">{state.error}</p>
              </div>
            </div>

            <div className="bg-background/40 border border-border rounded-md p-3 text-xs text-muted-foreground space-y-1">
              <div className="font-medium text-foreground">Olası sebepler:</div>
              <ul className="pl-4 list-disc space-y-0.5">
                <li>Link süresi doldu (24 saat)</li>
                <li>Daha önce kullanılmış</li>
                <li>Yanlış kopyalandı</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/auth/verify-pending"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 px-4 py-2.5 text-sm font-medium transition-colors"
              >
                <Mail className="size-3.5" />
                Yeni onay maili iste
              </Link>
              <Link
                href="/auth/login"
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1"
              >
                Giriş ekranına dön
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
