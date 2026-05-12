"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  Loader2,
  ArrowRight,
  Mail,
  AlertCircle,
} from "lucide-react";
import { NexoraLogo } from "@/components/nexora-logo";
import { API_BASE } from "@/lib/api";

type OrderStatus = {
  ok: boolean;
  status: "pending" | "paid_pending" | "activated" | "orphan";
  plan_id: string;
  amount_try: number;
  code: string | null;
  email: string;
  created_at: string;
  processed_at: string | null;
};

function BasariliInner() {
  const sp = useSearchParams();
  const callbackId =
    sp.get("callback_id") || sp.get("reference") || sp.get("ref") || "";

  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pollAttempts, setPollAttempts] = useState(0);

  async function fetchOrder() {
    if (!callbackId) {
      setLoading(false);
      setErr("Sipariş referansı bulunamadı");
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/api/billing/shopier/order/${callbackId}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setErr(data.detail || "Sipariş bulunamadı");
      } else {
        setOrder(data);
      }
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [callbackId]);

  // Polling — eğer status henüz "activated" değilse 5sn'de bir tekrar dene (webhook gelene kadar)
  useEffect(() => {
    if (!order) return;
    if (order.status === "activated") return;
    if (pollAttempts >= 12) return; // max 60 sn polling
    const t = setTimeout(() => {
      setPollAttempts((n) => n + 1);
      fetchOrder();
    }, 5000);
    return () => clearTimeout(t);
  }, [order, pollAttempts]);

  function copyCode() {
    if (!order?.code) return;
    navigator.clipboard.writeText(order.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <NexoraLogo className="size-8" />
            <div>
              <div className="font-bold text-white">NEXORA</div>
              <div className="text-[10px] text-emerald-400 font-mono tracking-widest">
                ÖDEME SONUCU
              </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="size-8 text-emerald-400 animate-spin" />
            <p className="text-white/60 text-sm">Sipariş durumu kontrol ediliyor...</p>
          </div>
        ) : err ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center space-y-3">
            <AlertCircle className="size-10 text-red-400 mx-auto" />
            <h2 className="text-lg font-semibold text-white">Sipariş bulunamadı</h2>
            <p className="text-sm text-white/60">{err}</p>
            <p className="text-xs text-white/40">
              Ödeme yaptıysan ama burada görünmüyorsa, davet kodu email'ine yollanmış
              olabilir. Lütfen email'ini kontrol et veya{" "}
              <a href="mailto:iletisim@nexora-trading.net" className="underline">
                iletisim@nexora-trading.net
              </a>
              'a yaz.
            </p>
          </div>
        ) : order?.status === "activated" && order.code ? (
          // SUCCESS — davet kodunu göster
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                <CheckCircle2 className="size-10 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">Ödeme alındı! 🎉</h1>
              <p className="text-white/70">
                <b>₺{order.amount_try.toLocaleString("tr-TR")}</b> tutarındaki ödemen
                onaylandı.
              </p>
            </div>

            <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-6 space-y-3">
              <div className="text-xs text-emerald-300 uppercase tracking-widest text-center">
                Davet kodun
              </div>
              <div className="font-mono text-2xl text-white text-center break-all bg-black/40 py-4 rounded-md border border-white/10">
                {order.code}
              </div>
              <button
                onClick={copyCode}
                className="w-full rounded-md bg-white/10 hover:bg-white/20 text-white text-sm py-2.5 flex items-center justify-center gap-2"
              >
                <Copy className="size-4" />
                {copied ? "Kopyalandı ✓" : "Kodu kopyala"}
              </button>
              <div className="flex items-center gap-2 text-xs text-emerald-300 justify-center pt-2 border-t border-emerald-500/20">
                <Mail className="size-3" />
                Aynı kod <b>{order.email}</b> adresine de yollandı
              </div>
            </div>

            <Link
              href={`/auth/signup?code=${order.code}`}
              className="block w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3.5 text-center flex items-center justify-center gap-2"
            >
              Şimdi hesabımı aç <ArrowRight className="size-4" />
            </Link>

            <div className="text-center text-xs text-white/40">
              Kodun 30 gün geçerli. Hesap açtıktan sonra 30 günlük abonelik başlar.
            </div>
          </div>
        ) : (
          // PENDING — webhook henüz gelmedi
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center space-y-3">
            <Loader2 className="size-10 text-amber-400 mx-auto animate-spin" />
            <h2 className="text-lg font-semibold text-white">Ödemen işleniyor...</h2>
            <p className="text-sm text-white/70">
              Shopier ödemeni teyit ediyor. Bu birkaç saniye sürebilir.
            </p>
            <p className="text-xs text-white/40 pt-2">
              Otomatik olarak güncellenecek. Eğer 1 dakika içinde sonuç gelmezse{" "}
              <button
                onClick={() => fetchOrder()}
                className="underline text-amber-300"
              >
                tekrar dene
              </button>
              .
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function BasariliPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <Loader2 className="size-6 text-white/40 animate-spin" />
        </div>
      }
    >
      <BasariliInner />
    </Suspense>
  );
}
