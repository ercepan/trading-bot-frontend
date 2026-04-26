"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowLeft className="size-4" /> Ana sayfa
        </Link>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Shield className="size-7" /> Kullanım Şartları & SPK Bilgilendirmesi
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Son güncelleme: Nisan 2026
          </p>
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong className="text-amber-400">ÖNEMLİ UYARI:</strong> Bu platform
                yatırım danışmanlığı hizmeti sunmamaktadır. Tüm bilgiler genel
                bilgilendirme amaçlıdır ve yatırım tavsiyesi olarak değerlendirilemez.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Genel Hükümler</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Bu platform (bundan sonra "Platform") hisse senedi, kripto para ve
              türev araçlar üzerinden yapılan piyasa analizleri, sentiment skorları,
              otomatik strateji üretimi ve backtest sonuçları sunan{" "}
              <strong className="text-foreground">bilgi servisi</strong> niteliğindedir.
            </p>
            <p>
              Platform, Sermaye Piyasası Kurulu'ndan (SPK) yatırım danışmanlığı
              lisansı almamış olup, hiçbir kullanıcıya{" "}
              <strong className="text-foreground">
                bireyselleştirilmiş yatırım önerisi
              </strong>{" "}
              sunmamaktadır.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Yatırım Tavsiyesi Niteliği Taşımaz</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Platform'da yer alan tüm içerikler — özellikle:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>BIST100 ve ABD hisse sentiment analizleri</li>
              <li>WSB Reddit topluluk verileri</li>
              <li>Stock Signals (BUY / SELL / HOLD önerileri)</li>
              <li>Strategy Lab AI-üretimi backtest sonuçları</li>
              <li>Telegram bildirimleri ve günlük özetler</li>
              <li>Crypto otomatik trade tier'ları</li>
            </ul>
            <p>
              <strong className="text-foreground">
                yatırım danışmanlığı veya yatırım tavsiyesi niteliğinde değildir.
              </strong>{" "}
              Sadece referans bilgi olarak kullanılmalı, yatırım kararları
              tarafınızca bağımsız olarak verilmelidir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Risk Bildirimi</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Hisse senedi, kripto para, türev araçlar (futures, vadeli işlemler,
              opsiyonlar) ve diğer finansal enstrümanlar{" "}
              <strong className="text-foreground">yüksek risk</strong> içerir.
              Aşağıdaki risklerin farkında olarak işlem yapmalısınız:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                Yatırdığınız sermayenin{" "}
                <strong className="text-foreground">tamamını veya bir kısmını</strong>{" "}
                kaybedebilirsiniz
              </li>
              <li>
                Kaldıraçlı (leveraged) işlemler, yatırdığınızdan daha fazla kayba yol
                açabilir
              </li>
              <li>
                Kripto piyasaları regülasyona tabi olmayan, yüksek volatilite içeren
                bir piyasadır
              </li>
              <li>
                Geçmiş performans (backtest dahil),{" "}
                <strong className="text-foreground">
                  gelecekteki sonuçların garantisi değildir
                </strong>
              </li>
              <li>
                Otomatik trade sistemleri (bot) teknik arızalar, gecikmeler veya
                yanlış sinyaller nedeniyle beklenmedik kayıplara yol açabilir
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Sorumluluk Reddi</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Platform yöneticisi/sahibi, kullanıcının Platform'da sunulan bilgileri
              kullanarak aldığı yatırım kararları sonucunda oluşan{" "}
              <strong className="text-foreground">
                doğrudan veya dolaylı zararlardan sorumlu tutulamaz
              </strong>
              .
            </p>
            <p>
              Üçüncü taraf veri sağlayıcılarından (yfinance, FinnHub, APE Wisdom,
              KAP, Reddit vb.) gelen bilgilerin doğruluğu, güncelliği veya
              güvenilirliği garanti edilmez.
            </p>
            <p>
              Bot tarafından üretilen otomatik trade sinyalleri, strateji önerileri
              ve sentiment analizleri{" "}
              <strong className="text-foreground">
                kullanıcının kendi sorumluluğunda
              </strong>{" "}
              değerlendirilmelidir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Lisanslı Danışman Önerisi</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
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
                className="underline hover:text-foreground"
              >
                spk.gov.tr
              </a>{" "}
              üzerinden erişebilirsiniz.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Abonelik ve Ödeme</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Platform 1 aylık abonelik modeli ile çalışır. Davet kodu (invitation
              code) ile kayıt olunduğunda 30 gün boyunca hizmetten faydalanılır.
            </p>
            <p>
              Kodlar tek-kullanımlık ve cihaz bağımlıdır. İade politikası
              bulunmamaktadır.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Kabul</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Bu Platform'a kayıt olarak veya kullanarak, yukarıdaki şartların
              tamamını okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz.
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground py-4">
          Sorularınız için: yöneticiyle iletişime geçin.
        </div>
      </div>
    </div>
  );
}
