"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, getToken, setToken, User, Subscription } from "@/lib/auth";

type AuthState = {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
};

type AuthContextValue = AuthState & {
  login: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    password: string,
    code: string,
    email: string,
  ) => Promise<{ email: string; username: string }>;
  renew: (code: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Subscriber'a açık rotalar (bunlar dışı admin only)
// PRIVACY: /dashboard subscriber listesinden ÇIKTI (MEXC bakiye + trade $ hassas)
// /performans public olarak anonim performans gösterir.
const SUBSCRIBER_ROUTES = [
  "/bist", "/signals", "/wsb", "/auth", "/yenile",
  "/haberler", "/egitim", "/referans", "/profil",
  "/performans",  // anonim, herkese acik
];
// Auth gerekmeyen rotalar (landing + auth + legal + satin-al + odeme + iletisim + performans + dene)
const PUBLIC_ROUTES = [
  "/auth", "/terms", "/kvkk", "/satin-al",
  "/iletisim", "/performans",
  "/odeme",  // Shopier TRY ödeme akışı (anonim satın alma)
  "/dene",   // 7 günlük ücretsiz trial signup (anonim)
];
// "/" tek başına public (root landing)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const refresh = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setSubscription(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me.user);
      setSubscription(me.subscription);
      setError(null);
    } catch (e: unknown) {
      // Token geçersiz veya expired
      setToken(null);
      setUser(null);
      setSubscription(null);
      setError(e instanceof Error ? e.message : "auth failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // Route guard
  useEffect(() => {
    if (loading) return;
    // Root path (/) ve public path'ler herkese açık (landing page için)
    const isPublic =
      pathname === "/" || PUBLIC_ROUTES.some((r) => pathname?.startsWith(r));
    if (isPublic) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    // Subscriber için route kısıtı
    if (user.role === "subscriber") {
      const allowed = SUBSCRIBER_ROUTES.some((r) => pathname === r || pathname?.startsWith(r + "/"));
      // Aboneliği aktif değilse activate sayfası dışında her şeye blok
      const subActive =
        subscription &&
        subscription.expires_at &&
        new Date(subscription.expires_at) > new Date();
      if (!subActive && pathname !== "/auth/activate") {
        router.replace("/auth/activate");
        return;
      }
      if (!allowed) {
        // Subscriber admin sayfasına gitmeye çalıştı → BIST'e yönlendir
        router.replace("/bist");
        return;
      }
    }
  }, [loading, user, subscription, pathname, router]);

  const login = async (username: string, password: string) => {
    setError(null);
    const result = await authApi.login(username, password);
    setToken(result.token);
    setUser(result.user);
    setSubscription(result.user.subscription || null);
    router.push(result.user.role === "admin" ? "/dashboard" : "/bist");
  };

  const signup = async (
    username: string,
    password: string,
    code: string,
    email: string,
  ) => {
    setError(null);
    const result = await authApi.signup(username, password, code, email);
    // Token DÖNMÜYOR — kullanıcı email verify etmeden login olamıyor
    return { email: result.email, username: result.username };
  };

  const renew = async (code: string) => {
    setError(null);
    await authApi.renew(code);
    await refresh();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setSubscription(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, subscription, loading, error, login, signup, renew, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
