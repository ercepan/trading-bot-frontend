import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nexora — Sentiment Radar · BIST · NASDAQ · CRYPTO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #052e2a 100%)",
          padding: "80px",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#fff",
          position: "relative",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background:
              "linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%)",
          }}
        />

        {/* Logo + brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 48 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 20,
              background: "rgba(16,185,129,0.15)",
              border: "2px solid rgba(16,185,129,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 900,
              color: "#10b981",
            }}
          >
            N
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>
              <span style={{ color: "#10b981" }}>N</span>EXORA
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#888",
                letterSpacing: 4,
                marginTop: 8,
                textTransform: "uppercase",
              }}
            >
              Sentiment Radar
            </div>
          </div>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            color: "#fff",
            marginBottom: 28,
          }}
        >
          BIST · NASDAQ · CRYPTO
        </div>

        <div
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            lineHeight: 1.4,
            maxWidth: 980,
          }}
        >
          AI destekli sentiment sinyalleri.
          <br />
          Topluluk + resmi açıklama bazlı analiz.
        </div>

        {/* Bottom row — stats */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            right: 80,
            display: "flex",
            gap: 40,
          }}
        >
          {[
            { v: "76%", l: "İSABET" },
            { v: "BIST", l: "+ NASDAQ + CRYPTO" },
            { v: "$25", l: "ÜYELİK / AY" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "24px 32px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
              }}
            >
              <div style={{ fontSize: 48, fontWeight: 800, color: "#10b981" }}>
                {s.v}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#71717a",
                  letterSpacing: 2,
                  marginTop: 6,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
