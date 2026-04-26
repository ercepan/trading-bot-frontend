"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/auth-context";
import { Sparkles, AlertTriangle } from "lucide-react";

export default function ActivatePage() {
  const { user, subscription, renew, logout } = useAuth();
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await renew(code);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Aktivasyon başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Abonelik gerekli</CardTitle>
              <CardDescription>Devam etmek için davet kodu gir</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Merhaba <strong className="text-foreground">{user?.username}</strong>,
            aboneliğin {subscription ? "süresi doldu" : "henüz aktif değil"}. Yeni bir
            kod ile 30 gün uzatabilirsin.
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
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
            </div>

            {err && (
              <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-400">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code}
              className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="size-3.5" />
              {loading ? "Aktive ediliyor…" : "Aktive et (30 gün)"}
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full text-xs text-muted-foreground hover:text-foreground py-2"
            >
              Çıkış yap
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
