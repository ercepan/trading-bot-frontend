/**
 * Eğitim Seti — SVG diagram component'leri.
 * Her ders için kullanıcıya kavramı görsel olarak gösteren basit illüstrasyonlar.
 *
 * Tasarım kuralları:
 *  - Inline SVG (network yok, anında render)
 *  - Tema: koyu zemin, emerald/amber/red vurgu
 *  - Dikey grid sistem, kolay okunur
 *  - viewBox kullan, scale otomatik
 */

const G = "#10b981"; // green
const R = "#ef4444"; // red
const Y = "#f59e0b"; // amber
const W = "#ffffff";
const M = "#71717a"; // muted gray
const BG = "#0a0a0a";

const Box = ({ children, label }: { children: React.ReactNode; label?: string }) => (
  <figure className="rounded-lg border border-border/40 bg-background/60 p-3 my-3">
    <div className="overflow-x-auto">
      <div className="min-w-[300px] flex justify-center">{children}</div>
    </div>
    {label && (
      <figcaption className="text-[11px] text-muted-foreground text-center mt-2">
        {label}
      </figcaption>
    )}
  </figure>
);

// ────────────────────────────────────────────────────────────────────────────
// 1. CANDLESTICK (mum) — yeşil, kırmızı, doji, hammer
// ────────────────────────────────────────────────────────────────────────────
export function CandlestickDiagram() {
  return (
    <Box label="Mum tipleri: yeşil (alıcı), kırmızı (satıcı), doji (kararsız), hammer (dip dönüş)">
      <svg viewBox="0 0 600 240" width="100%" style={{ maxWidth: 560 }}>
        {/* Yeşil mum */}
        <g transform="translate(70, 30)">
          <line x1="0" y1="10" x2="0" y2="180" stroke={W} strokeWidth="2" />
          <rect x="-22" y="50" width="44" height="100" fill={G} />
          <text x="0" y="210" fill={W} fontSize="14" textAnchor="middle" fontWeight="bold">
            YEŞİL
          </text>
          <text x="0" y="228" fill={M} fontSize="11" textAnchor="middle">
            Kapanış &gt; Açılış
          </text>
          {/* labels */}
          <text x="35" y="55" fill={M} fontSize="10">açılış (alt)</text>
          <text x="35" y="148" fill={M} fontSize="10">kapanış (üst)</text>
        </g>

        {/* Kırmızı mum */}
        <g transform="translate(220, 30)">
          <line x1="0" y1="20" x2="0" y2="180" stroke={W} strokeWidth="2" />
          <rect x="-22" y="50" width="44" height="100" fill={R} />
          <text x="0" y="210" fill={W} fontSize="14" textAnchor="middle" fontWeight="bold">
            KIRMIZI
          </text>
          <text x="0" y="228" fill={M} fontSize="11" textAnchor="middle">
            Kapanış &lt; Açılış
          </text>
        </g>

        {/* Doji */}
        <g transform="translate(370, 30)">
          <line x1="0" y1="20" x2="0" y2="180" stroke={W} strokeWidth="2" />
          <rect x="-22" y="98" width="44" height="6" fill={W} />
          <text x="0" y="210" fill={W} fontSize="14" textAnchor="middle" fontWeight="bold">
            DOJI
          </text>
          <text x="0" y="228" fill={M} fontSize="11" textAnchor="middle">
            Kararsız (eşit)
          </text>
        </g>

        {/* Hammer */}
        <g transform="translate(520, 30)">
          <line x1="0" y1="40" x2="0" y2="170" stroke={W} strokeWidth="2" />
          <rect x="-22" y="40" width="44" height="35" fill={G} />
          <text x="0" y="210" fill={W} fontSize="14" textAnchor="middle" fontWeight="bold">
            ÇEKİÇ
          </text>
          <text x="0" y="228" fill={M} fontSize="11" textAnchor="middle">
            Dip dönüş işareti
          </text>
        </g>
      </svg>
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 2. TREND, DESTEK, DİRENÇ
// ────────────────────────────────────────────────────────────────────────────
export function TrendDiagram() {
  return (
    <Box label="Yükseliş trendi: dipler giderek yükseliyor, destek çizgisi (yeşil) yukarı eğimli">
      <svg viewBox="0 0 600 280" width="100%" style={{ maxWidth: 580 }}>
        {/* grid */}
        <g stroke="#27272a" strokeWidth="0.5">
          {[60, 120, 180, 240].map((y) => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} />
          ))}
        </g>
        {/* Fiyat çizgisi (zigzag yükselen) */}
        <polyline
          points="20,200 80,150 120,180 180,120 230,160 290,90 340,140 400,70 450,120 510,40 560,80"
          fill="none"
          stroke={W}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* destek çizgisi (yeşil) */}
        <line
          x1="20"
          y1="200"
          x2="560"
          y2="80"
          stroke={G}
          strokeWidth="2"
          strokeDasharray="6,4"
        />
        {/* destek noktaları */}
        {[
          { x: 80, y: 150 },
          { x: 230, y: 160 },
          { x: 340, y: 140 },
          { x: 450, y: 120 },
        ].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="6" fill={G} stroke={BG} strokeWidth="2" />
        ))}
        {/* labels */}
        <text x="450" y="145" fill={G} fontSize="12" fontWeight="bold">
          DESTEK
        </text>
        <text x="450" y="160" fill={G} fontSize="10">
          (yukarı eğimli)
        </text>
        <text x="20" y="22" fill={W} fontSize="13" fontWeight="bold">
          📈 YÜKSELİŞ TRENDİ
        </text>
        <text x="20" y="38" fill={M} fontSize="11">
          Her dip bir öncekinden YÜKSEK
        </text>
      </svg>
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 3. EMA — golden cross / death cross
// ────────────────────────────────────────────────────────────────────────────
export function EmaCrossDiagram() {
  return (
    <Box label="Golden Cross: EMA50 (kısa), EMA200'ü (uzun) yukarı kesince → güçlü AL sinyali">
      <svg viewBox="0 0 600 260" width="100%" style={{ maxWidth: 580 }}>
        <g stroke="#27272a" strokeWidth="0.5">
          {[80, 130, 180].map((y) => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} />
          ))}
        </g>
        {/* Fiyat */}
        <polyline
          points="20,200 80,180 140,170 200,150 260,140 320,120 380,100 440,80 500,70 560,60"
          fill="none"
          stroke={W}
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* EMA200 (uzun, yatay yumuşak) */}
        <path
          d="M 20 180 Q 200 175, 380 165 T 580 145"
          fill="none"
          stroke={Y}
          strokeWidth="3"
        />
        {/* EMA50 (kısa, daha hareketli) */}
        <path
          d="M 20 220 Q 100 200, 200 180 Q 300 160, 400 130 T 580 90"
          fill="none"
          stroke={G}
          strokeWidth="3"
        />
        {/* Cross noktası */}
        <circle cx="280" cy="170" r="8" fill={G} stroke={W} strokeWidth="2" />
        <text x="295" y="174" fill={G} fontSize="13" fontWeight="bold">
          ⭐ GOLDEN CROSS
        </text>
        <text x="295" y="190" fill={M} fontSize="11">
          EMA50 yukarı kesti → AL
        </text>
        {/* legend */}
        <g transform="translate(440, 200)">
          <line x1="0" y1="0" x2="20" y2="0" stroke={G} strokeWidth="3" />
          <text x="25" y="4" fill={G} fontSize="11">EMA 50 (hızlı)</text>
          <line x1="0" y1="20" x2="20" y2="20" stroke={Y} strokeWidth="3" />
          <text x="25" y="24" fill={Y} fontSize="11">EMA 200 (yavaş)</text>
          <line x1="0" y1="40" x2="20" y2="40" stroke={W} strokeWidth="1.5" opacity="0.6" />
          <text x="25" y="44" fill={M} fontSize="11">Fiyat</text>
        </g>
      </svg>
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 4. RSI — overbought / oversold zones
// ────────────────────────────────────────────────────────────────────────────
export function RsiDiagram() {
  return (
    <Box label="RSI 0-100 arası. >70 aşırı alım (sat sinyali), <30 aşırı satım (al sinyali)">
      <svg viewBox="0 0 600 280" width="100%" style={{ maxWidth: 580 }}>
        {/* Background zones */}
        <rect x="40" y="20" width="540" height="60" fill={R} fillOpacity="0.08" />
        <rect x="40" y="80" width="540" height="120" fill={M} fillOpacity="0.04" />
        <rect x="40" y="200" width="540" height="60" fill={G} fillOpacity="0.08" />
        {/* Borders */}
        <line x1="40" y1="80" x2="580" y2="80" stroke={R} strokeWidth="1" strokeDasharray="4,3" />
        <line x1="40" y1="200" x2="580" y2="200" stroke={G} strokeWidth="1" strokeDasharray="4,3" />
        {/* Y-axis labels */}
        <text x="30" y="24" fill={W} fontSize="11" textAnchor="end">100</text>
        <text x="30" y="84" fill={R} fontSize="11" textAnchor="end" fontWeight="bold">70</text>
        <text x="30" y="144" fill={M} fontSize="11" textAnchor="end">50</text>
        <text x="30" y="204" fill={G} fontSize="11" textAnchor="end" fontWeight="bold">30</text>
        <text x="30" y="264" fill={W} fontSize="11" textAnchor="end">0</text>
        {/* RSI line */}
        <polyline
          points="50,140 100,90 150,60 200,75 250,110 300,150 350,180 400,220 450,235 500,210 550,170"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
        />
        {/* Annotations */}
        <text x="320" y="48" fill={R} fontSize="13" fontWeight="bold">
          AŞIRI ALIM — SAT
        </text>
        <text x="320" y="248" fill={G} fontSize="13" fontWeight="bold">
          AŞIRI SATIM — AL
        </text>
        <text x="160" y="55" fill={W} fontSize="10">tepe</text>
        <text x="430" y="248" fill={W} fontSize="10">dip</text>
      </svg>
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 5. SENTIMENT SKOR — gradient skala
// ────────────────────────────────────────────────────────────────────────────
export function SentimentScaleDiagram() {
  return (
    <Box label="Sentiment skoru: -1 (negatif) → 0 (nötr) → +1 (pozitif). Nexora her sabah günceller">
      <svg viewBox="0 0 600 220" width="100%" style={{ maxWidth: 580 }}>
        <defs>
          <linearGradient id="sent-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={R} />
            <stop offset="50%" stopColor={M} />
            <stop offset="100%" stopColor={G} />
          </linearGradient>
        </defs>
        {/* Bar */}
        <rect x="40" y="80" width="520" height="40" rx="20" fill="url(#sent-grad)" />
        {/* Markers */}
        <line x1="40" y1="70" x2="40" y2="130" stroke={R} strokeWidth="2" />
        <text x="40" y="155" fill={R} fontSize="14" fontWeight="bold" textAnchor="middle">-1</text>
        <text x="40" y="170" fill={M} fontSize="10" textAnchor="middle">UZAK DUR</text>

        <line x1="160" y1="70" x2="160" y2="130" stroke={R} strokeWidth="2" />
        <text x="160" y="155" fill={R} fontSize="14" fontWeight="bold" textAnchor="middle">-0.3</text>
        <text x="160" y="170" fill={R} fontSize="10" textAnchor="middle">RİSK</text>

        <line x1="300" y1="65" x2="300" y2="135" stroke={M} strokeWidth="2" />
        <text x="300" y="155" fill={M} fontSize="14" fontWeight="bold" textAnchor="middle">0</text>
        <text x="300" y="170" fill={M} fontSize="10" textAnchor="middle">NÖTR · BEKLE</text>

        <line x1="440" y1="70" x2="440" y2="130" stroke={G} strokeWidth="2" />
        <text x="440" y="155" fill={G} fontSize="14" fontWeight="bold" textAnchor="middle">+0.5</text>
        <text x="440" y="170" fill={G} fontSize="10" textAnchor="middle">POZİTİF · AL</text>

        <line x1="560" y1="70" x2="560" y2="130" stroke={G} strokeWidth="2" />
        <text x="560" y="155" fill={G} fontSize="14" fontWeight="bold" textAnchor="middle">+1</text>
        <text x="560" y="170" fill={M} fontSize="10" textAnchor="middle">GÜÇLÜ AL</text>

        <text x="300" y="40" fill={W} fontSize="14" textAnchor="middle" fontWeight="bold">
          🤖 SENTIMENT SKORU
        </text>
        <text x="300" y="200" fill={M} fontSize="11" textAnchor="middle">
          AI günde 50+ haber okur → her habere skor → hisse bazında ortalanır
        </text>
      </svg>
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 6. RİSK YÖNETİMİ — stop-loss + R:R
// ────────────────────────────────────────────────────────────────────────────
export function RiskRewardDiagram() {
  return (
    <Box label="Risk:Ödül 1:3 örnek — kayıp 5 TL, hedef 15 TL. 4'ten 1 tutturursan bile karda kalırsın">
      <svg viewBox="0 0 600 280" width="100%" style={{ maxWidth: 580 }}>
        {/* Y-axis */}
        <line x1="50" y1="20" x2="50" y2="240" stroke={M} strokeWidth="1" />
        {/* Fiyat seviyeleri */}
        {[
          { y: 60, label: "115 TL", color: G, name: "🎯 HEDEF" },
          { y: 180, label: "100 TL", color: W, name: "GİRİŞ" },
          { y: 220, label: "95 TL", color: R, name: "🛑 STOP" },
        ].map((lev) => (
          <g key={lev.y}>
            <line
              x1="50"
              y1={lev.y}
              x2="500"
              y2={lev.y}
              stroke={lev.color}
              strokeWidth="2"
              strokeDasharray={lev.color === W ? "" : "5,3"}
            />
            <text x="40" y={lev.y + 4} fill={lev.color} fontSize="12" textAnchor="end" fontWeight="bold">
              {lev.label}
            </text>
            <text x="510" y={lev.y + 4} fill={lev.color} fontSize="12" fontWeight="bold">
              {lev.name}
            </text>
          </g>
        ))}
        {/* Risk-reward bars */}
        <rect x="200" y="60" width="50" height="120" fill={G} fillOpacity="0.4" stroke={G} />
        <text x="225" y="125" fill={G} fontSize="13" textAnchor="middle" fontWeight="bold">
          +15 TL
        </text>
        <text x="225" y="140" fill={G} fontSize="10" textAnchor="middle">
          ÖDÜL
        </text>

        <rect x="270" y="180" width="50" height="40" fill={R} fillOpacity="0.4" stroke={R} />
        <text x="295" y="205" fill={R} fontSize="13" textAnchor="middle" fontWeight="bold">
          −5
        </text>

        {/* Rasyo */}
        <text x="380" y="120" fill={W} fontSize="22" fontWeight="bold">
          R:R 1:3
        </text>
        <text x="380" y="145" fill={M} fontSize="11">
          (her 1 TL risk için 3 TL ödül)
        </text>

        <text x="50" y="270" fill={M} fontSize="11">
          %33 isabet oranıyla bile uzun vadede karda kalırsın → matematik garanti
        </text>
      </svg>
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 7. BILANÇO METRIKLERI — F/K, ROE chart
// ────────────────────────────────────────────────────────────────────────────
export function FinancialsRadar() {
  return (
    <Box label="Sağlıklı şirket profili: F/K 8-15 arası, PD/DD 1-3, ROE %15+, Borç/Özsermaye <2">
      <svg viewBox="0 0 600 280" width="100%" style={{ maxWidth: 580 }}>
        <text x="20" y="22" fill={W} fontSize="14" fontWeight="bold">
          💎 SAĞLIKLI HİSSE PROFİLİ
        </text>
        {/* 4 metric bar */}
        {[
          { y: 60, label: "F/K (P/E)", min: "5", ok: "8-15", max: "30+", value: 0.4 },
          { y: 110, label: "PD/DD", min: "<1", ok: "1-3", max: "5+", value: 0.5 },
          { y: 160, label: "ROE", min: "%5", ok: "%15+", max: "%30+", value: 0.7 },
          { y: 210, label: "Borç/Özsermaye", min: "<1", ok: "1-2", max: "3+", value: 0.3 },
        ].map((m) => (
          <g key={m.label}>
            <text x="140" y={m.y + 5} fill={W} fontSize="12" textAnchor="end" fontWeight="500">
              {m.label}
            </text>
            {/* segments */}
            <rect x="160" y={m.y - 8} width="120" height="16" fill={G} fillOpacity="0.25" stroke={G} />
            <rect x="280" y={m.y - 8} width="120" height="16" fill={Y} fillOpacity="0.2" stroke={Y} />
            <rect x="400" y={m.y - 8} width="120" height="16" fill={R} fillOpacity="0.2" stroke={R} />
            {/* labels */}
            <text x="220" y={m.y + 5} fill={G} fontSize="11" textAnchor="middle" fontWeight="bold">
              {m.min}
            </text>
            <text x="340" y={m.y + 5} fill={Y} fontSize="11" textAnchor="middle" fontWeight="bold">
              {m.ok}
            </text>
            <text x="460" y={m.y + 5} fill={R} fontSize="11" textAnchor="middle" fontWeight="bold">
              {m.max}
            </text>
          </g>
        ))}
        {/* legend */}
        <g transform="translate(160, 240)">
          <rect x="0" y="0" width="14" height="10" fill={G} fillOpacity="0.3" stroke={G} />
          <text x="20" y="9" fill={G} fontSize="10">İYİ / ucuz</text>

          <rect x="100" y="0" width="14" height="10" fill={Y} fillOpacity="0.2" stroke={Y} />
          <text x="120" y="9" fill={Y} fontSize="10">İDEAL</text>

          <rect x="200" y="0" width="14" height="10" fill={R} fillOpacity="0.2" stroke={R} />
          <text x="220" y="9" fill={R} fontSize="10">RİSKLİ / pahalı</text>
        </g>
      </svg>
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 8. KRIPTO CYCLE — 4 yıllık döngü
// ────────────────────────────────────────────────────────────────────────────
export function CryptoCycleDiagram() {
  return (
    <Box label="Bitcoin 4 yıllık döngüsü — halving sonrası 12-18 ay tepe, sonra -70/-90% düşüş">
      <svg viewBox="0 0 600 260" width="100%" style={{ maxWidth: 580 }}>
        {/* sinüs benzeri eğri — accumulation, bull, distribution, bear */}
        <path
          d="M 20 200 Q 100 195, 150 180 Q 200 160, 250 120 Q 300 60, 350 40 Q 400 20, 450 80 Q 500 180, 580 200"
          fill="none"
          stroke={G}
          strokeWidth="3"
        />
        {/* Stage labels */}
        {[
          { x: 80,  y: 220, label: "1. ACCUMULATION", color: M, sub: "(dip, kimse bakmıyor)" },
          { x: 200, y: 95,  label: "2. STEALTH BULL", color: G, sub: "(yavaş yükseliş)" },
          { x: 350, y: 25,  label: "3. MAINSTREAM BULL", color: G, sub: "(parabolic, FOMO)" },
          { x: 460, y: 55,  label: "4. DISTRIBUTION", color: Y, sub: "(tepe, sat zamanı)" },
          { x: 555, y: 220, label: "5. BEAR", color: R, sub: "(-70/-90% düşüş)" },
        ].map((s, i) => (
          <g key={i}>
            <text x={s.x} y={s.y} fill={s.color} fontSize="11" textAnchor="middle" fontWeight="bold">
              {s.label}
            </text>
            <text x={s.x} y={s.y + 14} fill={M} fontSize="9" textAnchor="middle">
              {s.sub}
            </text>
          </g>
        ))}
        <text x="20" y="22" fill={W} fontSize="14" fontWeight="bold">
          ₿ KRİPTO 4-YILLIK DÖNGÜ
        </text>
      </svg>
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 9. POSITION SIZING — %1 kuralı
// ────────────────────────────────────────────────────────────────────────────
export function PositionSizingDiagram() {
  return (
    <Box label="%1 kuralı: 100K TL sermaye → max 1.000 TL risk/trade. Pozisyon büyüklüğü stop mesafesinden hesaplanır">
      <svg viewBox="0 0 600 220" width="100%" style={{ maxWidth: 580 }}>
        <text x="20" y="22" fill={W} fontSize="14" fontWeight="bold">
          🎯 %1 KURALI · POSITION SIZING
        </text>
        {/* Sermaye dairesi */}
        <circle cx="120" cy="120" r="60" fill={G} fillOpacity="0.15" stroke={G} strokeWidth="3" />
        <text x="120" y="115" fill={W} fontSize="11" textAnchor="middle">SERMAYE</text>
        <text x="120" y="135" fill={G} fontSize="20" textAnchor="middle" fontWeight="bold">
          100K
        </text>
        {/* Arrow */}
        <path d="M 195 120 L 240 120" stroke={W} strokeWidth="2" markerEnd="url(#arr1)" />
        <defs>
          <marker id="arr1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polygon points="0 0, 8 4, 0 8" fill={W} />
          </marker>
        </defs>
        {/* Risk dairesi */}
        <circle cx="290" cy="120" r="35" fill={R} fillOpacity="0.15" stroke={R} strokeWidth="2" />
        <text x="290" y="115" fill={W} fontSize="9" textAnchor="middle">%1 RİSK</text>
        <text x="290" y="132" fill={R} fontSize="14" textAnchor="middle" fontWeight="bold">
          1.000
        </text>
        {/* Formül */}
        <g transform="translate(360, 90)">
          <text x="0" y="0" fill={W} fontSize="11" fontWeight="bold">FORMÜL</text>
          <text x="0" y="20" fill={M} fontSize="10">Pozisyon =</text>
          <text x="0" y="38" fill={G} fontSize="11" fontWeight="bold">1.000 TL ÷ stop mesafesi</text>
          <text x="0" y="60" fill={M} fontSize="10">ASELS giriş 100, stop 95:</text>
          <text x="0" y="78" fill={G} fontSize="11" fontWeight="bold">1.000 ÷ 5 = 200 hisse</text>
          <text x="0" y="96" fill={M} fontSize="10">→ 20.000 TL pozisyon</text>
          <text x="0" y="114" fill={R} fontSize="10">→ Stop'a takılırsa kayıp 1.000 TL ✓</text>
        </g>
      </svg>
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// REGISTRY — lesson.id → diagram component
// ────────────────────────────────────────────────────────────────────────────
export const LESSON_DIAGRAMS: Record<string, React.ComponentType[]> = {
  "mum-okuma":           [CandlestickDiagram],
  "trend-destek-direnc": [TrendDiagram],
  "hareketli-ortalama":  [EmaCrossDiagram],
  "rsi":                 [RsiDiagram],
  "macd":                [], // (MACD opsiyonel — yer kalırsa eklenir)
  "risk-yonetimi":       [RiskRewardDiagram, PositionSizingDiagram],
  "bist-temelleri":      [],
  "bilanco-okuma":       [FinancialsRadar],
  "hisse-secimi":        [],
  "kripto-temelleri":    [CryptoCycleDiagram],
  "sentiment-analizi":   [SentimentScaleDiagram],
  "trade-psikolojisi":   [],
};
