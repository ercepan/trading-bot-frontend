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
  Megaphone,
  RefreshCw,
  Sun,
  Globe,
  Sparkles,
  Newspaper,
  AlertCircle,
} from "lucide-react";

type PostKind = "morning_bist" | "afternoon_us" | "fomo_sim" | "evening_news";

type Status = Awaited<ReturnType<typeof authApi.marketingStatus>>;

const POST_BUTTONS: {
  kind: PostKind;
  label: string;
  description: string;
  icon: React.ElementType;
  schedule: string;
  color: string;
}[] = [
  {
    kind: "morning_bist",
    label: "BIST Sabah Raporu",
    description: "Top 5 yükseliş + KAP açıklamaları",
    icon: Sun,
    schedule: "Otomatik: 06:30 UTC (09:30 TR)",
    color: "border-amber-500/30 bg-amber-500/5 text-amber-300",
  },
  {
    kind: "afternoon_us",
    label: "ABD Topluluk Sentiment",
    description: "En çok konuşulan 5 ABD hissesi",
    icon: Globe,
    schedule: "Otomatik: 12:00 UTC (15:00 TR)",
    color: "border-blue-500/30 bg-blue-500/5 text-blue-300",
  },
  {
    kind: "fomo_sim",
    label: "FOMO Simülasyonu",
    description: "Geçmiş sinyalden +%X kazanç simülasyonu",
    icon: Sparkles,
    schedule: "Otomatik: 17:00 UTC (20:00 TR)",
    color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
  },
  {
    kind: "evening_news",
    label: "Akşam Haber Özeti",
    description: "Günün öne çıkan piyasa haberleri",
    icon: Newspaper,
    schedule: "Otomatik: 19:00 UTC (22:00 TR)",
    color: "border-purple-500/30 bg-purple-500/5 text-purple-300",
  },
];

export default function AdminMarketingPage() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Custom duyuru
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annLink, setAnnLink] = useState("");
  const [annBusy, setAnnBusy] = useState(false);

  const load = async () => {
    try {
      const s = await authApi.marketingStatus();
      setStatus(s);
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Yüklenemedi" });
    }
  };

  useEffect(() => {
    if (user?.role === "admin") load();
    const t = setInterval(() => {
      if (user?.role === "admin") load();
    }, 30_000);
    return () => clearInterval(t);
  }, [user]);

  const handlePost = async (kind: PostKind, label: string) => {
    if (!confirm(`"${label}" şimdi kanala atılacak. Devam?`)) return;
    setBusy(kind);
    setMsg(null);
    try {
      const r = await authApi.marketingPost(kind);
      if (r.ok) {
        setMsg({
          kind: "ok",
          text: `✅ "${label}" gönderildi · message_id: ${r.message_id}`,
        });
      } else {
        setMsg({ kind: "err", text: `${r.error || "Gönderim başarısız"}` });
      }
      await load();
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Hata" });
    } finally {
      setBusy(null);
    }
  };

  const handleAnnounce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annBody.trim()) return;
    setAnnBusy(true);
    setMsg(null);
    try {
      const r = await authApi.marketingAnnounce(
        annTitle.trim(),
        annBody.trim(),
        annLink.trim() || undefined,
      );
      if (r.ok) {
        setMsg({
          kind: "ok",
          text: `📣 Duyuru gönderildi · message_id: ${r.message_id}`,
        });
        setAnnTitle("");
        setAnnBody("");
        setAnnLink("");
      } else {
        setMsg({ kind: "err", text: r.error || "Gönderim başarısız" });
      }
      await load();
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Hata" });
    } finally {
      setAnnBusy(false);
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

  const isReady = status?.configured;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Megaphone className="size-6" /> Pazarlama / Telegram Kanalı
          </h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {isReady ? (
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 gap-1">
                <CheckCircle2 className="size-3" /> Bot canlı
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500/40 text-red-400 gap-1">
                <XCircle className="size-3" /> Bot yapılandırılmadı
              </Badge>
            )}
            {status?.channel && (
              <Badge variant="outline" className="font-mono text-xs">
                {status.channel}
              </Badge>
            )}
          </div>
        </div>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent inline-flex items-center gap-1"
        >
          <RefreshCw className="size-3" /> Yenile
        </button>
      </div>

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
            className={`pt-5 text-sm ${
              msg.kind === "ok" ? "text-emerald-300" : "text-red-400"
            }`}
          >
            {msg.text}
          </CardContent>
        </Card>
      )}

      {/* Yapılandırma uyarısı */}
      {!isReady && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-5 text-sm flex items-start gap-2">
            <AlertCircle className="size-4 text-amber-400 mt-0.5" />
            <div>
              Bot env değerleri set değil. Railway'de{" "}
              <code className="font-mono text-xs bg-background px-1 rounded">
                NEXORA_BOT_TOKEN
              </code>{" "}
              ve{" "}
              <code className="font-mono text-xs bg-background px-1 rounded">
                NEXORA_CHANNEL_USERNAME
              </code>{" "}
              eklenmeli.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manuel Post Butonları */}
      <div>
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          🚀 Manuel Post (anında gönder)
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {POST_BUTTONS.map((b) => {
            const Icon = b.icon;
            const isLoading = busy === b.kind;
            return (
              <Card
                key={b.kind}
                className={`hover:border-emerald-500/30 transition-colors ${b.color}`}
              >
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 rounded-md bg-background/50 p-2">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="font-semibold text-sm">{b.label}</div>
                      <div className="text-xs text-muted-foreground">{b.description}</div>
                      <div className="text-[10px] text-muted-foreground/70 italic">
                        {b.schedule}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePost(b.kind, b.label)}
                    disabled={!isReady || !!busy}
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-foreground/10 hover:bg-foreground/20 text-foreground text-xs font-medium px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-3 animate-spin" /> Gönderiliyor…
                      </>
                    ) : (
                      <>
                        <Send className="size-3" /> Şimdi gönder
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Custom Duyuru */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="size-4" /> Özel Duyuru Gönder
          </CardTitle>
          <CardDescription>
            Kendi mesajını oluştur — kanalda bold başlık + body + opsiyonel link
            şeklinde post edilir, sonunda otomatik site CTA eklenir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnnounce} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Başlık (bold olarak görünür)
              </label>
              <input
                type="text"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="Örn: Ramazan İndirimi · 1 ay yerine 45 gün"
                disabled={annBusy}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                İçerik (HTML destekli — &lt;b&gt;, &lt;i&gt;, &lt;a&gt;)
              </label>
              <textarea
                value={annBody}
                onChange={(e) => setAnnBody(e.target.value)}
                rows={4}
                placeholder="Detaylı duyuru metnini buraya yaz..."
                disabled={annBusy}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Link (opsiyonel)
              </label>
              <input
                type="url"
                value={annLink}
                onChange={(e) => setAnnLink(e.target.value)}
                placeholder="https://nexora-trading.com/satin-al"
                disabled={annBusy}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <button
              type="submit"
              disabled={annBusy || !isReady || !annTitle.trim() || !annBody.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {annBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Gönderiliyor…
                </>
              ) : (
                <>
                  <Send className="size-4" /> Duyuruyu kanala gönder
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Post Geçmişi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Son 20 post</CardTitle>
          <CardDescription>
            Tüm otomatik + manuel post'lar (her 30 sn auto-refresh)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!status || status.recent_posts.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              Henüz post yok.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 px-2">Tarih</th>
                    <th className="text-left py-2 px-2">Tür</th>
                    <th className="text-left py-2 px-2">Başlık</th>
                    <th className="text-center py-2 px-2">Durum</th>
                    <th className="text-right py-2 px-2">msg_id</th>
                  </tr>
                </thead>
                <tbody>
                  {status.recent_posts.map((p) => {
                    const dt = new Date(p.created_at + "Z").toLocaleString("tr-TR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <tr key={p.id} className="border-b border-border/30">
                        <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">
                          {dt}
                        </td>
                        <td className="py-2 px-2">
                          <Badge variant="outline" className="text-[10px]">
                            {p.kind}
                          </Badge>
                        </td>
                        <td className="py-2 px-2">{p.title}</td>
                        <td className="py-2 px-2 text-center">
                          {p.ok ? (
                            <CheckCircle2 className="size-3.5 text-emerald-400 inline" />
                          ) : (
                            <span title={p.error || ""}>
                              <XCircle className="size-3.5 text-red-400 inline" />
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-right font-mono">
                          {p.tg_message_id ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
