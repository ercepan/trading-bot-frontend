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
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

type PaymentInfo = {
  address: string;
  network: string;
  token: string;
  amount_usd: number;
  min_amount_usd: number;
  min_confirmations: number;
  configured: boolean;
};

export default function YenilePage() {
  const { user, refresh } = useAuth();
  const [info, setInfo] = useState<PaymentInfo | null>(null);
  const [txHash, setTxHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState<{ code: string; expires_at: string; amount: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);

  const loadAll = async () => {
    try {
      const [i, my] = await Promise.all([
        authApi.paymentInfo(),
        authApi.myPayments(),
      ]);
      setInfo(i);
      setRequests(my.requests);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) {
      setErr("TX hash gerekli");
      return;
    }
    setErr(null);
    setSuccess(null);
    setVerifying(true);
    try {
      const r = await authApi.verifyTx(txHash.trim());
      setSuccess({ code: r.code, expires_at: r.expires_at, amount: r.amount_usd });
      setTxHash("");
      await loadAll();
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Doğrulama başarısız");
    } finally {
      setVerifying(false);
    }
  };

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
          Sadece <strong className="text-foreground">USDT (BEP-20 / BNB Smart Chain)</strong> kabul ediyoruz.
          Aşağıdaki adrese gönder → TX hash'i yapıştır → sistem otomatik doğrular ve kodun anında üretilir.
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
                <AlertTriangle className="size-3" /> Yenileme zamanı
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sistem yapılandırma uyarısı */}
      {info && !info.configured && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-5 text-sm text-red-400">
            <strong>⚠️ Ödeme sistemi henüz yapılandırılmadı.</strong> Admin'e Telegram'dan ulaş.
          </CardContent>
        </Card>
      )}

      {/* 1. Ödeme adresi */}
      {info?.configured && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-2xl">①</span> USDT (BEP-20) gönder
            </CardTitle>
            <CardDescription>
              Ağ: <strong>BNB Smart Chain (BEP-20)</strong> · Token: <strong>USDT</strong> ·
              Tutar: <strong className="text-emerald-400">${info.amount_usd}</strong>
              <span className="text-xs ml-1">(min ${info.min_amount_usd})</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AddressBox address={info.address} />

            <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-xs space-y-1">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-3.5 text-amber-400 mt-0.5 shrink-0" />
                <div className="space-y-1 text-foreground/80">
                  <div>
                    <strong className="text-amber-400">Mutlaka BEP-20 (BSC)</strong> ağı seç.
                    TRC20 / ERC20 yanlış ağdır → para kaybolur.
                  </div>
                  <div>
                    Borsadan çıkış: Binance / OKX / Bybit → "Para Çek" → USDT → BEP20 ağı.
                  </div>
                  <div>
                    En az ${info.min_amount_usd.toFixed(2)} USDT gönder. Komisyon hariç.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. TX hash doğrulama */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-2xl">②</span> TX hash'i ile doğrula
          </CardTitle>
          <CardDescription>
            Borsa transferi onaylanınca BscScan'de görünen hash'i buraya yapıştır.{" "}
            {info && `${info.min_confirmations} blok onayı sonrası doğrulanır (~${info.min_confirmations * 3} sn).`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-5 text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <strong className="text-emerald-400">Ödeme onaylandı!</strong>{" "}
                  {success.amount.toFixed(2)} USDT alındı. Aboneliğin uzatıldı.
                </div>
              </div>
              <div className="rounded border border-emerald-500/30 bg-background p-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">🎫 Davet kodun</div>
                  <code className="font-mono text-emerald-400 font-bold text-base">{success.code}</code>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(success.code).catch(() => {})}
                  className="text-xs px-3 py-1.5 rounded border border-border hover:bg-accent inline-flex items-center gap-1"
                >
                  <Copy className="size-3" /> Kopyala
                </button>
              </div>
              <div className="text-xs text-muted-foreground">
                Yeni bitiş: <strong className="text-foreground">{success.expires_at.slice(0, 10)}</strong>
              </div>
            </div>
          )}

          <details className="rounded-md border border-blue-500/20 bg-blue-500/5 mb-4">
            <summary className="cursor-pointer p-3 text-xs font-medium text-blue-300 flex items-center gap-2">
              💡 TX hash nereden bulunur?
            </summary>
            <div className="px-3 pb-3 text-xs text-muted-foreground space-y-2 leading-relaxed">
              <div>
                <strong className="text-foreground">Binance:</strong> Cüzdan → Spot → İşlem
                Geçmişi → "Para Çek" sekmesi → ilgili işlem → <strong>TxID</strong> kopyala
                (0x... ile başlar)
              </div>
              <div>
                <strong className="text-foreground">OKX / Bybit / KuCoin:</strong> Çekme
                Geçmişi → işleme tıkla → <strong>"View on Blockchain"</strong> veya
                <strong> "TX Hash"</strong> alanını kopyala
              </div>
              <div>
                <strong className="text-foreground">MetaMask / Trust Wallet:</strong>{" "}
                Activity → işleme bas → "View on BscScan" → adres çubuğundaki
                <code className="bg-background/60 px-1 rounded mx-1">/tx/0x...</code> kısmı
              </div>
              <div>
                <strong className="text-foreground">Bulamıyorsan:</strong>{" "}
                <a
                  href={`https://bscscan.com/address/${info?.address || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-emerald-400 inline-flex items-center gap-1"
                >
                  bizim adresin BscScan sayfasına git <ExternalLink className="size-2.5" />
                </a>{" "}
                → "Token Transactions" → senin TX'i bul
              </div>
            </div>
          </details>

          <form onSubmit={onVerify} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Transaction Hash
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="0xabcdef0123456789..."
                disabled={verifying}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <p className="text-[11px] text-muted-foreground">
                {txHash.startsWith("0x") && txHash.length === 66 ? (
                  <a
                    href={`https://bscscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-emerald-400 inline-flex items-center gap-1"
                  >
                    bscscan.com'da bu TX'i aç <ExternalLink className="size-2.5" />
                  </a>
                ) : (
                  <span>0x ile başlayan 66 karakter (32 byte hex)</span>
                )}
              </p>
            </div>

            {err && (
              <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-400 flex items-start gap-2">
                <XCircle className="size-3.5 mt-0.5 shrink-0" />
                <span>{err}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying || !txHash.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> BscScan kontrol ediliyor…
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" /> Doğrula ve kodu üret
                </>
              )}
            </button>
          </form>

        </CardContent>
      </Card>

      {/* Geçmiş */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Geçmiş işlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requests.map((r) => (
                <RequestRow key={r.id} r={r} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AddressBox({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };
  return (
    <div className="rounded-lg border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent p-4">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
        BEP-20 Cüzdan Adresi
      </div>
      <div className="flex items-center justify-between gap-3">
        <code className="font-mono text-sm break-all flex-1 select-all">
          {address || "—"}
        </code>
        <button
          onClick={copy}
          disabled={!address}
          className={`shrink-0 inline-flex items-center gap-1 text-xs rounded-md px-3 py-2 transition-colors ${
            copied
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
              : "bg-emerald-500 hover:bg-emerald-600 text-black font-medium"
          }`}
        >
          {copied ? (
            <>
              <CheckCircle2 className="size-3" /> Kopyalandı
            </>
          ) : (
            <>
              <Copy className="size-3" /> Kopyala
            </>
          )}
        </button>
      </div>
      {address && (
        <a
          href={`https://bscscan.com/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-muted-foreground hover:text-foreground underline inline-flex items-center gap-1 mt-2"
        >
          BscScan'de gör <ExternalLink className="size-2.5" />
        </a>
      )}
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
          <span className="text-xs text-muted-foreground ml-2">USDT</span>
          <span className="text-xs text-muted-foreground ml-2">· {dt}</span>
        </div>
        <StatusBadge />
      </div>
      {r.tx_hash && (
        <a
          href={`https://bscscan.com/tx/${r.tx_hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-muted-foreground hover:text-foreground underline inline-flex items-center gap-1 mt-1.5 break-all"
        >
          {r.tx_hash.slice(0, 16)}…{r.tx_hash.slice(-8)} <ExternalLink className="size-2.5" />
        </a>
      )}
      {r.generated_code && (
        <div className="mt-2 rounded border border-emerald-500/30 bg-emerald-500/5 p-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">🎫 Kod:</span>
          <code className="font-mono text-emerald-400 font-semibold">{r.generated_code}</code>
        </div>
      )}
      {r.admin_note && r.status === "rejected" && (
        <div className="mt-2 text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded p-2">
          {r.admin_note}
        </div>
      )}
    </div>
  );
}
