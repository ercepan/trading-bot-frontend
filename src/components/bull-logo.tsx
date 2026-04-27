/**
 * Bulls of Nasdaq logosu — minimalist boğa kafa silueti SVG.
 * Emerald gradient, herhangi bir size'da kullanılabilir.
 */
export function BullLogo({
  className = "size-6",
  filled = true,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Bulls of Nasdaq"
    >
      <defs>
        <linearGradient id="bull-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3ecf8e" />
          <stop offset="100%" stopColor="#2dba72" />
        </linearGradient>
      </defs>
      {/* Boğa boynuzları */}
      <path
        d="M5 8 C5 5, 7 4, 9 5 C10 6, 11 8, 11 11"
        stroke={filled ? "url(#bull-grad)" : "currentColor"}
      />
      <path
        d="M27 8 C27 5, 25 4, 23 5 C22 6, 21 8, 21 11"
        stroke={filled ? "url(#bull-grad)" : "currentColor"}
      />
      {/* Boğa kafası — yukarıya bakan üçgen */}
      <path
        d="M11 11 L11 17 C11 21, 13 25, 16 27 C19 25, 21 21, 21 17 L21 11 Z"
        fill={filled ? "url(#bull-grad)" : "none"}
        stroke={filled ? "url(#bull-grad)" : "currentColor"}
        opacity={filled ? 0.9 : 1}
      />
      {/* Burun halkası */}
      <circle
        cx="16"
        cy="22"
        r="1.6"
        fill="#0a0a0a"
        stroke={filled ? "#0a0a0a" : "currentColor"}
      />
      {/* Yukarı çıkan ok (bull market) */}
      <path
        d="M14 14 L16 12 L18 14 M16 12 L16 18"
        stroke={filled ? "#0a0a0a" : "currentColor"}
        strokeWidth="1.4"
      />
    </svg>
  );
}

/**
 * Wordmark + ikon kombinasyonu — header/sidebar için.
 */
export function BullsOfNasdaqMark({
  size = "md",
  showSubtext = false,
}: {
  size?: "sm" | "md" | "lg";
  showSubtext?: boolean;
}) {
  const iconSize =
    size === "sm" ? "size-5" : size === "lg" ? "size-9" : "size-7";
  const titleSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-base";
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center rounded-md bg-emerald-500/15 border border-emerald-500/30 p-1.5">
        <BullLogo className={iconSize} />
      </div>
      <div className="leading-tight">
        <div className={`font-bold tracking-tight ${titleSize}`}>
          BULLS <span className="text-emerald-400">OF</span> NASDAQ
        </div>
        {showSubtext && (
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase">
            Sentiment & Signal Lab
          </div>
        )}
      </div>
    </div>
  );
}
