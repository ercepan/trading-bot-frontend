"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

const STORAGE_KEY = "tb_spk_acknowledged_at";
const TTL_HOURS = 24;

/**
 * SPK uyarı modalı — login sonrası 24 saatte bir gösterilir.
 * Kullanıcı "Anladım" tıklayınca bir sonraki gösterime kadar kapanır.
 */
export function SpkDisclaimerModal({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!visible) {
      setOpen(false);
      return;
    }
    const last = localStorage.getItem(STORAGE_KEY);
    if (!last) {
      setOpen(true);
      return;
    }
    const lastDate = new Date(last);
    const hoursSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60);
    if (hoursSince > TTL_HOURS) {
      setOpen(true);
    }
  }, [visible]);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background border border-border rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-2xl my-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">SPK Bilgilendirmesi</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Yatırım yapmadan önce dikkatle okuyun
            </p>
          </div>
        </div>

        <div className="text-sm space-y-2.5 text-muted-foreground leading-relaxed">
          <p>
            Bu platformda yer alan tüm bilgiler{" "}
            <strong className="text-foreground">
              yatırım danışmanlığı veya yatırım tavsiyesi niteliğinde değildir
            </strong>
            . Sadece bilgilendirme amaçlıdır.
          </p>
          <p>
            Hisse senedi, kripto para ve türev araçlar yüksek risk içerir.{" "}
            <strong className="text-foreground">
              Yatırdığınız sermayenin tamamını veya bir kısmını kaybedebilirsiniz
            </strong>
            . Geçmiş performans, gelecekteki sonuçların garantisi değildir.
          </p>
          <p>
            Bu sitede gösterilen sinyaller, sentiment analizleri, otomatik strateji
            önerileri ve backtest sonuçları{" "}
            <strong className="text-foreground">
              yatırım kararı vermeden önce kendi araştırmanızı yapmanız ve gerekli
              hallerde lisanslı bir yatırım danışmanına başvurmanız gereken
              referans bilgilerdir
            </strong>
            .
          </p>
          <p>
            Kullanıcı, bu platformda yer alan bilgileri kullanarak aldığı kararların
            sonuçlarından{" "}
            <strong className="text-foreground">tamamen kendisinin sorumlu olduğunu</strong>{" "}
            kabul eder. Sermaye Piyasası Kurulu'nun (SPK) yatırım danışmanlığı
            mevzuatı kapsamında bu platform, yatırım danışmanlığı hizmeti
            sunmamaktadır.
          </p>
        </div>

        <div className="pt-2 border-t border-border/50 flex items-center justify-end gap-2">
          <button
            onClick={accept}
            className="rounded-md bg-primary text-primary-foreground px-6 py-2 text-sm font-medium hover:bg-primary/90"
          >
            Okudum, anladım
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Footer'da kalıcı küçük not.
 */
export function SpkFooterNote() {
  return (
    <div className="text-[10px] text-muted-foreground/70 text-center py-2 border-t border-border/30">
      ⚠️ Yatırım tavsiyesi değildir. SPK mevzuatı kapsamında yatırım danışmanlığı
      hizmeti sunulmamaktadır.{" "}
      <a href="/terms" className="underline hover:text-muted-foreground">
        Detay
      </a>
    </div>
  );
}
