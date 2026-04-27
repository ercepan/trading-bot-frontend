/**
 * Nexora Logo — N harfi mum çubuğu motifli, site teması (emerald + dark) ile uyumlu.
 *
 * Senin orijinal tasarım: altın + gümüş + boğa mumları çember içinde.
 * Site teması (#3ecf8e emerald + #0a0a0a dark) için adapte edildi:
 *  - Sol diagonal bar:  açık emerald (#5fdba0)
 *  - Sağ diagonal bar:  koyu emerald (#2dba72)
 *  - Diagonal kesişim:  altın renk korundu (vurgu için)
 *  - Çember:            subtle emerald ring (opacity 0.4)
 *  - Mumlar:            üst sağda 3 mini mum (yeşil/kırmızı/yeşil)
 */
export function NexoraLogo({
  className = "size-6",
  withRing = true,
}: {
  className?: string;
  withRing?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      aria-label="Nexora"
    >
      <defs>
        {/* Açık emerald (sol bar) */}
        <linearGradient id="nx-light" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7fe5b3" />
          <stop offset="50%" stopColor="#5fdba0" />
          <stop offset="100%" stopColor="#3ecf8e" />
        </linearGradient>
        {/* Koyu emerald (sağ bar) */}
        <linearGradient id="nx-dark" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3ecf8e" />
          <stop offset="100%" stopColor="#1f7c4a" />
        </linearGradient>
        {/* Diagonal vurgu (altın → emerald) */}
        <linearGradient id="nx-accent" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f0c270" />
          <stop offset="100%" stopColor="#3ecf8e" />
        </linearGradient>
        {/* Çember */}
        <linearGradient id="nx-ring" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3ecf8e" stopOpacity="0.0" />
          <stop offset="50%" stopColor="#3ecf8e" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3ecf8e" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Subtle ring (opsiyonel) */}
      {withRing && (
        <circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke="url(#nx-ring)"
          strokeWidth="1.4"
        />
      )}

      {/* Sol bar (N'in sol dikey çubuğu) — açık emerald */}
      <polygon
        points="14,16 22,16 22,48 14,48"
        fill="url(#nx-light)"
      />

      {/* Sağ bar (N'in sağ dikey çubuğu) — koyu emerald */}
      <polygon
        points="42,16 50,16 50,48 42,48"
        fill="url(#nx-dark)"
      />

      {/* Diagonal (N'in sol üstten sağ alta) — altın vurgu */}
      <polygon
        points="22,16 30,16 50,42 50,48 42,48 22,22"
        fill="url(#nx-accent)"
      />

      {/* Mumlar — sağ üst, N'in çatısından çıkıyor gibi */}
      {/* Mum 1 — yeşil küçük */}
      <line x1="46" y1="6" x2="46" y2="9" stroke="#3ecf8e" strokeWidth="1" />
      <rect x="44.5" y="9" width="3" height="5" fill="#3ecf8e" />
      <line x1="46" y1="14" x2="46" y2="16" stroke="#3ecf8e" strokeWidth="1" />

      {/* Mum 2 — kırmızı orta */}
      <line x1="51" y1="4" x2="51" y2="7" stroke="#f5556d" strokeWidth="1" />
      <rect x="49.5" y="7" width="3" height="6" fill="#f5556d" />
      <line x1="51" y1="13" x2="51" y2="15" stroke="#f5556d" strokeWidth="1" />

      {/* Mum 3 — yeşil büyük (yükselen) */}
      <line x1="56" y1="2" x2="56" y2="6" stroke="#3ecf8e" strokeWidth="1" />
      <rect x="54.5" y="6" width="3" height="8" fill="#3ecf8e" />
      <line x1="56" y1="14" x2="56" y2="16" stroke="#3ecf8e" strokeWidth="1" />
    </svg>
  );
}

/**
 * Wordmark + ikon — sidebar / header / footer için.
 * "N" emerald vurgulu, "EXORA" beyaz tracking-tight.
 */
export function NexoraMark({
  size = "md",
  showSubtext = false,
  withRing = true,
}: {
  size?: "sm" | "md" | "lg";
  showSubtext?: boolean;
  withRing?: boolean;
}) {
  const iconSize =
    size === "sm" ? "size-6" : size === "lg" ? "size-10" : "size-8";
  const titleSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-base";
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 p-1">
        <NexoraLogo className={iconSize} withRing={withRing} />
      </div>
      <div className="leading-tight">
        <div className={`font-bold tracking-tight ${titleSize}`}>
          <span className="text-emerald-400">N</span>EXORA
        </div>
        {showSubtext && (
          <div className="text-[9px] text-muted-foreground tracking-[0.25em] uppercase">
            BIST · NASDAQ · CRYPTO
          </div>
        )}
      </div>
    </div>
  );
}
