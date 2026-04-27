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
import { authApi, PaymentRequest } from "@/lib/auth";
import { useAuth } from "@/components/auth-context";
import {
  Sparkles,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  AlertTriangle,
  Send,
} from "lucide-react";

const PRICE_USD = 25;
const PAYMENT_METHODS: { value: "usdt" | "bank" | "papara" | "other"; label: string; hint: string }[] = [
  { value: "usdt", label: "USDT (TRC20/BEP20)", hint: "TX hash'ini referans alanına yapıştır" },
  { value: "papara", label: "Papara", hint: "Açıklamaya kullanıcı adını yaz" },
  { value: "bank", label: "Banka EFT/Havale", hint: "Açıklamaya kullanıcı adını yaz" },
  { value: "other", label: "Diğer", hint: "Notlar alanında detayları belirt" },
];

export default function YenilePage() {
  const { user, refresh } = useAuth();
  const [amount, setAmount] = useState(PRICE_USD);
  const [method, setMethod] = useState<"usdt" | "bank" | "papara" | "other">("usdt");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);

  const loadMyRequests = async () => {
    try {
      const r = await authApi.myPayments();
      setRequests(r.requests);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadMyRequests();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErr("Dekont dosyası eklemen lazım");
      return;
    }
    setErr(null);
    setSubmitting(true);
    try {
      await authApi.submitPayment({ amount_usd: amount, method, reference, notes, file });
      setSuccess(true);
      setReference("");
      setNotes("");
      setFile(null);
      await loadMyRequests();
      await refresh();
      setTimeout(() => setSuccess(false), 5000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Talep oluşturulamadı");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.value === method)!;
  const daysLeft = user?.subscription?.expires_at
    ? Math.max(
        0,
        Math.ceil((new Date(user.subscription.expires_at).getTime() - Date.now()) / 86400000),
      )
    : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Sparkles className="size-6 text-emerald-400" /> Aboneliği Yenile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ödemeyi yap → dekontunu yükle → admin onayladığında yeni davet kodun otomatik
          aktif olur ve abonelik süren <strong>30 gün</strong> uzar.
        </p>
      </div>

      {/* Mevcut durum */}
      {daysLeft !== null && (
        <Card
          className={
            daysLeft <= 5
              ? "border-amber-500/30 bg-amber-500/5"
              : "border-emerald-500/30 bg-emerald-500/5"
          }
        >
          <CardContent className="pt-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Mevcut abonelik</div>
              <div className="text-lg font-semibold">
                {daysLeft > 0 ? (
                  <>
                    <span className={daysLeft <= 5 ? "text-amber-400" : "text-emerald-400"}>
                      {daysLeft}
                    </span>{" "}
                    gün kaldı
                  </>
                ) : (
                  <span className="text-red-400">Süre doldu</span>
                )}
              </div>
            </div>
            {daysLeft <= 5 && (
              <Badge variant="outline" className="border-amber-500/40 text-amber-400 gap-1">
                <AlertTriangle className="size-3" /> Yenilemeyi öneriyoruz
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ödeme bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Önce ödemeyi yap</CardTitle>
          <CardDescription>
            Aşağıdaki yöntemlerden birini seç. Sonra dekontunu hazırla.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <PaymentInfo
            label="USDT (TRC20)"
            value="TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            note="Telegram'dan aktif cüzdan adresini al — ağ: TRON (TRC20). Düşük komisyon."
          />
          <PaymentInfo
            label="Papara"
            value="@bullsofnasdaq"
            note="Açıklamaya 'BoN-' + kullanıcı adın yaz. Örn: BoN-mehmet42"
          />
          <PaymentInfo
            label="Banka (TR)"
            value="TR00 0000 0000 0000 0000 0000 00"
            note="EFT/Havale. IBAN'ı Telegram'dan iste, açıklamaya kullanıcı adını yaz."
          />
          <div className="pt-2 text-xs text-muted-foreground">
            💡 Cüzdan adresleri zamanla değişebilir.{" "}
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground inline-flex items-center gap-1"
            >
              <Send className="size-3" /> Telegram'dan güncel bilgiyi al
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Dekont formu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">2. Dekont yükle</CardTitle>
          <CardDescription>
            Talep oluşunca admin'e Telegram'dan dekont düşer. Genelde 1-3 saat içinde
            onay verilir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-emerald-400">Talep alındı.</strong> Admin
                onayladığında bu sayfada davet kodun otomatik görünecek + Telegram'a düşer.
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tutar (USD)</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  step={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  disabled={submitting}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Ödeme yöntemi</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as typeof method)}
                  required
                  disabled={submitting}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Referans / TX Hash
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder={
                  method === "usdt" ? "0xabcdef... (TX hash)" : "Açıklama / referans no"
                }
                disabled={submitting}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-[11px] text-muted-foreground">{selectedMethod.hint}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Notlar (opsiyonel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Eklemek istediğin bir şey?"
                disabled={submitting}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Dekont (PNG/JPG/PDF · max 5 MB)
              </label>
              <label
                className={`flex items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-6 cursor-pointer transition-colors ${
                  file
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-border hover:border-emerald-500/30"
                }`}
              >
                <Upload className="size-4 text-muted-foreground" />
                <span className="text-sm">
                  {file ? (
                    <>
                      <strong className="text-emerald-400">{file.name}</strong>{" "}
                      <span className="text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Dekont seç veya sürükle</span>
                  )}
                </span>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,.webp,.heic,image/*,application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  disabled={submitting}
                  className="hidden"
                />
              </label>
            </div>

            {err && (
              <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-400">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !file || amount < 1}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Yükleniyor…
                </>
              ) : (
                <>
                  <Send className="size-4" /> Talebi gönder
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Geçmiş */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">3. Talep geçmişin</CardTitle>
          <CardDescription>
            Onaylanmış talepler için davet kodunu buradan görebilirsin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              Henüz talep yok.
            </div>
          ) : (
            <div className="space-y-2">
              {requests.map((r) => (
                <RequestRow key={r.id} r={r} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentInfo({ label, value, note }: { label: string; value: string; note: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className="rounded-md border border-border bg-card/30 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="font-mono text-sm truncate" title={value}>
            {value}
          </div>
        </div>
        <button
          onClick={copy}
          className="text-xs inline-flex items-center gap-1 rounded border border-border px-2 py-1 hover:bg-accent shrink-0"
        >
          {copied ? <CheckCircle2 className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      </div>
      <div className="text-[11px] text-muted-foreground mt-1.5">{note}</div>
    </div>
  );
}

function RequestRow({ r }: { r: PaymentRequest }) {
  const dt = new Date(r.created_at).toLocaleString("tr-TR");
  const StatusBadge = () => {
    if (r.status === "approved")
      return (
        <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 gap-1">
          <CheckCircle2 className="size-3" /> Onaylandı
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
        <Clock className="size-3" /> Beklemede
      </Badge>
    );
  };
  return (
    <div className="rounded-md border border-border p-3 text-sm">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <span className="font-mono">${r.amount_usd.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground ml-2">{r.method.toUpperCase()}</span>
          <span className="text-xs text-muted-foreground ml-2">· {dt}</span>
        </div>
        <StatusBadge />
      </div>
      {r.generated_code && (
        <div className="mt-2 rounded border border-emerald-500/30 bg-emerald-500/5 p-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">🎫 Davet kodun:</span>
          <code className="font-mono text-emerald-400 font-semibold">{r.generated_code}</code>
        </div>
      )}
      {r.admin_note && r.status === "rejected" && (
        <div className="mt-2 text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded p-2">
          <strong>Red sebebi:</strong> {r.admin_note}
        </div>
      )}
    </div>
  );
}
