"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Sparkles,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { authApi } from "@/lib/auth";
import { BullLogo } from "@/components/bull-logo";

type PublicInfo = Awaited<ReturnType<typeof authApi.paymentPublicInfo>>;

export default function SatinAlPage() {
  const [info, setInfo] = useState<PublicInfo | null>(null);
  const [txHash, setTxHash] = useState("");
  const [contact, setContact] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState<{ code: string; amount: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState<"address" | "code" | null>(null);

  useEffect(() => {
    authApi.paymentPublicInfo().then(setInfo).catch(() => {});
  }, []);

  const copy = async (text: string, kind: "address" | "code") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2500);
    } catch {}
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) {
      setErr("TX hash gerekli");
      return;
    }
    setErr(null);
    setVerifying(true);
    try {
      const r = await authApi.buyCodeAnonymous(txHash.trim(), contact.trim());
      setSuccess({ code: r.code, amount: r.amount_usd });
      setTxHash("");
      setContact("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Doğrulama başarısız");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/85 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <BullLogo className="size-6" />
            </div>
            <span className="font-bold tracking-tight">
              BULLS <span className="text-emerald-400">OF</span> NASDAQ
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="size-4" /> Ana sayfa
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="size-7 text-emerald-400" /> Davet Kodu Satın Al
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Hesap açmadan, Telegram'a yazmadan — sadece USDT BEP-20 ile{" "}
            <strong className="text-foreground">${info?.amount_usd ?? 25}</strong> öde,
            kodun anında ekranda çıksın. Sonra hesabını açıp 30 gün boyunca panele
            erişirsin.
          </p>
        </div>

        {/* Success */}
        {success && (
          <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-6 space-y-4 shadow-lg shadow-emerald-500/10">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-6 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-emerald-400">Ödeme onaylandı 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  {success.amount.toFixed(2)} USDT alındı. Davet kodun aşağıda — hemen
                  hesap açmaya kullan.
                </p>
              </div>
            </div>
            <div className="rounded-lg border-2 border-emerald-500/30 bg-background p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                🎫 Davet Kodun
              </div>
              <div className="flex items-center justify-between gap-3">
                <code className="font-mono font-bold text-2xl text-emerald-400 tracking-wider select-all">
                  {success.code}
                </code>
                <button
                  onClick={() => copy(success.code, "code")}
                  className="shrink-0 inline-flex items-center gap-1.5 text-sm rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 transition-colors"
                >
                  {copied === "code" ? (
                    <>
                      <CheckCircle2 className="size-4" /> Kopyalandı
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" /> Kopyala
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-100">
              <strong>⚠️ Önemli:</strong> Bu kodu güvenli bir yere kaydet. Tek-kullanımlık
              ve 30 gün içinde kullanılmazsa iptal olur. Bu sayfayı kapatırsan kodu tekrar
              görmen için TX hash'i tekrar girmelisin.
            </div>
            <Link
              href={`/auth/signup?code=${success.code}`}
              className="block w-full text-center rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-3 text-base transition-colors"
            >
              Hesap aç ve panele gir <ArrowRight className="size-4 inline ml-1" />
            </Link>
          </div>
        )}

        {/* Sistem konfigürasyonu */}
        {info && !info.configured && (
          <div className="rounded-md border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
            ⚠️ Ödeme sistemi henüz aktif değil. Lütfen birkaç dakika sonra tekrar dene.
          </div>
        )}

        {/* Step 1: Adres */}
        {info?.configured && (
          <section className="rounded-xl border border-border bg-card/30 p-5 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-emerald-400">①</span>
              <div>
                <h2 className="font-semibold text-lg">USDT (BEP-20) gönder</h2>
                <p className="text-xs text-muted-foreground">
                  Ağ <strong className="text-foreground">BNB Smart Chain (BEP-20)</strong>{" "}
                  · Token <strong className="text-foreground">USDT</strong> · Tutar{" "}
                  <strong className="text-emerald-400">${info.amount_usd}</strong>
                </p>
              </div>
            </div>

            <div className="rounded-lg border-2 border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                Cüzdan adresi
              </div>
              <div className="flex items-center justify-between gap-3">
                <code className="font-mono text-sm break-all flex-1 select-all">
                  {info.address}
                </code>
                <button
                  onClick={() => copy(info.address, "address")}
                  className={`shrink-0 inline-flex items-center gap-1 text-xs rounded-md px-3 py-2 transition-colors ${
                    copied === "address"
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                      : "bg-emerald-500 hover:bg-emerald-600 text-black font-medium"
                  }`}
                >
                  {copied === "address" ? (
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
              <a
                href={`https://bscscan.com/address/${info.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-muted-foreground hover:text-foreground underline inline-flex items-center gap-1 mt-2"
              >
                BscScan'de gör <ExternalLink className="size-2.5" />
              </a>
            </div>

            <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-xs space-y-1.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-3.5 text-amber-400 mt-0.5 shrink-0" />
                <div className="space-y-1 text-foreground/80">
                  <div>
                    <strong className="text-amber-400">Mutlaka BEP-20 (BSC)</strong> ağı
                    seç. TRC20 / ERC20 yanlış ağdır → para kaybolur, geri dönmez.
                  </div>
                  <div>
                    Borsadan: Binance / OKX / Bybit / KuCoin → Para Çek → USDT → BEP20.
                  </div>
                  <div>
                    En az ${info.min_amount_usd.toFixed(2)} USDT gönder (komisyon hariç
                    net miktar).
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: TX hash */}
        <section className="rounded-xl border border-border bg-card/30 p-5">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-emerald-400">②</span>
            <div>
              <h2 className="font-semibold text-lg">TX hash ile doğrula → kod al</h2>
              <p className="text-xs text-muted-foreground">
                Transfer onaylanınca BscScan'de görünen hash'i yapıştır.
              </p>
            </div>
          </div>

          <details className="rounded-md border border-blue-500/20 bg-blue-500/5 mb-4">
            <summary className="cursor-pointer p-3 text-xs font-medium text-blue-300 flex items-center gap-2">
              💡 TX hash nereden bulunur?
            </summary>
            <div className="px-3 pb-3 text-xs text-muted-foreground space-y-2 leading-relaxed">
              <div>
                <strong className="text-foreground">Binance:</strong> Cüzdan → Spot →
                İşlem Geçmişi → "Para Çek" sekmesi → ilgili işlem → <strong>TxID</strong>{" "}
                kopyala
              </div>
              <div>
                <strong className="text-foreground">OKX / Bybit / KuCoin:</strong> Çekme
                Geçmişi → işleme tıkla → <strong>"View on Blockchain"</strong> veya
                <strong> "TX Hash"</strong>
              </div>
              <div>
                <strong className="text-foreground">MetaMask / Trust Wallet:</strong>{" "}
                Activity → işleme bas → "View on BscScan" → adres çubuğundaki TX hash
              </div>
              {info?.address && (
                <div>
                  <a
                    href={`https://bscscan.com/address/${info.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-emerald-400 inline-flex items-center gap-1"
                  >
                    Bizim adresimizi BscScan'de aç <ExternalLink className="size-2.5" />
                  </a>{" "}
                  → "Token Transactions" altında senin gönderdiğin TX'i bulursun.
                </div>
              )}
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
                    bscscan'de bu TX'i aç <ExternalLink className="size-2.5" />
                  </a>
                ) : (
                  "0x ile başlayan 66 karakter (32 byte hex)"
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                İletişim (opsiyonel)
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Telegram: @kullaniciadin · veya email · veya boş bırak"
                disabled={verifying}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <p className="text-[11px] text-muted-foreground">
                Sadece sorun olursa sana ulaşmamız için. Zorunlu değil — kod ekranda
                çıkar.
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
              disabled={verifying || !txHash.trim() || !info?.configured}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-3 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> BscScan kontrol ediliyor…
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" /> Doğrula ve davet kodumu üret
                </>
              )}
            </button>
          </form>
        </section>

        {/* Step 3: Sonra ne olacak */}
        <section className="rounded-xl border border-border bg-card/30 p-5">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-3xl font-bold text-emerald-400">③</span>
            <div>
              <h2 className="font-semibold text-lg">Hesap aç</h2>
              <p className="text-xs text-muted-foreground">
                Kodun hazır olduğunda <Link href="/auth/signup" className="underline">
                buradan</Link>{" "}
                hesap aç. Kullanıcı adı + parola + bu davet kodu = 30 gün erişim.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center text-xs text-muted-foreground py-4">
          Sorunla karşılaşırsan{" "}
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Telegram'dan ulaş
          </a>
          .
        </div>
      </main>
    </div>
  );
}
