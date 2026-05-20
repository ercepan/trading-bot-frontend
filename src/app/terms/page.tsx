"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle, Shield } from "lucide-react";

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-8 space-y-4">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.28em] shrink-0">
          {num}
        </span>
        <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight">
          {title}
        </h2>
      </div>
      <div className="text-sm text-white/65 leading-relaxed space-y-3 pl-0 md:pl-12">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden py-12 px-4">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full bg-emerald-500/[0.05] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <Link
          href="/"
          className="font-mono text-[11px] text-white/45 hover:text-emerald-300 uppercase tracking-[0.22em] inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Ana sayfa
        </Link>

        {/* Hero */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Shield className="size-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              Yasal · Kullanım Şartları
            </span>
          </div>
          <h1
            className="font-display font-medium tracking-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
          >
            Kullanım{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              şartları.
            </em>
          </h1>
          <p className="font-mono text-[10px] text-white/45 uppercase tracking-[0.18em]">
            SPK bilgilendirmesi · Son güncelleme Nisan 2026
          </p>
        </div>

        {/* SPK uyarı blockquote */}
        <div className="border-l-2 border-amber-500/40 bg-amber-500/[0.04] pl-5 py-4 pr-5 space-y-2">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-3.5 text-amber-400" />
            <span className="font-mono text-[11px] text-amber-300 uppercase tracking-[0.28em]">
              Önemli Uyarı
            </span>
          </div>
          <p className="text-sm text-white/75 leading-relaxed">
            Bu platform <strong className="text-amber-300">yatırım danışmanlığı</strong> hizmeti sunmamaktadır. Tüm bilgiler
            genel bilgilendirme amaçlıdır ve <strong className="text-amber-300">yatırım tavsiyesi</strong> olarak değerlendirilemez.
          </p>
        </div>

        <Section num="01" title="Genel Hükümler">
          <p>
            Bu platform (bundan sonra <strong className="text-white/85">"Platform"</strong>) hisse senedi, kripto para ve
            türev araçlar üzerinden yapılan piyasa analizleri, sentiment skorları,
            otomatik strateji üretimi ve backtest sonuçları sunan{" "}
            <strong className="text-white/85">bilgi servisi</strong> niteliğindedir.
          </p>
          <p>
            Platform, Sermaye Piyasası Kurulu'ndan (SPK) yatırım danışmanlığı
            lisansı almamış olup, hiçbir kullanıcıya{" "}
            <strong className="text-white/85">bireyselleştirilmiş yatırım önerisi</strong>{" "}
            sunmamaktadır.
          </p>
        </Section>

        <Section num="02" title="Yatırım Tavsiyesi Niteliği Taşımaz">
          <p>Platform'da yer alan tüm içerikler — özellikle:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 marker:text-emerald-400/60">
            <li>BIST100 ve ABD hisse sentiment analizleri</li>
            <li>WSB Reddit topluluk verileri</li>
            <li>Stock Signals (BUY / SELL / HOLD önerileri)</li>
            <li>Strategy Lab AI-üretimi backtest sonuçları</li>
            <li>Telegram bildirimleri ve günlük özetler</li>
            <li>Crypto otomatik trade tier'ları</li>
          </ul>
          <p>
            <strong className="text-amber-300">
              yatırım danışmanlığı veya yatırım tavsiyesi niteliğinde değildir.
            </strong>{" "}
            Sadece referans bilgi olarak kullanılmalı, yatırım kararları
            tarafınızca bağımsız olarak verilmelidir.
          </p>
        </Section>

        <Section num="03" title="Risk Bildirimi">
          <p>
            Hisse senedi, kripto para, türev araçlar (futures, vadeli işlemler,
            opsiyonlar) ve diğer finansal enstrümanlar{" "}
            <strong className="text-amber-300">yüksek risk</strong> içerir. Aşağıdaki risklerin farkında olarak işlem yapmalısınız:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 marker:text-emerald-400/60">
            <li>
              Yatırdığınız sermayenin{" "}
              <strong className="text-white/85">tamamını veya bir kısmını</strong>{" "}
              kaybedebilirsiniz
            </li>
            <li>Kaldıraçlı (leveraged) işlemler, yatırdığınızdan daha fazla kayba yol açabilir</li>
            <li>Kripto piyasaları regülasyona tabi olmayan, yüksek volatilite içeren bir piyasadır</li>
            <li>
              Geçmiş performans (backtest dahil),{" "}
              <strong className="text-white/85">gelecekteki sonuçların garantisi değildir</strong>
            </li>
            <li>
              Otomatik trade sistemleri (bot) teknik arızalar, gecikmeler veya yanlış sinyaller nedeniyle beklenmedik kayıplara yol açabilir
            </li>
          </ul>
        </Section>

        <Section num="04" title="Sorumluluk Reddi">
          <p>
            Platform yöneticisi/sahibi, kullanıcının Platform'da sunulan bilgileri
            kullanarak aldığı yatırım kararları sonucunda oluşan{" "}
            <strong className="text-white/85">doğrudan veya dolaylı zararlardan sorumlu tutulamaz</strong>.
          </p>
          <p>
            Üçüncü taraf veri sağlayıcılarından (yfinance, FinnHub, APE Wisdom,
            KAP, Reddit vb.) gelen bilgilerin doğruluğu, güncelliği veya güvenilirliği garanti edilmez.
          </p>
          <p>
            Bot tarafından üretilen otomatik trade sinyalleri, strateji önerileri ve sentiment analizleri{" "}
            <strong className="text-white/85">kullanıcının kendi sorumluluğunda</strong>{" "}
            değerlendirilmelidir.
          </p>
        </Section>

        <Section num="05" title="Lisanslı Danışman Önerisi">
          <p>
            Önemli yatırım kararları vermeden önce SPK lisanslı bir yatırım
            danışmanına veya finansal müşavire başvurmanız önerilir.
          </p>
          <p>
            SPK lisanslı kuruluş ve danışman listesine{" "}
            <a
              href="https://www.spk.gov.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline-offset-2 hover:underline"
            >
              spk.gov.tr
            </a>{" "}
            üzerinden erişebilirsiniz.
          </p>
        </Section>

        <Section num="06" title="Abonelik ve Ödeme">
          <p>
            Platform 1 aylık abonelik modeli ile çalışır. Davet kodu (invitation code) ile kayıt olunduğunda 30 gün boyunca hizmetten faydalanılır.
          </p>
          <p>
            Kodlar tek-kullanımlık ve cihaz bağımlıdır. İade politikası bulunmamaktadır.
          </p>
        </Section>

        <Section num="07" title="Kabul">
          <p>
            Bu Platform'a kayıt olarak veya kullanarak, yukarıdaki şartların tamamını okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz.
          </p>
        </Section>

        <div className="font-mono text-[10px] text-white/35 uppercase tracking-[0.22em] text-center pt-6">
          Sorularınız için iletişim sayfasından ulaşabilirsiniz
        </div>
      </div>
    </div>
  );
}
