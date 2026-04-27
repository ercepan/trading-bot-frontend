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
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const { user, loading } = useAuth();
  const [requests, setRequests] = useState<AdminPaymentRequest[]>([]);
  const [filter, setFilter] = useState<"all" | "approved" | "rejected">("all");
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    try {
      const r = await authApi.adminPayments(filter === "all" ? undefined : filter);
      setRequests(r.requests);
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

  if (loading) return <div className="text-sm text-muted-foreground">Yükleniyor…</div>;
  if (user?.role !== "admin") {
    return (
      <Card className="max-w-md">
        <CardContent className="pt-6 text-sm">Bu sayfa sadece admin için.</CardContent>
      </Card>
    );
  }

  const totalApproved = requests
    .filter((r) => r.status === "approved")
    .reduce((s, r) => s + r.amount_usd, 0);
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Wallet className="size-6" /> Ödeme Kayıtları
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 gap-1">
              <ShieldCheck className="size-3" /> Otomatik
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            USDT BEP-20 ödemeleri BscScan üzerinden otomatik doğrulanır.
            Burada sadece audit/log için görüntülenir — manuel onay gerekmez.
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-5">
            <div className="text-[11px] uppercase text-muted-foreground tracking-wide">
              Toplam Onaylı
            </div>
            <div className="text-2xl font-semibold mt-1 text-emerald-400">
              ${totalApproved.toFixed(2)}
            </div>
            <div className="text-[11px] text-muted-foreground">{approvedCount} TX</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="text-[11px] uppercase text-muted-foreground tracking-wide">
              Reddedilen TX
            </div>
            <div className="text-2xl font-semibold mt-1 text-red-400">
              {rejectedCount}
            </div>
            <div className="text-[11px] text-muted-foreground">son denemeler</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="text-[11px] uppercase text-muted-foreground tracking-wide">
              Toplam Kayıt
            </div>
            <div className="text-2xl font-semibold mt-1">{requests.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs rounded-md border px-3 py-1.5 transition-colors ${
              filter === f
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            }`}
          >
            {f === "all" && "Tümü"}
            {f === "approved" && (
              <>
                <CheckCircle2 className="size-3 inline mr-1" /> Onaylı
              </>
            )}
            {f === "rejected" && (
              <>
                <XCircle className="size-3 inline mr-1" /> Reddedilen
              </>
            )}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Henüz ödeme kaydı yok. Subscriber'lar /yenile sayfasından USDT gönderdikçe
            burada görünür.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {requests.map((r) => (
            <PaymentRow key={r.id} r={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentRow({ r }: { r: AdminPaymentRequest }) {
  const dt = new Date(r.created_at).toLocaleString("tr-TR");
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
    <Card className={r.status === "approved" ? "border-emerald-500/20" : undefined}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-semibold">{r.username}</span>
              <StatusBadge />
              <span className="text-xs text-muted-foreground">#{r.id} · {dt}</span>
            </div>
            {r.tx_hash && (
              <a
                href={`https://bscscan.com/tx/${r.tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-muted-foreground hover:text-foreground underline inline-flex items-center gap-1 break-all"
              >
                {r.tx_hash} <ExternalLink className="size-2.5 shrink-0" />
              </a>
            )}
            {r.admin_note && r.status === "rejected" && (
              <div className="text-xs text-red-400">⚠ {r.admin_note}</div>
            )}
            {r.generated_code && (
              <div className="text-xs">
                🎫 <code className="font-mono text-emerald-400">{r.generated_code}</code>
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-semibold tabular-nums">
              ${r.amount_usd.toFixed(2)}
            </div>
            <div className="text-[11px] text-muted-foreground">USDT (BEP-20)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
