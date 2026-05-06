/**
 * Nexora — Referral / Affiliate frontend yardımcıları.
 *
 * Cookie ile 30 gün takip:
 *  - URL'de ?ref=ERC-A4F2 → cookie'ye kaydet
 *  - Satın al sayfasında cookie → backend'e yolla → indirim
 */
import { API_BASE } from "./api";
import {
  authHeaders,
} from "./auth";

const COOKIE_NAME = "tb_ref";
const COOKIE_MAX_AGE_DAYS = 30;

export type ReferralStats = {
  code: string | null;
  discount_pct: number;
  commission_pct: number;
  click_count: number;
  signup_count: number;
  active_count: number;
  referees: { id: number; username: string; created_at: string; is_active: number }[];
  balance: {
    earned_total: number;
    withdrawn: number;
    available: number;
    min_payout: number;
    can_withdraw: boolean;
  };
};

export type ReferralCheck = {
  valid: boolean;
  referrer_username?: string;
  discount_pct?: number;
};

// ── Cookie helpers ──────────────────────────────────────────────────────────
function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86400e3).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((r) => r.startsWith(name + "="));
  if (!match) return null;
  return decodeURIComponent(match.split("=")[1] || "");
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// ── Public referral utils ──────────────────────────────────────────────────
export function getStoredReferralCode(): string | null {
  return getCookie(COOKIE_NAME);
}

export function storeReferralCode(code: string) {
  if (!code) return;
  setCookie(COOKIE_NAME, code.toUpperCase(), COOKIE_MAX_AGE_DAYS);
}

export function clearReferralCode() {
  deleteCookie(COOKIE_NAME);
}

/**
 * Sayfaya gelen ?ref=XXXX query parametresini cookie'ye kaydet
 * + backend'e click bildirimi gönder.
 * Landing sayfasında 1 kez çağrılır.
 */
export async function captureReferralFromUrl(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (!ref) return null;
  const codeUpper = ref.toUpperCase();
  storeReferralCode(codeUpper);

  // Best-effort click log (ignore errors)
  try {
    await fetch(`${API_BASE}/api/referral/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: codeUpper }),
    });
  } catch {}

  return codeUpper;
}

/**
 * Bir kodun geçerli olup olmadığını backend'den kontrol et.
 * /satin-al sayfasında "Erce indirimini uyguladı" göstermek için.
 */
export async function checkReferralCode(code: string): Promise<ReferralCheck> {
  if (!code) return { valid: false };
  try {
    const r = await fetch(
      `${API_BASE}/api/referral/check/${encodeURIComponent(code.toUpperCase())}`,
      { cache: "no-store" },
    );
    if (!r.ok) return { valid: false };
    return r.json();
  } catch {
    return { valid: false };
  }
}

// ── Authenticated APIs (subscriber kendi linki) ────────────────────────────
export const referralApi = {
  myStats: async (): Promise<ReferralStats> => {
    const r = await fetch(`${API_BASE}/api/referral/me`, {
      headers: authHeaders(),
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  payouts: async (): Promise<{
    payouts: {
      id: number;
      amount_usd: number;
      method: string;
      bsc_address: string | null;
      status: string;
      admin_note: string | null;
      tx_hash: string | null;
      created_at: string;
      processed_at: string | null;
    }[];
  }> => {
    const r = await fetch(`${API_BASE}/api/referral/payouts`, {
      headers: authHeaders(),
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  requestPayout: async (amount_usd: number, bsc_address: string) => {
    const r = await fetch(`${API_BASE}/api/referral/payout`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ amount_usd, bsc_address }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      let msg = `${r.status}`;
      try {
        msg = JSON.parse(txt).detail || msg;
      } catch {}
      throw new Error(msg);
    }
    return r.json();
  },
};
