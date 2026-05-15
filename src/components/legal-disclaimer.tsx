import { AlertTriangle } from "lucide-react";

/**
 * SPK uyumu için zorunlu yasal uyarı bandı.
 * Tüm sinyal / radar / bot performans sayfalarında gösterilmeli.
 */
export function LegalDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[11px] leading-relaxed text-amber-200/80">
        <AlertTriangle className="size-3.5 mt-0.5 shrink-0 text-amber-400" />
        <span>
          <strong>Yatırım tavsiyesi değildir.</strong> Bu sayfadaki sinyaller
          bilgilendirme amaçlıdır. Geçmiş performans gelecek getiriyi garanti etmez,
          yüksek kayıp riski vardır. Tüm işlem kararlarınızı kendiniz alırsınız.
        </span>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-relaxed text-amber-200/90">
      <div className="flex items-start gap-3">
        <AlertTriangle className="size-5 mt-0.5 shrink-0 text-amber-400" />
        <div className="space-y-2">
          <div className="font-semibold text-amber-300">
            ⚠️ Yatırım Tavsiyesi Değildir
          </div>
          <p>
            Nexora&apos;daki sinyaller, BIST/kripto radarı, bot performansı ve
            tüm içerikler bilgilendirme amaçlıdır.{" "}
            <strong>SPK lisanslı bir yatırım danışmanlığı değildir.</strong>{" "}
            Geçmiş performans gelecek getiriyi garanti etmez. Tüm işlemler
            yüksek risk taşır ve anaparanın tamamen kaybedilmesi mümkündür.
            Yatırım kararlarınızı kendi sorumluluğunuzda alırsınız.
          </p>
        </div>
      </div>
    </div>
  );
}
