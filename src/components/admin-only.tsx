"use client";

import { useAuth } from "@/components/auth-context";
import { ReactNode } from "react";

/**
 * Sadece admin kullanıcıya children'ı render eder.
 * Subscriber için tamamen gizler (veri kaynaklarını saklamak için).
 */
export function AdminOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== "admin") return null;
  return <>{children}</>;
}
