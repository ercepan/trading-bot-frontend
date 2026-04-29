"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, Database, Eye, Trash2, Mail } from "lucide-react";

export default function KvkkPage() {
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
            <ShieldCheck className="size-7" /> KVKK Aydınlatma Metni
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme.
            <br />
            Son güncelleme: Nisan 2026
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Veri Sorumlusu</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Bu platform (bundan sonra <strong>"Platform"</strong>) bireysel olarak
              işletilmektedir. Kişisel verilerinizin işlenmesinden 6698 sayılı
              Kanun anlamında <strong className="text-foreground">veri sorumlusu</strong>{" "}
              platform sahibidir.
            </p>
            <p>
              İletişim için Telegram veya admin panel üzerinden bağlantıya
              geçebilirsiniz.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5" /> 2. Toplanan Kişisel Veriler
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>Platform, sadece hizmet sunabilmek için gerekli minimum veriyi toplar:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong className="text-foreground">Kullanıcı adı</strong> — hesabınızı
                tanımlamak için (e-posta toplanmaz)
              </li>
              <li>
                <strong className="text-foreground">Şifre (hash'li)</strong> — bcrypt
                ile geri döndürülemez şekilde saklanır
              </li>
              <li>
                <strong className="text-foreground">Cihaz kimliği (UUID)</strong> —
                tek-cihaz aboneliğini garanti etmek için (cihazda lokal üretilir, fingerprint değildir)
              </li>
              <li>
                <strong className="text-foreground">Davet kodu kullanım kaydı</strong> —
                hangi kodun kim tarafından, ne zaman kullanıldığı
              </li>
              <li>
                <strong className="text-foreground">Son giriş zamanı + IP adresi</strong>{" "}
                — abuse tespiti için (90 gün sonra otomatik silinir)
              </li>
            </ul>
            <p className="pt-2">
              <strong className="text-foreground">Toplanmayan veriler:</strong> e-posta
              adresi, telefon numarası, T.C. kimlik no, banka/kredi kartı bilgisi,
              konum, biyometrik veri, fotoğraf, sosyal medya hesapları.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. İşleme Amaçları</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Kullanıcı kimlik doğrulaması ve oturum yönetimi</li>
              <li>1 aylık abonelik süresinin takibi</li>
              <li>Tek-cihaz politikasının teknik olarak uygulanması</li>
              <li>Davet kodu kötüye kullanımının önlenmesi</li>
              <li>Brute-force / spam saldırılarının engellenmesi</li>
              <li>İstatistiksel raporlama (anonim, agregeli)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Üçüncü Taraflarla Paylaşım</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Kişisel verileriniz <strong className="text-foreground">hiçbir
              durumda</strong> üçüncü taraflarla satılmaz, kiralanmaz, reklam amacıyla
              paylaşılmaz.
            </p>
            <p>
              Hizmetin sunulabilmesi için aşağıdaki teknik altyapı sağlayıcıları
              tarafından sınırlı kapsamlı veri işleme yapılır. Bu sağlayıcıların kendi
              gizlilik politikaları geçerlidir:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong className="text-foreground">Railway</strong> (ABD) — Backend
                sunucu hosting, veritabanı (SQLite). Kullanıcı kaydı + işlemleri saklar.
                <a
                  href="https://railway.app/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline hover:text-foreground inline-flex items-center gap-0.5"
                >
                  privacy policy ↗
                </a>
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> (ABD) — Frontend
                hosting + edge cache. Sayfa çağrı log'ları (IP, user-agent) 30 gün
                tutulur.
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline hover:text-foreground inline-flex items-center gap-0.5"
                >
                  privacy policy ↗
                </a>
              </li>
              <li>
                <strong className="text-foreground">Cloudflare</strong> (ABD) — DNS,
                CDN, DDoS koruması, bot filtreleme. IP bazlı log'lar 7-30 gün tutulur.
                <a
                  href="https://www.cloudflare.com/privacypolicy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline hover:text-foreground inline-flex items-center gap-0.5"
                >
                  privacy policy ↗
                </a>
              </li>
              <li>
                <strong className="text-foreground">Telegram</strong> — Yalnızca admin
                bildirimleri ve abonelik bitiş uyarıları. Kullanıcı verisi paylaşılmaz.
                <a
                  href="https://telegram.org/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline hover:text-foreground inline-flex items-center gap-0.5"
                >
                  privacy policy ↗
                </a>
              </li>
              <li>
                <strong className="text-foreground">BscScan</strong> (Etherscan, ABD) —
                USDT BEP-20 ödeme doğrulaması için public blockchain TX kontrolü.
                Yalnızca TX hash gönderilir (kişisel veri yok).
              </li>
              <li>
                <strong className="text-foreground">MEXC / Binance</strong> — Kripto
                alım-satım API'leri. Sadece admin hesap işlemleri için kullanılır;
                abonelerin verisi gönderilmez.
              </li>
            </ul>
            <p className="pt-1">
              Bu sağlayıcıların hiçbiri yatırım danışmanlığı yapmaz, tavsiye vermez. KVKK
              kapsamında veri yurt dışına aktarımı için Kişisel Verileri Koruma Kurumu
              tarafından öngörülen tedbirler (sözleşmesel güvenceler) uygulanır.
            </p>
            <p>
              Yasal yükümlülük gereği (mahkeme kararı, SPK/MASAK talebi) yetkili
              merciler talep ettiğinde paylaşım zorunlu olabilir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Saklama Süresi</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong className="text-foreground">Kullanıcı hesap bilgileri:</strong>{" "}
                aktif abonelik + 12 ay arşiv
              </li>
              <li>
                <strong className="text-foreground">Trade istatistikleri:</strong>{" "}
                kullanıcı silinene kadar
              </li>
              <li>
                <strong className="text-foreground">IP + login zamanı:</strong> 90 gün
              </li>
              <li>
                <strong className="text-foreground">Davet kodu kullanım kaydı:</strong>{" "}
                kalıcı (denetim için)
              </li>
              <li>
                <strong className="text-foreground">DB yedekleri:</strong> Telegram
                admin chat'inde 30 günlük rotasyonla
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-5" /> 6. Veri Sahibi Hakları (KVKK Md. 11)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içi/yurt dışı aktarıldığı tarafları bilme</li>
              <li>Eksik/yanlış işlenmişse düzeltilmesini isteme</li>
              <li>
                <strong className="text-foreground">
                  Silinmesini veya yok edilmesini isteme
                </strong>{" "}
                (hesap silme = tüm verilerin kalıcı silinmesi)
              </li>
              <li>İşlemenin sebebinin ortadan kalkması halinde itiraz hakkı</li>
              <li>Zarar görülmesi halinde tazminat talep etme</li>
            </ul>
            <p className="pt-2">
              Bu haklarınızı kullanmak için Telegram üzerinden veya kayıtlı kullanıcı
              adınızla admin panele başvurabilirsiniz. Talepler{" "}
              <strong className="text-foreground">30 gün içinde</strong> ücretsiz olarak
              karşılanır.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="size-5" /> 7. Hesap & Veri Silme
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Hesabınızı silmek istediğinizde tüm verileriniz (kullanıcı kaydı, abonelik,
              trade istatistikleri, oturum logları) <strong className="text-foreground">7 gün
              içinde</strong> tüm sistemlerden (canlı DB + yedekler) silinir.
            </p>
            <p>
              Silme talebi için Telegram üzerinden bağlantıya geçin. Geri alınamaz.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Çerezler (Cookies)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Platform çerez kullanmaz. Sadece tarayıcı{" "}
              <strong className="text-foreground">localStorage</strong>'da oturum token'ı
              ve cihaz UUID'si saklanır. Bu veriler 3. taraflara gönderilmez.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Güvenlik Önlemleri</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground leading-relaxed">
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Şifreler bcrypt ile hash'lenir (rainbow table'a karşı dirençli)</li>
              <li>Oturum token'ı JWT, 30 günde bir yenilenir</li>
              <li>HTTPS zorunlu (TLS 1.2+)</li>
              <li>Login endpoint'inde rate-limit (5 deneme/dk)</li>
              <li>Tek-cihaz politikası (paylaşımlı hesap kullanımının engellenmesi)</li>
              <li>DB günlük yedeklenir (Telegram admin chat'i)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Mail className="size-5" /> İletişim & Şikâyet
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              KVKK kapsamında haklarınızı kullanmak veya şikâyetleriniz için: Telegram
              üzerinden bağlantıya geçin. Şikâyetiniz çözüme kavuşmazsa{" "}
              <a
                href="https://www.kvkk.gov.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Kişisel Verileri Koruma Kurumu'na (kvkk.gov.tr)
              </a>{" "}
              başvurabilirsiniz.
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground py-4">
          Bu metni okuyup anladığınızı kabul ederek hesap oluşturmuş sayılırsınız.
          <br />
          <Link href="/terms" className="underline hover:text-foreground">
            Kullanım Şartları & SPK Bilgilendirmesi
          </Link>
        </div>
      </div>
    </div>
  );
}
