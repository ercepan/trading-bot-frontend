"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authApi } from "@/lib/auth";
import { useAuth } from "@/components/auth-context";
import {
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from "lucide-react";

type Status = Awaited<ReturnType<typeof authApi.twitterStatus>>;

const DRAFT_LABELS: Record<string, { label: string; emoji: string; description: string }> = {
  morning_bist: { label: "BIST Sabah Top 3", emoji: "🇹🇷", description: "Sabah açılış öncesi BIST top 3 yükseliş" },
  afternoon_us: { label: "ABD Topluluk Top 3", emoji: "🇺🇸", description: "ABD'de en çok konuşulan 3 hisse" },
  fomo_sim: { label: "FOMO Simülasyonu", emoji: "📊", description: "Geçmiş sinyalden +%X kazanç (etkili!)" },
  evening_news: { label: "Akşam Haber", emoji: "📰", description: "Günün öne çıkan tek başlık + cashtag" },
  kanal_ad: { label: "Telegram Kanal Tanıtım", emoji: "📡", description: "Telegram cross-promotion" },
};

export default function AdminTwitterPage() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string; url?: string } | null>(null);

  // Custom tweet
  const [customText, setCustomText] = useState("");
  const [customBusy, setCustomBusy] = useState(false);

  const load = async () => {
    try {
      const s = await authApi.twitterStatus();
      setStatus(s);
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Yüklenemedi" });
    }
  };

  useEffect(() => {
    if (user?.role === "admin") load();
    const t = setInterval(() => {
      if (user?.role === "admin") load();
    }, 60_000);
    return () => clearInterval(t);
  }, [user]);

  const handleDraftPost = async (kind: string) => {
    if (!confirm(`"${DRAFT_LABELS[kind]?.label}" tweet olarak atılacak. Devam?`)) return;
    setBusy(kind);
    setMsg(null);
    try {
      const r = await authApi.twitterPostDraft(kind);
      if (r.ok) {
        setMsg({
          kind: "ok",
          text: `✅ Tweet atıldı`,
          url: r.url,
        });
      } else {
        setMsg({ kind: "err", text: r.error || "Gönderim başarısız" });
      }
      await load();
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Hata" });
    } finally {
      setBusy(null);
    }
  };

  const handleCustomPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    setCustomBusy(true);
    setMsg(null);
    try {
      const r = await authApi.twitterPost(customText.trim());
      if (r.ok) {
        setMsg({ kind: "ok", text: "✅ Tweet atıldı", url: r.url });
        setCustomText("");
      } else {
        setMsg({ kind: "err", text: r.error || "Gönderim başarısız" });
      }
      await load();
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Hata" });
    } finally {
      setCustomBusy(false);
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Yükleniyor…</div>;
  if (user?.role !== "admin") {
    return (
      <Card className="max-w-md">
        <CardContent className="pt-6 text-sm">Bu sayfa sadece admin için.</CardContent>
      </Card>
    );
  }

  const ready = status?.configured;
  const todayCount = status?.today_count ?? 0;
  const limit = status?.daily_limit ?? 50;
  const remainingPct = ((limit - todayCount) / limit) * 100;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Sparkles className="size-6 text-blue-400" /> Twitter (X) Manuel Post
          </h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {ready ? (
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 gap-1">
                <CheckCircle2 className="size-3" /> @nexora_signals bağlı
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500/40 text-red-400 gap-1">
                <XCircle className="size-3" /> Twitter API key eksik
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              Bugün: <strong className="ml-1">{todayCount}</strong> / {limit}
            </Badge>
            <span className="text-[11px] text-muted-foreground">Free tier · 24 saatte 50 tweet limiti</span>
          </div>
        </div>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent inline-flex items-center gap-1"
        >
          <RefreshCw className="size-3" /> Yenile
        </button>
      </div>

      {/* Limit progress */}
      {ready && (
        <Card>
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
              <span>Günlük tweet hakkı</span>
              <span>
                <strong className={remainingPct < 20 ? "text-amber-400" : "text-emerald-400"}>
                  {limit - todayCount}
                </strong>{" "}
                kalan
              </span>
            </div>
            <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500/60 transition-all"
                style={{ width: `${remainingPct}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mesaj */}
      {msg && (
        <Card
          className={
            msg.kind === "ok"
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-red-500/30 bg-red-500/5"
          }
        >
          <CardContent
            className={`pt-5 text-sm flex items-start gap-2 ${
              msg.kind === "ok" ? "text-emerald-300" : "text-red-400"
            }`}
          >
            <span>{msg.text}</span>
            {msg.url && (
              <a
                href={msg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto underline hover:text-foreground inline-flex items-center gap-1"
              >
                Aç <ExternalLink className="size-3" />
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Yapılandırma uyarısı */}
      {!ready && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-5 text-sm flex items-start gap-2">
            <AlertCircle className="size-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1.5">
              <div>
                <strong>Twitter API key eksik.</strong> Önce Twitter Developer Portal'da app
                aç ve 4 değeri Railway env'e ekle:
              </div>
              <ul className="list-disc list-inside text-xs space-y-0.5 mt-2">
                <li>
                  <code className="text-[11px] bg-background/60 px-1 rounded">TWITTER_API_KEY</code>{" "}
                  — Consumer Key
                </li>
                <li>
                  <code className="text-[11px] bg-background/60 px-1 rounded">TWITTER_API_SECRET</code>{" "}
                  — Consumer Secret
                </li>
                <li>
                  <code className="text-[11px] bg-background/60 px-1 rounded">TWITTER_ACCESS_TOKEN</code>{" "}
                  — User Access Token (Read+Write)
                </li>
                <li>
                  <code className="text-[11px] bg-background/60 px-1 rounded">TWITTER_ACCESS_SECRET</code>{" "}
                  — User Access Secret
                </li>
              </ul>
              <div className="text-xs text-muted-foreground mt-2">
                Setup rehberi:{" "}
                <a
                  href="https://developer.x.com/en/portal/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  developer.x.com/en/portal/dashboard
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hazır Draft'lar */}
      <div>
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          🎯 Hazır Draft'lar (her tıkta canlı veriden yenilenir)
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(status?.drafts ?? {}).map(([kind, draft]) => {
            const cfg = DRAFT_LABELS[kind] ?? { label: kind, emoji: "📝", description: "" };
            const isLoading = busy === kind;
            const hasContent = draft && draft.text;
            return (
              <Card key={kind} className={hasContent ? "" : "opacity-60"}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>{cfg.emoji}</span> {cfg.label}
                  </CardTitle>
                  <CardDescription className="text-xs">{cfg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-md border border-border bg-card/40 p-3 text-xs whitespace-pre-wrap font-mono min-h-[80px]">
                    {hasContent ? (
                      <>
                        {draft.text}
                        <div className="mt-2 text-[10px] text-muted-foreground">
                          {draft.text!.length} / 280 karakter
                        </div>
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">
                        {(draft as any)?.error || "İçerik şu an üretilemedi (veri yok)"}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDraftPost(kind)}
                    disabled={!ready || !hasContent || !!busy}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-2 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-3 animate-spin" /> Atılıyor…
                      </>
                    ) : (
                      <>
                        <Send className="size-3" /> Tweet at
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Custom Tweet */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="size-4" /> Özel Tweet
          </CardTitle>
          <CardDescription>
            Kendi tweet metnini yaz. 280 karakter limit. Cashtag ($THYAO) + 1-2 hashtag (#BIST100, #borsa).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCustomPost} className="space-y-3">
            <div className="relative">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={4}
                maxLength={280}
                placeholder="$THYAO bugün +%5, sentiment skoru +0.65 🟢&#10;Topluluk + analist konsensüs bullish&#10;&#10;#borsa #BIST100"
                disabled={customBusy}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none font-mono"
              />
              <div
                className={`absolute bottom-2 right-3 text-[11px] ${
                  customText.length > 270
                    ? "text-amber-400"
                    : customText.length > 250
                      ? "text-yellow-500"
                      : "text-muted-foreground"
                }`}
              >
                {customText.length} / 280
              </div>
            </div>
            <button
              type="submit"
              disabled={customBusy || !ready || !customText.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 text-sm transition-colors disabled:opacity-50"
            >
              {customBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Atılıyor…
                </>
              ) : (
                <>
                  <Send className="size-4" /> Tweet at
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Geçmiş */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Son 30 Tweet</CardTitle>
        </CardHeader>
        <CardContent>
          {!status || status.recent_posts.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">Henüz tweet yok.</div>
          ) : (
            <div className="space-y-2">
              {status.recent_posts.map((p) => {
                const dt = new Date(p.created_at + "Z").toLocaleString("tr-TR", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={p.id}
                    className={`rounded-md border p-3 text-sm ${
                      p.ok ? "border-border" : "border-red-500/20 bg-red-500/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {p.kind}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{dt}</span>
                      </div>
                      {p.ok && p.tweet_id ? (
                        <a
                          href={`https://x.com/i/web/status/${p.tweet_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          X'te aç <ExternalLink className="size-2.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-red-400">{p.error?.slice(0, 60)}</span>
                      )}
                    </div>
                    <div className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">
                      {p.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
