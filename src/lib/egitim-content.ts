/**
 * Nexora Eğitim Seti — kapsamlı içerik
 *
 * Kategoriler:
 *  TA      = Teknik Analiz
 *  RISK    = Risk Yönetimi
 *  BIST    = Borsa İstanbul / Hisse senedi
 *  KRIPTO  = Kripto para
 *  PSY     = Psikoloji
 */

export type LessonCategory = "TA" | "RISK" | "BIST" | "KRIPTO" | "PSY";

export type LessonSection = {
  heading: string;
  body: string;        // serbest metin (yeni satır = paragraf)
  example?: string;    // somut örnek
  tip?: string;        // ipucu kutusu
};

export type Lesson = {
  id: string;
  category: LessonCategory;
  title: string;
  subtitle: string;
  duration: string;     // "8 dk okuma"
  level: "Başlangıç" | "Orta" | "İleri";
  sections: LessonSection[];
};

export const LESSON_CATEGORIES: { id: LessonCategory; label: string; emoji: string }[] = [
  { id: "TA",     label: "Teknik Analiz",   emoji: "📊" },
  { id: "RISK",   label: "Risk Yönetimi",   emoji: "🛡" },
  { id: "BIST",   label: "Türk Borsası",    emoji: "🇹🇷" },
  { id: "KRIPTO", label: "Kripto",          emoji: "₿" },
  { id: "PSY",    label: "Psikoloji",       emoji: "🧠" },
];

export const LESSONS: Lesson[] = [
  // ═══════════════════════════════════════════════════════════════════════
  //  1. MUM (CANDLESTICK) OKUMA
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "mum-okuma",
    category: "TA",
    title: "Mum (Candlestick) Okuma — En Temel Beceri",
    subtitle: "Bir mum, bir saatlik (ya da 4 saatlik, günlük…) fiyat hareketinin özetidir.",
    duration: "7 dk okuma",
    level: "Başlangıç",
    sections: [
      {
        heading: "Mum nedir?",
        body:
          "Bir mum 4 değerden oluşur: AÇILIŞ, KAPANIŞ, EN YÜKSEK, EN DÜŞÜK.\n\n" +
          "Yeşil mum: kapanış açılıştan yüksek (alıcılar kazandı).\n" +
          "Kırmızı mum: kapanış açılıştan düşük (satıcılar kazandı).\n\n" +
          "Mumun gövdesi açılış ile kapanış arası, fitiller (üst-alt çizgiler) en yüksek ve en düşük noktayı gösterir.",
        example:
          "$THYAO 4 saatlik grafikte:\n• Açılış: 320 TL\n• Kapanış: 332 TL\n• En yüksek: 335 TL\n• En düşük: 318 TL\n→ Yeşil mum, gövdesi 12 TL, üst fitili 3 TL, alt fitili 2 TL.",
        tip:
          "Uzun gövde + kısa fitil = güçlü trend. Kısa gövde + uzun fitil = kararsızlık (bekle).",
      },
      {
        heading: "Önemli mum desenleri",
        body:
          "DOJI: gövdesi neredeyse yok. Açılış ≈ kapanış. Karar verilmedi, tepe/dip dönüşü olabilir.\n\n" +
          "ÇEKİÇ (HAMMER): küçük gövde + uzun alt fitil. Düşüşte → dip dönüşü işareti.\n\n" +
          "YUTAN (ENGULFING): bir önceki mumun gövdesini tamamen örten yeni mum. Trend dönüşünün güçlü sinyali.\n\n" +
          "VURUŞ (PIN BAR): uzun fitil + ufak gövde. Reddedilen seviye, ters yöne hareket beklenir.",
        tip:
          "Tek mumla işlem yapma. Her zaman önceki 2-3 mumla beraber yorumla.",
      },
      {
        heading: "Zaman dilimi seçimi",
        body:
          "1 dakikalık: gürültü çok, scalper için. Yeni başlayan kullanmasın.\n" +
          "1 saatlik: gün içi trade için iyi.\n" +
          "4 saatlik: swing trader için ideal — gürültü az, trend net.\n" +
          "Günlük: pozisyon traderı, haftalarca tutar.\n\n" +
          "BIST için günde 1 kez (günlük mum) bakmak başlangıç için yeterlidir.",
        tip:
          "Önce büyük zaman dilimine bak (haftalık/günlük) trend'i gör, sonra küçük zaman dilimine in (4h/1h) giriş ara.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  2. TREND, DESTEK, DİRENÇ
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "trend-destek-direnc",
    category: "TA",
    title: "Trend · Destek · Direnç — TA'nın 3 Direği",
    subtitle: "Bu üç kavramı bilmeden grafiğe bakma. Her şey buradan başlar.",
    duration: "8 dk okuma",
    level: "Başlangıç",
    sections: [
      {
        heading: "Trend nedir?",
        body:
          "Trend, fiyatın genel yönüdür. 3 çeşit:\n\n" +
          "• Yükseliş trendi (uptrend): her dip bir öncekinden daha yüksek, her tepe daha yüksek.\n" +
          "• Düşüş trendi (downtrend): her tepe bir öncekinden daha düşük, her dip daha düşük.\n" +
          "• Yatay (sideways): fiyat bir kanalda zikzak yapıyor, yön yok.\n\n" +
          "Kural: trendin yönüne işlem yap. Yükselişte AL, düşüşte UZAK DUR (ya da short).",
        tip:
          "Trend dostundur. Düşüşte 'şimdi dipten almalıyım' demek başlangıç hatasının başlangıcıdır.",
      },
      {
        heading: "Destek nedir?",
        body:
          "Destek, fiyatın düşerken birkaç kez geri dönüp yükseldiği seviyedir.\n" +
          "Alıcıların 'burası ucuz' deyip topladığı yer.\n\n" +
          "Nasıl bulunur: grafiğe bak, fiyat 2-3 kez aynı seviyeden 'sekiyor' mu? O seviye destektir.\n\n" +
          "Önemli: destek kırıldığı zaman → DİRENÇ olur (rol değişimi).",
        example:
          "$ASELS 95 TL'de 4 ayrı tarihte sekti, asla altına inmedi. → 95 TL güçlü destek.\n" +
          "Eğer bir gün 95'in altına inip orada kapanırsa, sonraki tepkide 95 artık direnç olur (alıcılar tuzakta).",
      },
      {
        heading: "Direnç nedir?",
        body:
          "Direnç, fiyatın yükselirken birkaç kez geri dönüp düştüğü seviyedir.\n" +
          "Satıcıların 'burası pahalı' deyip sattığı yer.\n\n" +
          "Direnç kırılınca → DESTEK olur. Bu kırılım gerçekleştiğinde momentum artar.",
        example:
          "$THYAO 320 TL'de defalarca durdu, geri çekildi. 320 = direnç.\n" +
          "Bir gün volume'le 320'yi geçti ve 332'de kapandı → 320 artık destek.",
        tip:
          "Direnç kırılımı için iki kontrol: (1) volume normalin üstünde mi? (2) günlük kapanış kırılımın üstünde mi? İkisi de ✓ ise gerçek kırılım.",
      },
      {
        heading: "Trend çizgisi nasıl çekilir",
        body:
          "Yükseliş trendinde → en az 2 dip noktasını birleştir, çizgiyi uzat. Bu çizgi gelecekteki destek olur.\n\n" +
          "Düşüş trendinde → en az 2 tepe noktasını birleştir. Bu çizgi gelecekteki direnç olur.\n\n" +
          "Çizgiyi 3 noktayla (üç farklı tarihte) test edersen 'geçerli' kabul edilir.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  3. EMA / HAREKETLİ ORTALAMA
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "hareketli-ortalama",
    category: "TA",
    title: "Hareketli Ortalama (EMA/SMA) — Trend Filtresi",
    subtitle: "En basit, en güçlü indikatör. Profesyonellerin %80'i kullanır.",
    duration: "6 dk okuma",
    level: "Başlangıç",
    sections: [
      {
        heading: "SMA vs EMA",
        body:
          "SMA (Simple Moving Average): son N mumun ortalama kapanışı.\n" +
          "EMA (Exponential Moving Average): son N mumun ortalaması, ama yakın mumlara daha çok ağırlık verir.\n\n" +
          "Trader'ların çoğu EMA kullanır — son fiyata daha hızlı tepki verir.",
      },
      {
        heading: "En çok kullanılan EMA değerleri",
        body:
          "EMA 20: kısa vadeli trend\n" +
          "EMA 50: orta vadeli trend (en kritik)\n" +
          "EMA 200: uzun vadeli trend (kurumsal yatırımcı bakar)\n\n" +
          "Kural: fiyat EMA 200'ün üstündeyse → uzun vadeli yükseliş.\n" +
          "Fiyat EMA 50'nin üstündeyse → orta vadeli yükseliş.\n" +
          "Her ikisi de altında → düşüş, alma.",
        tip:
          "Uzun vadeli yatırım için: sadece EMA 200 üstündeki hisselere bak. Bu tek kural seni %50 hatadan kurtarır.",
      },
      {
        heading: "Golden Cross & Death Cross",
        body:
          "GOLDEN CROSS (Altın Kesişim): EMA 50 yukarı doğru EMA 200'ü kestiği an. Güçlü AL sinyali.\n\n" +
          "DEATH CROSS (Ölüm Kesişimi): EMA 50 aşağı doğru EMA 200'ü kestiği an. Çıkış / SAT sinyali.\n\n" +
          "Bu sinyaller geç gelir ama çok güvenilir — yıllık trend dönüşlerini yakalar.",
        example:
          "Bitcoin 2020 Mayıs: golden cross → sonraki 18 ayda 6x yükseliş.\n" +
          "Bitcoin 2022 Ocak: death cross → sonraki 11 ayda %75 düşüş.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  4. RSI
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "rsi",
    category: "TA",
    title: "RSI (Göreceli Güç Endeksi) — Aşırı Alım/Satım",
    subtitle: "0-100 arası bir sayı. Hisse 'aşırı alındı' mı yoksa 'aşırı satıldı' mı söyler.",
    duration: "5 dk okuma",
    level: "Başlangıç",
    sections: [
      {
        heading: "RSI nedir, nasıl yorumlanır?",
        body:
          "RSI, son 14 mum içindeki kazanç/kayıp oranından hesaplanır. Sonuç 0-100 arasıdır.\n\n" +
          "RSI > 70 → aşırı alım (overbought). Hisse çok hızlı yükselmiş, geri çekilme yakın.\n" +
          "RSI < 30 → aşırı satım (oversold). Hisse çok hızlı düşmüş, sıçrama yakın.\n" +
          "RSI 40-60 → nötr, trend devam.",
        tip:
          "RSI 70 üstü olunca hemen sat, 30 altı olunca hemen al ZIRRA değildir. Trend güçlüyse RSI haftalarca 80'de kalabilir.",
      },
      {
        heading: "Uyumsuzluk (Divergence)",
        body:
          "RSI'ın en güçlü kullanımı UYUMSUZLUK aramaktır:\n\n" +
          "• Fiyat yeni tepe yapıyor, RSI yeni tepe yapamıyor → BEARISH divergence (yükseliş bitebilir).\n" +
          "• Fiyat yeni dip yapıyor, RSI yeni dip yapamıyor → BULLISH divergence (düşüş bitebilir).\n\n" +
          "Bu sinyal trend dönüşünü genelde haber çıkmadan önce verir.",
        example:
          "$BTC Kasım 2021: fiyat 69.000 dolar yeni tepe, RSI 70'in altında.\n" +
          "Bearish divergence → 6 ay sonra 17.000 dolara düşüş.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  5. MACD
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "macd",
    category: "TA",
    title: "MACD — Momentum Lensi",
    subtitle: "İki EMA'nın farkı. Trend dönüşlerini erken yakalar.",
    duration: "6 dk okuma",
    level: "Orta",
    sections: [
      {
        heading: "MACD nedir?",
        body:
          "MACD (Moving Average Convergence Divergence) 3 parçadan oluşur:\n\n" +
          "1. MACD çizgisi = EMA12 − EMA26\n" +
          "2. Sinyal çizgisi = MACD'nin EMA9'u\n" +
          "3. Histogram = MACD − Sinyal (bar şeklinde)\n\n" +
          "Çoğu zaman histograma bakmak yeter — bar büyüyorsa momentum güçleniyor, küçülüyorsa zayıflıyor.",
      },
      {
        heading: "AL / SAT sinyalleri",
        body:
          "AL: MACD çizgisi sinyal çizgisini yukarı doğru keser (histogram negatiften pozitife geçer).\n" +
          "SAT: MACD çizgisi sinyal çizgisini aşağı doğru keser (histogram pozitiften negatife geçer).\n\n" +
          "Sıfır çizgisi de önemli:\n" +
          "• MACD > 0 → uzun vadeli yükseliş trendi\n" +
          "• MACD < 0 → uzun vadeli düşüş trendi",
        tip:
          "MACD tek başına değil, EMA 50 ile beraber kullan. Fiyat EMA50 üstünde + MACD AL kesişimi → güçlü AL sinyali.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  6. RİSK YÖNETİMİ
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "risk-yonetimi",
    category: "RISK",
    title: "Risk Yönetimi — Para Kazanmanın Tek Kuralı",
    subtitle: "İyi trade fikrin yoksa iflasla 'ucuz' kurtulursun. Risk kontrolü yoksa kurtulamazsın.",
    duration: "10 dk okuma",
    level: "Başlangıç",
    sections: [
      {
        heading: "%1 kuralı (en önemli kural)",
        body:
          "Her trade'de toplam paranın MAX %1'ini riske at.\n\n" +
          "Eğer 100.000 TL'n varsa → tek trade'de en fazla 1.000 TL kaybetmeyi göze al.\n" +
          "Bu demek değil 1.000 TL'lik pozisyon — bu demek 'bu pozisyon stop'a takılırsa 1.000 TL kaybım olur'.",
        example:
          "Sermaye: 50.000 TL → max risk: 500 TL/trade\n" +
          "Hisse: ASELS 100 TL'den alındı, stop 95 TL'ye konuldu (5 TL risk her hissede)\n" +
          "Pozisyon büyüklüğü: 500 TL ÷ 5 TL = 100 hisse → 10.000 TL'lik pozisyon\n\n" +
          "Stop'a takılırsa: 100 hisse × 5 TL = 500 TL kayıp (hedef bu).",
        tip:
          "Acemiler tüm parayla pozisyon açar, kaybedince intikam için 2x büyük açar. 5 trade'de iflasın garanti reçetesi.",
      },
      {
        heading: "Stop-loss neden şart?",
        body:
          "Stop-loss = otomatik satış emri. Fiyat belli seviyeye düşerse pozisyonu otomatik kapatır.\n\n" +
          "Niye şart:\n" +
          "1. Duygusallık devre dışı kalır ('biraz daha bekleyeyim' tuzağı).\n" +
          "2. Maximum kayıp önceden belli, hesaplanabilir.\n" +
          "3. Uyurken bile koruma var.\n\n" +
          "Stop koymadan trade açmak = freni olmayan arabayla otobana çıkmak.",
        tip:
          "Stop'u nereye koyacağına ENTRY öncesi karar ver. Pozisyon açıldıktan sonra duygusal kararlar başlar.",
      },
      {
        heading: "Risk/Ödül oranı (R:R)",
        body:
          "Her trade'de iki seviye belirle:\n" +
          "• Stop seviyesi (kayıp limiti)\n" +
          "• Hedef seviye (kâr alma)\n\n" +
          "R:R = (Hedef − Giriş) / (Giriş − Stop)\n\n" +
          "Minimum 1:2 oranıyla işlem yap (kayıp 100 ise hedef en az 200).\n" +
          "İdeal 1:3 ve üstü.",
        example:
          "Giriş: 100 TL\n" +
          "Stop: 95 TL (5 TL risk)\n" +
          "Hedef: 115 TL (15 TL kâr)\n" +
          "R:R = 1:3 ✓ kabul edilir.",
        tip:
          "1:2 R:R ile %40 isabet oranıyla bile karda kalırsın matematiksel olarak.",
      },
      {
        heading: "Position sizing — kaç hisse alacağım?",
        body:
          "Formül:\n" +
          "Pozisyon büyüklüğü = (Sermaye × %1) ÷ (Giriş − Stop)\n\n" +
          "Bu formülü her trade'de uygula. Hisseye duygusal bağlanma.",
        example:
          "Sermaye 100.000 TL, %1 risk = 1.000 TL\n" +
          "$THYAO giriş 320, stop 305 (15 TL risk)\n" +
          "Pozisyon: 1.000 ÷ 15 = 66 hisse → 21.120 TL'lik pozisyon",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  7. BIST TEMELLERİ
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "bist-temelleri",
    category: "BIST",
    title: "BIST Nasıl Çalışır?",
    subtitle: "Türk borsasının kuralları, açılış-kapanış, lot, takas takvimi.",
    duration: "8 dk okuma",
    level: "Başlangıç",
    sections: [
      {
        heading: "BIST seansları",
        body:
          "Açılış seansı: 09:55-10:00 (eşleşme)\n" +
          "Sürekli işlem: 10:00-13:00\n" +
          "Öğle arası: 13:00-14:00\n" +
          "Sürekli işlem: 14:00-18:00\n" +
          "Kapanış: 18:00\n\n" +
          "Cumartesi-Pazar kapalı, milli bayramlarda da kapalı.\n\n" +
          "İlk yarım saat (10:00-10:30) ve son yarım saat (17:30-18:00) volatilite en yüksek. Acemi olarak bu saatleri evite et.",
      },
      {
        heading: "Lot, kademe, devre kesici",
        body:
          "LOT: alım-satım birimi. Çoğu hissede 1 lot = 1 hisse.\n\n" +
          "KADEME: minimum fiyat değişim aralığı.\n" +
          "• 0-10 TL → kademe 0.01 TL\n" +
          "• 10-100 TL → kademe 0.02 TL  \n" +
          "• 100+ TL → kademe 0.05 TL\n\n" +
          "DEVRE KESİCİ: fiyat günde %20 oynayınca seans yarım saat durur. %30 olunca o gün için kapanır.",
      },
      {
        heading: "Endeksler — BIST 30, 100, 50",
        body:
          "BIST 100: ana endeks, 100 büyük şirket. Ortalama performansı temsil eder.\n" +
          "BIST 30: en likit 30 şirket. Yabancı yatırımcı buralarda işler.\n" +
          "BIST 50: 50 şirket, orta segment.\n\n" +
          "Bir hisse alırken 'BIST 100 endeksinde mi?' kontrolü yap. Endekste değilse likidite düşük olabilir.",
        tip:
          "Yeni başlayan: sadece BIST 30 hisselerini al. En az manipülasyon, en yüksek likidite.",
      },
      {
        heading: "Takas — para ne zaman elde",
        body:
          "BIST'te takas T+2:\n" +
          "• Pazartesi sat → Çarşamba para hesapta.\n" +
          "• Cuma sat → Salı para hesapta.\n\n" +
          "Bu süre içinde paranı çekemezsin (ama yeni hisse alabilirsin — block hesap olduğu sürece).",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  8. BİLANÇO OKUMA
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "bilanco-okuma",
    category: "BIST",
    title: "Bilanço Okuma — Hisse Almadan Önce",
    subtitle: "Ne almam gerekir, neyden uzak durmam gerekir? Bilanço söyler.",
    duration: "12 dk okuma",
    level: "Orta",
    sections: [
      {
        heading: "F/K oranı (P/E)",
        body:
          "F/K = Hisse fiyatı / Hisse başına net kâr (yıllık)\n\n" +
          "Anlam: 'şirket bugünkü kârıyla kendisini kaç yılda öder?'\n\n" +
          "F/K 5: 5 yılda öder, ucuz.\n" +
          "F/K 15: ortalama.\n" +
          "F/K 30+: pahalı (büyüme bekleniyor).\n\n" +
          "BIST ortalaması ~8-12. F/K 30+ olan hissede risk yüksek.",
        tip:
          "Sektör bazlı karşılaştır. Bankacılık F/K 4-7 normaldir, teknoloji F/K 25-40 normaldir.",
      },
      {
        heading: "PD/DD (P/B) — Piyasa değeri / Defter değeri",
        body:
          "Şirketin tüm varlıkları satılıp borçları ödense kalan = defter değeri.\n\n" +
          "PD/DD < 1: hisse 'defter' değerinin altında. Ya çok ucuz ya batık.\n" +
          "PD/DD 1-2: değer hisse karakteri.\n" +
          "PD/DD 3+: büyüme hissesi (gelecek beklentisi yüksek).",
        example:
          "Bir banka PD/DD 0.6 ile işlem görüyor → ya inanılmaz ucuz, ya batma riski var. Detay incelersin.",
      },
      {
        heading: "ROE (Özsermaye Karlılığı)",
        body:
          "ROE = Net kâr / Özsermaye\n\n" +
          "Şirket öz parasıyla ne kadar kazanıyor? Yıllık %.\n\n" +
          "%5 altı: zayıf, sermaye israf.\n" +
          "%10-20: sağlıklı.\n" +
          "%20+: çok iyi (ama kontrol et — borçla şişirilmiş olabilir).",
        tip:
          "ROE'yi her zaman 'borç/özsermaye' ile beraber bak. ROE %30 ama borç/özsermaye 5:1 ise, ROE şişirme.",
      },
      {
        heading: "Net kâr marjı",
        body:
          "Net kâr / Toplam ciro\n\n" +
          "%5 altı: kar marjı düşük, fiyat baskısı altında.\n" +
          "%10-15: ortalama.\n" +
          "%20+: monopol veya markası güçlü.",
      },
      {
        heading: "Borç / Özsermaye oranı",
        body:
          "1'den küçük: sağlıklı.\n" +
          "1-2: orta seviye risk.\n" +
          "2-3: dikkatli ol, faiz oranları yükselince zorlanır.\n" +
          "3+: agresif, durgunlukta batma riski.\n\n" +
          "İstisna: bankalar (kredi vermek üzerine kurulu). Bankaları farklı kriterle değerlendir.",
      },
      {
        heading: "FAVÖK (EBITDA)",
        body:
          "Faiz, vergi, amortisman ve itfa öncesi kâr.\n" +
          "Şirketin 'temel' iş performansı. Muhasebe oyunlarından arınmış.\n\n" +
          "FAVÖK büyüme oranına bak — eğer 3 yıldır artıyor ise, sağlıklı şirket.",
      },
      {
        heading: "Kontrol listesi (5 dakikada)",
        body:
          "Yeni bir hisse incelerken sırayla bak:\n\n" +
          "1. F/K < 15 mi?\n" +
          "2. PD/DD < 3 mi?\n" +
          "3. ROE > %15 mi?\n" +
          "4. Borç/özsermaye < 2 mi?\n" +
          "5. Son 3 yılda gelir büyüyor mu?\n" +
          "6. Net kâr marjı düşmüyor mu?\n" +
          "7. Sektör pozitif mi?\n\n" +
          "5+ '✓' varsa incelemeye değer. 4 ve altı varsa pas geç.",
        tip:
          "BIST'te bu kontroller için Yatirimkurumu, Kap.org.tr, Tradingview ücretsiz kullanılabilir.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  9. HİSSE SEÇİMİ
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "hisse-secimi",
    category: "BIST",
    title: "Hisse Seçim Stratejisi — Ne Alalım?",
    subtitle: "Üç farklı yaklaşım: Değer, büyüme ve temettü.",
    duration: "10 dk okuma",
    level: "Orta",
    sections: [
      {
        heading: "Değer yatırımı (Buffett tarzı)",
        body:
          "İlke: 'Bir banknotun yarı fiyatına satıldığını gördün mü, al.'\n\n" +
          "Bul:\n" +
          "• Gerçek değerinin altında işlem gören şirket\n" +
          "• Kalıcı rekabet avantajı (marka, monopol, ölçek)\n" +
          "• Düşük borç\n" +
          "• İstikrarlı kâr\n\n" +
          "BIST'te değer hisse örnekleri: bankalar (krizden sonra), enerji, perakende devleri.",
        example:
          "$AKBNK 2018-2019 krizinde PD/DD 0.4'e indi (defter değerinin %40'ı). Sonraki 3 yılda 4x yükseldi.",
      },
      {
        heading: "Büyüme yatırımı (Lynch tarzı)",
        body:
          "İlke: 'Hızlı büyüyen şirketleri bul, ileri zaman çarpanını ödemekten çekinme.'\n\n" +
          "Bul:\n" +
          "• Yıllık %20+ gelir büyümesi\n" +
          "• Yeni pazara giren veya inovasyon\n" +
          "• F/K yüksek olabilir (gelecek için)\n\n" +
          "Risk: büyüme yavaşlarsa hisse sert düşer (F/K compresion).",
        example:
          "BIST teknoloji hisseleri 2020-2021: F/K 50+ ile işlem gördü. 2022'de %60-80 düştüler büyüme yavaşlayınca.",
      },
      {
        heading: "Temettü yatırımı (pasif gelir)",
        body:
          "İlke: 'Düzenli nakit kazandıran hisseler topla, dönüşü bekleme.'\n\n" +
          "Bul:\n" +
          "• Düzenli temettü dağıtan (5+ yıl kesintisiz)\n" +
          "• Temettü verimi %5-10 arası\n" +
          "• Ödeme oranı (payout ratio) %30-60 arası (sürdürülebilir)\n\n" +
          "BIST'te uygun: bankalar, enerji şirketleri, demir-çelik.",
        tip:
          "Temettü verimi %15+ ise dikkat — şirket nakdi 'tükeniyor' olabilir. Sürdürülemezse ileride keser.",
      },
      {
        heading: "Sektör rotasyonu",
        body:
          "Ekonomik döngünün hangi aşamasındayız? Ona göre sektör seç.\n\n" +
          "RESESYON DİBİ: emlak, otomotiv, lüks ürünler (resesyondan çıkarken patlar)\n" +
          "BÜYÜME: teknoloji, sanayi, ihracat\n" +
          "ENFLASYON YÜKSEK: enerji, emtia, bankalar\n" +
          "DURGUNLUK: defansif (tüketim, sağlık, telekom)\n\n" +
          "TR 2024-2025 örnek: yüksek enflasyon → bankalar, savunma sanayisi pozitif.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  10. KRİPTO TEMELLERİ
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "kripto-temelleri",
    category: "KRIPTO",
    title: "Kripto Temelleri — BTC, ETH, Altcoin'ler",
    subtitle: "On binlerce coin var. %95'i 5 yıl içinde sıfır olur. Doğru olanları seçmek için temel bilgi.",
    duration: "12 dk okuma",
    level: "Başlangıç",
    sections: [
      {
        heading: "Bitcoin (BTC)",
        body:
          "Maksimum arz: 21 milyon. Asla artmaz.\n\n" +
          "'Dijital altın' diye bilinir. Devletler, şirketler, fonlar tutar.\n\n" +
          "Halving: her 4 yılda bir madenci ödülü yarıya düşer. Tarihsel olarak halving sonrası 12-18 ay içinde fiyat 5-10x patladı.",
      },
      {
        heading: "Ethereum (ETH)",
        body:
          "İkinci en büyük kripto. 'Akıllı kontrat' platformu — DeFi, NFT, oyunların altyapısı.\n\n" +
          "BTC'den farkı: arz sınırlı değil ama 'staking + yakım' mekanizması ile deflasyonist olabiliyor.\n\n" +
          "ETH ile BTC arasındaki oran (ETH/BTC) trend gösterir:\n" +
          "• ETH/BTC yükseliyor → 'altseason' yakın, küçük coin'ler patlayabilir\n" +
          "• ETH/BTC düşüyor → 'BTC dominansı', sermaye Bitcoin'e gidiyor",
      },
      {
        heading: "Altcoin'ler — riskli ama büyük getiri",
        body:
          "Altcoin = BTC dışındaki tüm kriptolar. Binlerce var.\n\n" +
          "Kategoriler:\n" +
          "• Layer 1 (Solana, Avalanche, Cardano): blockchain altyapı\n" +
          "• DeFi (Uniswap, Aave, Curve): finansal protokoller\n" +
          "• Oracles (Chainlink): blockchain'e dış veri sağlar\n" +
          "• Meme coin'ler (Dogecoin, PEPE): büyük spekülatif hareket\n\n" +
          "Risk: %95'i 3-5 yıl içinde değer kaybeder veya kaybolur. Sadece total kripto pozisyonunun %20'sini altcoin'e ayır.",
        tip:
          "Yeni başlayan: %70 BTC + %30 ETH ile başla. Altcoin'lere sermaye %5'i geçtiğinde başlama.",
      },
      {
        heading: "Önemli metrikler",
        body:
          "MARKET CAP = fiyat × dolaşımdaki arz. Coin'in 'büyüklüğü'.\n" +
          "FDV (Fully Diluted Valuation) = fiyat × maksimum arz. Tüm coin'ler dolaşımda olsa kaç ederdi.\n\n" +
          "TVL (Total Value Locked) = DeFi protokollerine kilitli para. Protokol sağlığı.\n\n" +
          "BTC DOMINANCE = BTC market cap / tüm kripto market cap. %50 üstünde → BTC'ye sermaye akışı.",
      },
      {
        heading: "Kripto döngüleri (cycle)",
        body:
          "Tarihsel olarak BTC ~4 yıllık döngü:\n" +
          "1. ACCUMULATION (dip): -70-90% düşüş bitti, kimse bakmıyor.\n" +
          "2. STEALTH BULL: yavaş yavaş yükselir, kimse fark etmez.\n" +
          "3. MAINSTREAM BULL: medya konuşur, FOMO başlar, parabolik yükseliş.\n" +
          "4. DISTRIBUTION (tepe): maksimum optimizm, herkes 'milyoner' olacağını düşünür.\n" +
          "5. BEAR (düşüş): -70-90%.\n\n" +
          "En tehlikeli aşama 4. Maksimum risk, herkes alır. En kazançlı aşama 1-2.",
        tip:
          "Halving tarihlerini takip et:\n" +
          "• 2012, 2016, 2020 (öncesinde TEPE oluştu sonraki yıl)\n" +
          "• 2024 → muhtemelen 2025 sonu / 2026 başı tepe",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  11. SENTİMENT ANALİZİ
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "sentiment-analizi",
    category: "TA",
    title: "Sentiment Analizi — Piyasa Duygusu",
    subtitle: "Fiyat-grafik dışında ek katman. Haber, sosyal medya ne diyor?",
    duration: "8 dk okuma",
    level: "Orta",
    sections: [
      {
        heading: "Sentiment nedir?",
        body:
          "Piyasa katılımcılarının 'genel duygu durumu'.\n\n" +
          "Pozitif sentiment: çoğunluk iyimser, alım yapıyor.\n" +
          "Negatif sentiment: kötümser, satış var, korku var.\n\n" +
          "Önemli paradoks: sentiment EXTREME olduğunda piyasa TERSİ yöne hareket eder.\n" +
          "• Herkes 'çok iyi' diyorsa → tepe yakın.\n" +
          "• Herkes 'iflasa gidiyoruz' diyorsa → dip yakın.",
        tip:
          "Warren Buffett: 'Diğerleri açgözlüyken korkmalı, korkuyorken açgözlü olmalı.'",
      },
      {
        heading: "Sentiment'i nasıl ölçeriz?",
        body:
          "Geleneksel:\n" +
          "• Fear & Greed Index (CNN Money / Alternative.me)\n" +
          "• AAII Sentiment Survey\n" +
          "• Put/Call ratio (opsiyon piyasası)\n\n" +
          "Modern (AI tabanlı):\n" +
          "• Haber sentiment skoru (Nexora gibi)\n" +
          "• Twitter/Reddit mention analizi\n" +
          "• On-chain whale hareketleri",
      },
      {
        heading: "Nexora sentiment skoru nasıl çalışır",
        body:
          "Adımlar:\n" +
          "1. AI günlük 50+ finans haberini okur (TR + ENG kaynaklar).\n" +
          "2. Her habere -1 (negatif) ile +1 (pozitif) arası skor verir.\n" +
          "3. Hisse bazlı toplanır → günlük sentiment skoru çıkar.\n\n" +
          "Skor yorumu:\n" +
          "• +0.5+ → güçlü pozitif momentum, alım fırsatı\n" +
          "• 0 ± 0.3 → nötr, beklemede kal\n" +
          "• -0.3 altı → riskli, uzak dur veya short",
      },
      {
        heading: "Sentiment + Teknik = Güçlü combo",
        body:
          "Sentiment tek başına yeterli değildir. Teknik analizle BERABER kullan:\n\n" +
          "✓ Sentiment +0.7 (çok pozitif) + RSI 30 (oversold) → ALIM SİNYALİ (data + teknik align)\n" +
          "✓ Sentiment -0.4 (negatif) + RSI 75 (overbought) → SAT/SHORT SİNYALİ\n" +
          "✗ Sentiment +0.7 + RSI 80 (overbought) → çelişki, dikkatli ol\n" +
          "✗ Sentiment -0.5 + Fiyat all-time-high → uyumsuzluk, manipülasyon riski",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  X1. BOLLINGER BANTLARI
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "bollinger-bands",
    category: "TA",
    title: "Bollinger Bantları — Volatilite Lensi",
    subtitle: "Fiyatın 'ne kadar uzağa gittiğini' ölçen en kullanışlı indikatör.",
    duration: "7 dk okuma",
    level: "Orta",
    sections: [
      {
        heading: "Bollinger nedir?",
        body:
          "3 çizgi: Orta (genelde EMA20), üst bant (orta + 2 standart sapma), alt bant (orta − 2 standart sapma).\n\n" +
          "Yani fiyatın son 20 mumdaki 'oynaklığa' göre dinamik bir koridor çiziyor.\n\n" +
          "Mantık: fiyat kabaca %95 ihtimalle bu koridor içinde kalır. Üst banda yapışırsa 'aşırı yukarı', alt banda yapışırsa 'aşırı aşağı' demek.",
      },
      {
        heading: "3 yorum kuralı",
        body:
          "1. SIKIŞMA (squeeze): bantlar daralır → volatilite düşük → patlama yakın. Yön belli değil ama hareket gelecek.\n\n" +
          "2. GENİŞLEME: bantlar açılır → volatilite yüksek → trend güçlü.\n\n" +
          "3. BANT YÜRÜYÜŞÜ: fiyat ÜST banda yapışıp ilerliyorsa güçlü yükseliş trendi (sat değil!). Alt banda yapışıp ilerliyorsa güçlü düşüş.",
        tip:
          "Yeni başlayanın hatası: fiyat üst bantta diye SAT, alt bantta diye AL. Trend'le birlikte düşün — uptrend'de fiyat üst banda 'yapışır' bu normaldir.",
      },
      {
        heading: "En iyi sinyal: Squeeze + breakout",
        body:
          "Bantlar 20 günün en darı haline gelir → 'sıkışma' modu.\n\n" +
          "Ardından fiyat banttan dışarı çıkar (yukarı veya aşağı) → büyük hareket gelir.\n\n" +
          "Bu pattern özellikle %5-15 günlük hareket için altın.",
        example:
          "$ASELS 90 TL'de 3 hafta sıkışık → bantlar daraldı → bir gün üstten kırıldı + volume 3x artış → sonraki 2 hafta 105 TL'ye gitti (+%17).",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  X2. FIBONACCI RETRACEMENT
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "fibonacci",
    category: "TA",
    title: "Fibonacci Retracement — Geri Çekilme Seviyeleri",
    subtitle: "Bir trend ne kadar geri çekilir? Matematik söyler. %38, %50, %61.8 sihirli sayılar.",
    duration: "8 dk okuma",
    level: "Orta",
    sections: [
      {
        heading: "Fibonacci nedir, niye işe yarar?",
        body:
          "Fibonacci dizisi: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55... (her sayı önceki ikinin toplamı). Bu sayılar arasındaki oran 0.618'e yaklaşır (altın oran).\n\n" +
          "Borsada 'geri çekilme' seviyeleri:\n" +
          "• %23.6 — sığ geri çekilme\n" +
          "• %38.2 — yaygın destek\n" +
          "• %50 — psikolojik orta\n" +
          "• %61.8 — derin geri çekilme (altın oran)\n" +
          "• %78.6 — çok derin (trend tehlikede)\n\n" +
          "Garip ama gerçek: piyasalar bu seviyeleri sürekli respekt eder.",
      },
      {
        heading: "Nasıl çizilir",
        body:
          "TradingView'da Fibonacci aracını seç:\n\n" +
          "Yükseliş trendinde: en son DİP'ten en son TEPE'ye sürükle.\n" +
          "Düşüş trendinde: en son TEPE'den en son DİP'e sürükle.\n\n" +
          "Otomatik 5 yatay çizgi çıkar (%23.6, %38.2, %50, %61.8, %78.6).\n\n" +
          "Trend devam ederken fiyat genelde %38.2 veya %61.8 seviyesinde durup yeni bacağı başlatır.",
        example:
          "$BTC 30K'dan 70K'ya çıktı, sonra geri çekildi.\n" +
          "%38.2 = 54.7K, %50 = 50K, %61.8 = 45.3K\n" +
          "Genelde dipler bu seviyelerde olur. 50K civarında durduysa 'sağlıklı geri çekilme', 45K altına inerse trend bozuldu.",
      },
      {
        heading: "Confluence (üst üste binme)",
        body:
          "Fibonacci'nin gerçek gücü tek başına değil. Başka indikatörle birleşince:\n\n" +
          "✓ Fib %61.8 + EMA 200 + önceki destek aynı seviyede → ÇOK güçlü destek\n" +
          "✓ Fib %38.2 + RSI oversold → büyük ihtimalle bounce alır\n\n" +
          "İki-üç indikatör aynı seviyede 'evet' diyorsa, o seviye 'savaş alanı' — alıcı/satıcı orada karşılaşır.",
        tip:
          "Trade etmeye karar vermeden önce en az 2 farklı sebep bul. Tek başına Fibonacci ile değil — RSI, hacim, EMA gibi başka teyitle.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  X3. PATTERN TANIMA
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "pattern-tanima",
    category: "TA",
    title: "Pattern Tanıma — Grafiğin 5 Klasik Şekli",
    subtitle: "Bir pattern 100 yıldır işliyor — çünkü insan psikolojisi değişmedi.",
    duration: "10 dk okuma",
    level: "Orta",
    sections: [
      {
        heading: "1. Omuz-Baş-Omuz (Head & Shoulders)",
        body:
          "Trend dönüş patterni. Yükseliş trendinin sonunda gözükür → DÜŞÜŞ sinyali.\n\n" +
          "3 tepe: ortadaki (baş) en yüksek, yan ikisi (omuzlar) daha düşük + simetrik.\n\n" +
          "Boyun çizgisi (omuzların altları) kırıldığında pattern teyit olur. Hedef: baştan boyna olan mesafe kadar aşağı.\n\n" +
          "Tersini (Inverse H&S) düşüş trendinde gör → YÜKSELİŞ sinyali.",
        example:
          "BIST 100 grafiği 2018 ortası: omuz 100, baş 110, omuz 102 (sağ). Boyun 95.\n" +
          "Boyun kırıldı → 6 ay sonra 75'e indi (mesafe ~15 puan, hedef tutmuş).",
        tip:
          "%75 başarı oranı var ama YALNIZ omuzlardaki volume azalmalı. Eşit volume ise pattern güvenilmez.",
      },
      {
        heading: "2. Çift Tepe / Çift Dip (Double Top / Bottom)",
        body:
          "Çift Tepe: aynı seviyede 2 tepe + arada bir vadi. Trend dönüşü, DÜŞÜŞ.\n" +
          "Çift Dip: aynı seviyede 2 dip + arada tepe. Trend dönüşü, YÜKSELİŞ.\n\n" +
          "Pattern teyidi: vadiyi/tepeyi geçince. Hedef: tepeden vadiye olan mesafe kadar.\n\n" +
          "Bu en sık görülen pattern — neredeyse her gün bir hisse benzer pattern üretir.",
      },
      {
        heading: "3. Üçgenler (Triangle)",
        body:
          "ÇIKAN üçgen (ascending): yatay direnç + yükselen destek → YÜKSELİŞ kırılımı bekle.\n" +
          "İNEN üçgen (descending): yatay destek + alçalan direnç → DÜŞÜŞ kırılımı.\n" +
          "SİMETRİK üçgen: hem alçalan direnç hem yükselen destek → yön belirsiz, kırıldığı yöne git.\n\n" +
          "Üçgen oluştuğunda volatilite düşer. Kırılım anında volume patlar — bu sinyal.",
        tip:
          "Üçgen tepe noktasının %75'inde kırılım gelir. Daha geç kırılımlar zayıftır.",
      },
      {
        heading: "4. Bayrak / Flama (Flag / Pennant)",
        body:
          "Önce keskin hareket (bayrak direği), sonra dar bir geri çekilme (bayrak gövdesi).\n\n" +
          "Bayrak: paralel kanal, dik açılı.\n" +
          "Flama: küçük üçgen.\n\n" +
          "İki pattern de DEVAM patterni — orijinal hareketin yönünde devam beklenir.\n" +
          "Hedef: bayrak direği uzunluğu kadar.",
        example:
          "$NVDA Q3 2023: 200'den 280'e fırladı (bayrak direği), sonra 270-275 arasında 1 hafta dar zigzag (bayrak), kırılım sonrası 350'ye gitti (~80 puan, direkdeki kadar).",
      },
      {
        heading: "5. Kupa & Kulp (Cup & Handle)",
        body:
          "Bill O'Neil'in en sevdiği pattern, %70+ başarı oranlı.\n\n" +
          "Kupa: yumuşak U şekli, 1-12 ay sürer.\n" +
          "Kulp: kupanın sağ tarafında küçük bir geri çekilme (kulp), genelde Fib %38.2 derinliğinde.\n\n" +
          "Kulp direnç kırılınca → güçlü YÜKSELİŞ. Hedef: kupanın derinliği kadar yukarı.\n\n" +
          "Tüm büyük teknoloji hisseleri bu pattern ile yıllar süren rallye'lere başlamıştır.",
        tip:
          "Kupa düzgün U olmalı, V şeklindeyse zayıf pattern. Yumuşak ve süreli kupa = sağlıklı bottoming.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  X4. FAİZ VE BORSA
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "faiz-borsa",
    category: "BIST",
    title: "Faiz ve Borsa — Türkiye İçin Kritik İlişki",
    subtitle: "Merkez Bankası faiz kararı verdiğinde piyasa neden ya patlar ya da çöker?",
    duration: "10 dk okuma",
    level: "Orta",
    sections: [
      {
        heading: "Faiz nedir, neden önemli?",
        body:
          "TCMB politika faizi → bankalararası faiz → mevduat faizi → kredi faizi → şirket borçlanma maliyeti.\n\n" +
          "Yüksek faiz:\n" +
          "• Şirketler kredi alamaz / aldıkları pahalı\n" +
          "• Borçlu şirketler zorlanır → kar düşer → hisse fiyatı düşer\n" +
          "• Yatırımcı parayı mevduata koymayı tercih eder (risksiz %50 vs riskli %30)\n\n" +
          "Düşük faiz:\n" +
          "• Şirket borçlanması ucuz → büyüme mümkün\n" +
          "• Mevduat çekici değil → para borsaya akar\n" +
          "• Hisseler primlenir",
        tip:
          "Genel kural: Faiz ↑ borsa ↓, Faiz ↓ borsa ↑.\n" +
          "Ama Türkiye'de bu kural birkaç ay gecikme ile çalışıyor — beklentilerin değişimi anlık.",
      },
      {
        heading: "Sektör bazlı faiz hassasiyeti",
        body:
          "Yüksek faizden EN ÇOK ETKİLENEN sektörler:\n" +
          "1. EMLAK + İnşaat (mortgage faizi) — örn. EMNIS, SODSN\n" +
          "2. Otomotiv (taksit kredisi) — TOASO, FROTO\n" +
          "3. Bankacılık (kompleks — net faiz marjı) — GARAN, AKBNK\n" +
          "4. Borçlu sanayi — kalanlar\n\n" +
          "Yüksek faizden FAYDA SAĞLAYAN sektörler:\n" +
          "1. Bankacılık (mevduat-kredi makası açılır) — kısa vadede\n" +
          "2. Sigorta (yatırım gelirleri ↑)\n" +
          "3. Borçsuz değer hisseleri (cash-rich şirketler)\n" +
          "4. Holding'ler (likit varlıkları)",
      },
      {
        heading: "Türkiye özelinde — faiz + USD/TL döngüsü",
        body:
          "TCMB faiz arttırırsa:\n" +
          "Adım 1: TL güçlenir (kısa vadede USD/TL düşer)\n" +
          "Adım 2: İhracatçı şirketler düşüş yaşar (THYAO, ASELS, otomotiv ihraç)\n" +
          "Adım 3: İç tüketim sektörleri zorlanır (perakende, otomotiv)\n" +
          "Adım 4: Borsa genelde aşağı (-%5 ila -%15)\n\n" +
          "TCMB faiz düşürürse:\n" +
          "Adım 1: TL zayıflar (USD/TL yükselir)\n" +
          "Adım 2: İhracatçılar iyi gelir (THYAO, ASELS uçar)\n" +
          "Adım 3: Bankacılık net faiz marjı baskı\n" +
          "Adım 4: Borsa genelde yukarı (+%5 ila +%20)",
        example:
          "Mayıs 2024: TCMB faizi %50'den artırma sinyali → BIST -%12 (1 ay)\n" +
          "Aralık 2024: TCMB faiz indirim başladı → BIST +%18 (2 ay)\n\n" +
          "Faiz toplantısı tarihlerine dikkat et (TCMB websitesinde takvim var).",
      },
      {
        heading: "Beklenti yönetimi — gerçek hareket nereden gelir",
        body:
          "Önemli kural: piyasa BEKLENEN faiz kararına göre fiyatlanır, KARAR günü değil.\n\n" +
          "Eğer 'TCMB %2 artıracak' diye bekleniyor ve %2 arttırıyorsa → fiyat fazla hareket etmez.\n" +
          "Eğer %2 bekleniyor ama %5 arttırırsa → şok, sert hareket.\n" +
          "Eğer %2 bekleniyor ama %0 arttırırsa → şok, ters yön.\n\n" +
          "Bu yüzden 'beklentileri okumak' lazım — anketler, ekonomist tahminleri, futures piyasası.",
        tip:
          "TCMB toplantısından 2-3 gün önce pozisyon almayı düşün. Toplantı saatinde ANI hareket yapma — volatilite çok yüksek, stop-loss tetiklenir.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  12. TRADE PSİKOLOJİSİ
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "trade-psikolojisi",
    category: "PSY",
    title: "Trade Psikolojisi — Asıl Düşman Sensin",
    subtitle: "Trade %20 strateji + %80 disiplin. Disiplin yoksa stratejin işe yaramaz.",
    duration: "8 dk okuma",
    level: "Başlangıç",
    sections: [
      {
        heading: "FOMO — Kaçırma korkusu",
        body:
          "FOMO = Fear Of Missing Out\n\n" +
          "Belirti: Sosyal medyada 'şu coin %50 yaptı' görünce 'BEN DE ALMALIYIM' hissi.\n\n" +
          "Sonuç: tepe noktasına yakın al → düşüşte panik sat → kayıp.\n\n" +
          "Çare: Plan yap, plana sadık kal. Haftalık ne alacağını önceden belirle, plan dışı işlem yapma.",
        tip:
          "Bir şey 'kaçırılmaz fırsat' diye haber olduysa → muhtemelen kaçırıldı. Erken haberin değeri var, geç haberin tuzağı var.",
      },
      {
        heading: "FUD — Korku, belirsizlik, şüphe",
        body:
          "FUD = Fear, Uncertainty, Doubt\n\n" +
          "Belirti: 'Borsa çöküyor', 'Bitcoin sıfır olacak' tipi haberlere kapılıp panik sat.\n\n" +
          "Genelde dipler FUD haberleriyle gelir. 2022 Aralık BTC 16k, herkes 'bitti' dedi → 1 yıl sonra 100k.\n\n" +
          "Çare: Stop-loss'un varsa otomatik korunuyorsun. Plan dışı satma.",
      },
      {
        heading: "Revenge trading — İntikam",
        body:
          "Belirti: Bir trade kaybedince 'kaybımı çıkarmalıyım' hissiyle hemen yeni bir pozisyon, daha büyük büyüklükle.\n\n" +
          "Sonuç: ardışık kayıplar, hesap erir.\n\n" +
          "Çare: Bir trade kaybettiyse o gün ENTRY YAPMA. Ertesi sabah taze kafayla bak.",
        tip:
          "Profesyoneller günde 3+ ardışık kayıp yiyince ekrandan uzaklaşır. Bilek sertleşir, daha sonra yumruk attırılır.",
      },
      {
        heading: "Trade günlüğü — En önemli alışkanlık",
        body:
          "Her trade için yaz:\n" +
          "• Sembol, giriş, stop, hedef\n" +
          "• Niye girdim (3 sebep)\n" +
          "• Niye çıktım\n" +
          "• Hata mı, plan mı?\n\n" +
          "Haftada bir oku — kalıpları görürsün:\n" +
          "'Plan dışı entry'lerin %75'i kayıp.'\n" +
          "'Pazartesi açılışta açtığım pozisyonlar her zaman zarar.'\n\n" +
          "Bu data ile kendi en kötü davranışlarını filtrelersin.",
      },
      {
        heading: "Position size = duygu kontrolü",
        body:
          "Çok büyük pozisyon = uyku kaçırır.\n" +
          "Uyku kaçar = kötü karar.\n" +
          "Kötü karar = kayıp.\n\n" +
          "Doğru pozisyon büyüklüğü:\n" +
          "• Pozisyonu görünce uyuyabiliyorsan = doğru.\n" +
          "• Akşamları sürekli telefonda fiyatı kontrol ediyorsan = çok büyük.\n\n" +
          "Acemi tüyo: ilk 6 ay max %0.5 risk/trade ile çalış. Disiplin oturduktan sonra %1'e çık.",
      },
    ],
  },
];

export const TOTAL_LESSONS = LESSONS.length;
