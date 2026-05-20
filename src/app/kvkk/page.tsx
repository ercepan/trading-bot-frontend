"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Database, Eye, Trash2, Mail } from "lucide-react";

function Section({
  num,
  title,
  icon: Icon,
  children,
}: {
  num: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-8 space-y-4">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.28em] shrink-0">
          {num}
        </span>
        <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight inline-flex items-baseline gap-2">
          {Icon && <Icon className="size-4 text-emerald-400/80 self-center" />}
          {title}
        </h2>
      </div>
      <div className="text-sm text-white/65 leading-relaxed space-y-3 pl-0 md:pl-12">
        {children}
      </div>
    </section>
  );
}

export default function KvkkPage() {
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
            <ShieldCheck className="size-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              Yasal · KVKK Aydınlatma
            </span>
          </div>
          <h1
            className="font-display font-medium tracking-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
          >
            Veri{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              koruma.
            </em>
          </h1>
          <p className="font-mono text-[10px] text-white/45 uppercase tracking-[0.18em]">
            6698 sayılı Kanun · Son güncelleme Nisan 2026
          </p>
        </div>

        <Section num="01" title="Veri Sorumlusu">
          <p>
            Bu platform (bundan sonra <strong className="text-white/85">"Platform"</strong>) bireysel olarak işletilmektedir. Kişisel verilerinizin işlenmesinden 6698 sayılı Kanun anlamında{" "}
            <strong className="text-white/85">veri sorumlusu</strong> platform sahibidir.
          </p>
          <p>İletişim için Telegram veya admin panel üzerinden bağlantıya geçebilirsiniz.</p>
        </Section>

        <Section num="02" title="Toplanan Kişisel Veriler" icon={Database}>
          <p>Platform, sadece hizmet sunabilmek için gerekli minimum veriyi toplar:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 marker:text-emerald-400/60">
            <li>
              <strong className="text-white/85">Kullanıcı adı</strong> — hesabınızı tanımlamak için
            </li>
            <li>
              <strong className="text-white/85">Şifre (hash'li)</strong> — bcrypt ile geri döndürülemez şekilde saklanır
            </li>
            <li>
              <strong className="text-white/85">Cihaz kimliği (UUID)</strong> — tek-cihaz aboneliğini garanti etmek için (cihazda lokal üretilir, fingerprint değildir)
            </li>
            <li>
              <strong className="text-white/85">Davet kodu kullanım kaydı</strong> — hangi kodun kim tarafından, ne zaman kullanıldığı
            </li>
            <li>
              <strong className="text-white/85">Son giriş zamanı + IP adresi</strong> — abuse tespiti için (90 gün sonra otomatik silinir)
            </li>
            <li>
              <strong className="text-white/85">E-posta</strong> — opsiyonel, bildirim ve parola sıfırlama için
            </li>
          </ul>
          <p className="pt-2">
            <strong className="text-white/85">Toplanmayan veriler:</strong> telefon numarası, T.C. kimlik no, banka/kredi kartı bilgisi, konum, biyometrik veri, fotoğraf, sosyal medya hesapları.
          </p>
        </Section>

        <Section num="03" title="İşleme Amaçları">
          <ul className="list-disc list-inside space-y-1.5 pl-2 marker:text-emerald-400/60">
            <li>Kullanıcı kimlik doğrulaması ve oturum yönetimi</li>
            <li>1 aylık abonelik süresinin takibi</li>
            <li>Tek-cihaz politikasının teknik olarak uygulanması</li>
            <li>Davet kodu kötüye kullanımının önlenmesi</li>
            <li>Brute-force / spam saldırılarının engellenmesi</li>
            <li>İstatistiksel raporlama (anonim, agregeli)</li>
          </ul>
        </Section>

        <Section num="04" title="Üçüncü Taraflarla Paylaşım">
          <p>
            Kişisel verileriniz <strong className="text-white/85">hiçbir durumda</strong> üçüncü taraflarla satılmaz, kiralanmaz, reklam amacıyla paylaşılmaz.
          </p>
          <p>
            Hizmetin sunulabilmesi için aşağıdaki teknik altyapı sağlayıcıları tarafından sınırlı kapsamlı veri işleme yapılır. Bu sağlayıcıların kendi gizlilik politikaları geçerlidir:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 marker:text-emerald-400/60">
            <li>
              <strong className="text-white/85">Railway</strong> (ABD) — Backend sunucu hosting, veritabanı (SQLite).{" "}
              <a href="https://railway.app/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline-offset-2 hover:underline">privacy policy ↗</a>
            </li>
            <li>
              <strong className="text-white/85">Vercel</strong> (ABD) — Frontend hosting + edge cache.{" "}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline-offset-2 hover:underline">privacy policy ↗</a>
            </li>
            <li>
              <strong className="text-white/85">Cloudflare</strong> (ABD) — DNS, CDN, DDoS koruması, bot filtreleme.{" "}
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline-offset-2 hover:underline">privacy policy ↗</a>
            </li>
            <li>
              <strong className="text-white/85">Telegram</strong> — Yalnızca admin bildirimleri ve abonelik bitiş uyarıları.{" "}
              <a href="https://telegram.org/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline-offset-2 hover:underline">privacy policy ↗</a>
            </li>
            <li>
              <strong className="text-white/85">BscScan</strong> (Etherscan, ABD) — USDT BEP-20 ödeme doğrulaması için public blockchain TX kontrolü.
            </li>
            <li>
              <strong className="text-white/85">MEXC / Binance</strong> — Kripto alım-satım API'leri. Sadece admin hesap işlemleri için kullanılır.
            </li>
          </ul>
          <p className="pt-1">
            Bu sağlayıcıların hiçbiri yatırım danışmanlığı yapmaz, tavsiye vermez. KVKK kapsamında veri yurt dışına aktarımı için Kişisel Verileri Koruma Kurumu tarafından öngörülen tedbirler (sözleşmesel güvenceler) uygulanır.
          </p>
          <p>
            Yasal yükümlülük gereği (mahkeme kararı, SPK/MASAK talebi) yetkili merciler talep ettiğinde paylaşım zorunlu olabilir.
          </p>
        </Section>

        <Section num="05" title="Saklama Süresi">
          <ul className="list-disc list-inside space-y-1.5 pl-2 marker:text-emerald-400/60">
            <li>
              <strong className="text-white/85">Kullanıcı hesap bilgileri:</strong> aktif abonelik + 12 ay arşiv
            </li>
            <li>
              <strong className="text-white/85">Trade istatistikleri:</strong> kullanıcı silinene kadar
            </li>
            <li>
              <strong className="text-white/85">IP + login zamanı:</strong> 90 gün
            </li>
            <li>
              <strong className="text-white/85">Davet kodu kullanım kaydı:</strong> kalıcı (denetim için)
            </li>
            <li>
              <strong className="text-white/85">DB yedekleri:</strong> Telegram admin chat'inde 30 günlük rotasyonla
            </li>
          </ul>
        </Section>

        <Section num="06" title="Veri Sahibi Hakları (KVKK Md. 11)" icon={Eye}>
          <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 marker:text-emerald-400/60">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içi/yurt dışı aktarıldığı tarafları bilme</li>
            <li>Eksik/yanlış işlenmişse düzeltilmesini isteme</li>
            <li>
              <strong className="text-white/85">Silinmesini veya yok edilmesini isteme</strong> (hesap silme = tüm verilerin kalıcı silinmesi)
            </li>
            <li>İşlemenin sebebinin ortadan kalkması halinde itiraz hakkı</li>
            <li>Zarar görülmesi halinde tazminat talep etme</li>
          </ul>
          <p className="pt-2">
            Bu haklarınızı kullanmak için Telegram üzerinden veya kayıtlı kullanıcı adınızla admin panele başvurabilirsiniz. Talepler{" "}
            <strong className="text-white/85">30 gün içinde</strong> ücretsiz olarak karşılanır.
          </p>
        </Section>

        <Section num="07" title="Hesap & Veri Silme" icon={Trash2}>
          <p>
            Hesabınızı silmek istediğinizde tüm verileriniz (kullanıcı kaydı, abonelik, trade istatistikleri, oturum logları){" "}
            <strong className="text-white/85">7 gün içinde</strong> tüm sistemlerden (canlı DB + yedekler) silinir.
          </p>
          <p>Silme talebi için Telegram üzerinden bağlantıya geçin. Geri alınamaz.</p>
        </Section>

        <Section num="08" title="Çerezler (Cookies)">
          <p>
            Platform çerez kullanmaz. Sadece tarayıcı{" "}
            <strong className="text-white/85">localStorage</strong>'da oturum token'ı ve cihaz UUID'si saklanır. Bu veriler 3. taraflara gönderilmez.
          </p>
        </Section>

        <Section num="09" title="Güvenlik Önlemleri">
          <ul className="list-disc list-inside space-y-1.5 pl-2 marker:text-emerald-400/60">
            <li>Şifreler bcrypt ile hash'lenir (rainbow table'a karşı dirençli)</li>
            <li>Oturum token'ı JWT, 30 günde bir yenilenir</li>
            <li>HTTPS zorunlu (TLS 1.2+)</li>
            <li>Login endpoint'inde rate-limit (5 deneme/dk)</li>
            <li>Tek-cihaz politikası (paylaşımlı hesap kullanımının engellenmesi)</li>
            <li>DB günlük yedeklenir (Telegram admin chat'i)</li>
          </ul>
        </Section>

        {/* İletişim blockquote */}
        <div className="border-l-2 border-amber-500/40 bg-amber-500/[0.04] pl-5 py-4 pr-5 space-y-2">
          <div className="flex items-center gap-3">
            <Mail className="size-3.5 text-amber-400" />
            <span className="font-mono text-[11px] text-amber-300 uppercase tracking-[0.28em]">
              İletişim & Şikâyet
            </span>
          </div>
          <p className="text-sm text-white/75 leading-relaxed">
            KVKK kapsamında haklarınızı kullanmak veya şikâyetleriniz için: Telegram üzerinden bağlantıya geçin. Şikâyetiniz çözüme kavuşmazsa{" "}
            <a
              href="https://www.kvkk.gov.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline-offset-2 hover:underline"
            >
              Kişisel Verileri Koruma Kurumu'na (kvkk.gov.tr)
            </a>{" "}
            başvurabilirsiniz.
          </p>
        </div>

        <div className="font-mono text-[10px] text-white/35 uppercase tracking-[0.22em] text-center pt-2">
          Bu metni okuyup anladığınızı kabul ederek hesap oluşturmuş sayılırsınız ·{" "}
          <Link href="/terms" className="text-emerald-400 hover:underline">
            Kullanım Şartları
          </Link>
        </div>
      </div>
    </div>
  );
}
