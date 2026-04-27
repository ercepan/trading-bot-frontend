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
import { authApi, AdminPaymentRequest } from "@/lib/auth";
import { useAuth } from "@/components/auth-context";
import {
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Send,
  RefreshCw,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const { user, loading } = useAuth();
  const [requests, setRequests] = useState<AdminPaymentRequest[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">(
    "pending",
  );
  const [busy, setBusy] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    try {
      const r = await authApi.adminPayments(filter === "all" ? undefined : filter);
      setRequests(r.requests);
      setPendingCount(r.pending_count);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Yüklenemedi");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") load();
    const t = setInterval(() => {
      if (user?.role === "admin") load();
    }, 60_000);
    return () => clearInterval(t);
  }, [user, filter]);

  const handleApprove = async (r: AdminPaymentRequest) => {
    if (
      !window.confirm(
        `"${r.username}" için ${r.amount_usd} USD ödemesi onaylanacak.\n\n` +
          `→ Yeni davet kodu üretilecek\n` +
          `→ Aboneliğine 30 gün eklenecek\n` +
          `→ Telegram'a bildirim gidecek\n\nDevam?`,
      )
    )
      return;
    setBusy(r.id);
    setErr(null);
    setOkMsg(null);
    try {
      const result = await authApi.approvePayment(r.id);
      setOkMsg(
        `✅ ${result.username} onaylandı. Kod: ${result.code} · Bitiş: ${result.new_expires_at.slice(0, 10)}`,
      );
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Onay başarısız");
    } finally {
      setBusy(null);
    }
  };

  const handleReject = async (r: AdminPaymentRequest) => {
    const note = window.prompt(
      `"${r.username}" için red sebebi nedir?\n(Kullanıcıya gösterilir)`,
      "Dekont okunamadı, lütfen yeniden gönderin.",
    );
    if (!note) return;
    setBusy(r.id);
    setErr(null);
    try {
      await authApi.rejectPayment(r.id, note);
      setOkMsg(`❌ ${r.username} reddedildi.`);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Red başarısız");
    } finally {
      setBusy(null);
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

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Wallet className="size-6" /> Ödeme Talepleri
            {pendingCount > 0 && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">
                {pendingCount} bekliyor
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Subscriber'lar dekont yükledikçe burada görünür. Onay → otomatik kod + 30 gün
            uzatma. Dekont Telegram admin chat'inde de var.
          </p>
        </div>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent inline-flex items-center gap-1"
        >
          <RefreshCw className="size-3" /> Yenile
        </button>
      </div>

      {err && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-5 text-sm text-red-400">{err}</CardContent>
        </Card>
      )}
      {okMsg && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="pt-5 text-sm text-emerald-400">{okMsg}</CardContent>
        </Card>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs rounded-md border px-3 py-1.5 transition-colors ${
              filter === f
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            }`}
          >
            {f === "pending" && (
              <>
                <Clock className="size-3 inline mr-1" /> Bekleyen
              </>
            )}
            {f === "approved" && (
              <>
                <CheckCircle2 className="size-3 inline mr-1" /> Onaylı
              </>
            )}
            {f === "rejected" && (
              <>
                <XCircle className="size-3 inline mr-1" /> Reddedilmiş
              </>
            )}
            {f === "all" && "Tümü"}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Bu filtrede ödeme talebi yok.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <PaymentCard
              key={r.id}
              r={r}
              busy={busy === r.id}
              onApprove={() => handleApprove(r)}
              onReject={() => handleReject(r)}
            />
          ))}
        </div>
      )}

      <Card className="border-dashed">
        <CardContent className="pt-6 text-xs text-muted-foreground space-y-1.5">
          <div>
            <strong className="text-foreground">İpucu:</strong> Dekontu görmek için
            Telegram admin chat'ine bak — caption'da kullanıcı adı ve tutar var.
          </div>
          <div>
            <strong className="text-foreground">Onayda ne olur:</strong> Sistem yeni
            davet kodu üretir, mevcut aboneliğin üstüne 30 gün ekler (henüz aktifse +
            son tarihten itibaren), kullanıcı kendi <code>/yenile</code> sayfasında
            kodu görür.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentCard({
  r,
  busy,
  onApprove,
  onReject,
}: {
  r: AdminPaymentRequest;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const dt = new Date(r.created_at).toLocaleString("tr-TR");
  const isPending = r.status === "pending";
  const StatusBadge = () => {
    if (r.status === "approved")
      return (
        <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 gap-1">
          <CheckCircle2 className="size-3" /> Onaylı
        </Badge>
      );
    if (r.status === "rejected")
      return (
        <Badge variant="outline" className="border-red-500/40 text-red-400 gap-1">
          <XCircle className="size-3" /> Reddedildi
        </Badge>
      );
    return (
      <Badge variant="outline" className="border-amber-500/40 text-amber-400 gap-1">
        <Clock className="size-3" /> Bekliyor
      </Badge>
    );
  };
  return (
    <Card className={isPending ? "border-amber-500/30" : undefined}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-base">{r.username}</span>
              <StatusBadge />
            </div>
            <div className="text-xs text-muted-foreground">{dt} · talep #{r.id}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold tabular-nums">${r.amount_usd.toFixed(2)}</div>
            <div className="text-[11px] text-muted-foreground uppercase">{r.method}</div>
          </div>
        </div>

        <div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs">
          {r.reference && (
            <div className="rounded border border-border p-2">
              <div className="text-muted-foreground">Referans</div>
              <code className="font-mono text-[11px] break-all">{r.reference}</code>
            </div>
          )}
          {r.notes && (
            <div className="rounded border border-border p-2">
              <div className="text-muted-foreground">Not</div>
              <div className="text-foreground/80">{r.notes}</div>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
          <Send className="size-3" />
          {r.file_telegram_msg_id ? (
            <span>
              📎 Dekont Telegram'da · <code>{r.file_name}</code>{" "}
              {r.file_size && <span>({(r.file_size / 1024).toFixed(0)} KB)</span>}
            </span>
          ) : (
            <span className="text-amber-400">⚠️ Dekont Telegram'a iletilemedi</span>
          )}
        </div>

        {r.generated_code && (
          <div className="mt-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Üretilen kod:</span>
            <code className="font-mono text-emerald-400 font-semibold">{r.generated_code}</code>
          </div>
        )}
        {r.admin_note && (
          <div className="mt-3 rounded-md border border-red-500/20 bg-red-500/5 p-2 text-xs">
            <strong className="text-red-400">Red notu:</strong> {r.admin_note}
          </div>
        )}

        {isPending && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={onApprove}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 text-sm transition-colors disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              Onayla (kod üret + 30 gün)
            </button>
            <button
              onClick={onReject}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10 px-4 py-2 text-sm transition-colors disabled:opacity-50"
            >
              <XCircle className="size-4" />
              Reddet
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
