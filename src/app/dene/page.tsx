"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /dene — DENEME MODÜLÜ GİZLENDİ.
 *
 * Eskiden 7 günlük ücretsiz deneme signup'ı için kullanılıyordu.
 * Şu an tüm UI'dan kaldırıldı; bu URL doğrudan /satin-al'a yönlendirir.
 * Geri açmak için: bot/main.py içindeki TRIAL_SIGNUP_DISABLED = False yap
 * ve bu sayfayı eski haline getir.
 */
export default function DenePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/satin-al");
  }, [router]);
  return null;
}
