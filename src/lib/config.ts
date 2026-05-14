/**
 * Nexora — global frontend sabitleri.
 * Tek noktadan değiştir, her yerde otomatik güncellensin.
 */

// Telegram kanal — her CTA / link buradan gelir
export const TELEGRAM_CHANNEL_USERNAME = "nexora_signals";
export const TELEGRAM_CHANNEL_URL = `https://t.me/${TELEGRAM_CHANNEL_USERNAME}`;
export const TELEGRAM_CHANNEL_DISPLAY = `t.me/${TELEGRAM_CHANNEL_USERNAME}`;

// Twitter / X
export const TWITTER_USERNAME = "nexora_trading";
export const TWITTER_URL = `https://x.com/${TWITTER_USERNAME}`;

// TikTok
export const TIKTOK_USERNAME = "nexorasignals";
export const TIKTOK_URL = `https://www.tiktok.com/@${TIKTOK_USERNAME}`;

// Site
export const SITE_URL = "https://nexora-trading.net";
export const SITE_DISPLAY = "nexora-trading.net";

// ---------------------------------------------------------------------------
// Pricing (TL — Shopier ile senkron)
// ---------------------------------------------------------------------------
// Tek nokta: landing, /odeme ve diger yerler bunu kullanir.
// Shopier'da fiyat degisirse SADECE buradan guncelle.
export const PLAN_PRICES_TRY = {
  signal:    899,   // Sinyal Paketi (30 gun)
  education: 1499,  // Sinyal + Egitim Seti (30 gun)
} as const;

// Referral indirimi yuzdesi — backend (shopier_client.DISCOUNT_REF_PCT) ile senkron olmali.
export const REFERRAL_DISCOUNT_PCT = 20;

export const formatTRY = (amount: number): string =>
  `₺${Math.round(amount).toLocaleString("tr-TR")}`;
