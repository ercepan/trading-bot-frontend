"use client";

import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";
import { NexoraLogo } from "@/components/nexora-logo";

export default function IptalPage() {
  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <NexoraLogo className="size-8" />
            <div>
              <div className="font-bold text-white">NEXORA</div>
              <div className="text-[10px] text-white/40 font-mono tracking-widest">
                ÖDEME İPTAL
              </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-white/5 border border-white/10">
            <XCircle className="size-10 text-white/40" />
          </div>
          <h1 className="text-2xl font-bold text-white">Ödeme tamamlanmadı</h1>
          <p className="text-white/60 text-sm">
            Ödeme akışını iptal ettin veya bir aksaklık yaşandı. Hesabından hiçbir tutar
            çekilmedi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
            <Link
              href="/odeme"
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3"
            >
              Tekrar dene
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-white/20 hover:bg-white/5 text-white px-6 py-3 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="size-4" /> Ana sayfa
            </Link>
          </div>
          <p className="text-xs text-white/40 pt-4">
            Sorun yaşıyorsan{" "}
            <a
              href="mailto:iletisim@nexora-trading.net"
              className="underline hover:text-white"
            >
              iletisim@nexora-trading.net
            </a>
            'a yaz.
          </p>
        </div>
      </main>
    </div>
  );
}
