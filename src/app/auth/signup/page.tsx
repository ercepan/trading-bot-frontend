"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/auth-context";
import { Sparkles } from "lucide-react";
import { BullLogo } from "@/components/bull-logo";

export default function SignupPage() {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
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
    setErr(null);
    setLoading(true);
    try {
      await signup(username, password, code);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-11 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <BullLogo className="size-7" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">
                BULLS <span className="text-emerald-400">OF</span> NASDAQ
              </CardTitle>
              <CardDescription>Aramıza katıl 🐂 — davet kodunla 30 gün</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Kullanıcı adı</label>
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
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-[11px] text-muted-foreground">3-32 karakter, sadece harf/rakam/_</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Parola</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                autoComplete="new-password"
                required
                minLength={6}
                disabled={loading}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-[11px] text-muted-foreground">En az 6 karakter</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Davet Kodu</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="INV-XXXX-XXXX-XXXX"
                required
                disabled={loading}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-[11px] text-muted-foreground">Yöneticiden aldığın 16 karakterlik kod</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/50">
              <div className="flex items-start gap-2 text-xs">
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 size-3.5 cursor-pointer"
                  disabled={loading}
                />
                <label
                  htmlFor="accept-terms"
                  className="text-muted-foreground cursor-pointer select-none"
                >
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="underline hover:text-foreground"
                  >
                    Kullanım şartları + SPK bilgilendirmesi
                  </a>{" "}
                  ve{" "}
                  <a
                    href="/kvkk"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="underline hover:text-foreground"
                  >
                    KVKK aydınlatma metni
                  </a>
                  ni okudum, anladım, kabul ediyorum.
                </label>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <input
                  id="accept-risk"
                  type="checkbox"
                  checked={acceptedRisk}
                  onChange={(e) => setAcceptedRisk(e.target.checked)}
                  className="mt-0.5 size-3.5 cursor-pointer"
                  disabled={loading}
                />
                <label
                  htmlFor="accept-risk"
                  className="text-muted-foreground cursor-pointer select-none"
                >
                  Bu platformun{" "}
                  <strong className="text-foreground">yatırım tavsiyesi vermediğini</strong>,
                  yatırım kararlarımın{" "}
                  <strong className="text-foreground">tamamen kendi sorumluluğumda</strong>{" "}
                  olduğunu ve yatırdığım sermayeyi kaybetme riskim olduğunu kabul ediyorum.
                </label>
              </div>
            </div>

            {err && (
              <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-400">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password || !code || !acceptedTerms || !acceptedRisk}
              className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="size-3.5" />
              {loading ? "Oluşturuluyor…" : "Hesap oluştur (1 ay aktif)"}
            </button>

            <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/50">
              Hesabın var mı?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Giriş yap
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
