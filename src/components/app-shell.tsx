"use client";

import {
  LayoutDashboard,
  TrendingUp,
  History,
  AlertTriangle,
  Settings,
  Wifi,
  WifiOff,
  Radar,
  FlaskConical,
  Zap,
  Globe,
  DollarSign,
  Wallet,
  Sparkles,
  Newspaper,
  Megaphone,
  Send as TwitterIcon,
  GraduationCap,
  Gift,
  UserCog,
} from "lucide-react";
import { NexoraLogo } from "@/components/nexora-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth-context";
import { LogOut, ShieldCheck, Users, FileText } from "lucide-react";
import { SpkDisclaimerModal, SpkFooterNote } from "@/components/spk-disclaimer";
import { EmailMissingBanner } from "@/components/email-missing-banner";
import { OnboardingModal } from "@/components/onboarding-modal";
import { TELEGRAM_CHANNEL_URL, TWITTER_URL } from "@/lib/config";
import { XIcon } from "@/components/x-icon";

const navAdmin = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/positions", label: "Açık Pozisyonlar", icon: TrendingUp },
  { href: "/history", label: "Geçmiş", icon: History },
  { href: "/haberler", label: "Haberler", icon: Newspaper },
  { href: "/egitim", label: "Eğitim Seti", icon: GraduationCap },
  { href: "/referans", label: "Referans", icon: Gift },
  { href: "/wsb", label: "ABD Radar", icon: Radar },
  { href: "/bist", label: "BIST Radar", icon: Globe },
  { href: "/signals", label: "Hisse Sinyalleri", icon: Zap },
  { href: "/lab", label: "Strateji Laboratuvarı", icon: FlaskConical },
  { href: "/errors", label: "Hatalar", icon: AlertTriangle },
  { href: "/profil", label: "Profilim", icon: UserCog },
  { href: "/settings", label: "Ayarlar", icon: Settings },
];

const navAdminPanel = [
  { href: "/admin/revenue", label: "Revenue & MRR", icon: DollarSign },
  { href: "/admin/payments", label: "Ödemeler", icon: Wallet },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
  { href: "/admin/codes", label: "Davet Kodları", icon: ShieldCheck },
  { href: "/admin/marketing", label: "Telegram", icon: Megaphone },
  { href: "/admin/twitter", label: "Twitter (X)", icon: TwitterIcon },
  { href: "/admin/sources", label: "Veri Kaynakları", icon: FileText },
];

const navSubscriber = [
  { href: "/haberler", label: "Haberler", icon: Newspaper },
  { href: "/egitim", label: "Eğitim Seti", icon: GraduationCap },
  { href: "/referans", label: "Referans", icon: Gift },
  { href: "/bist", label: "BIST Radar", icon: Globe },
  { href: "/signals", label: "Hisse Sinyalleri", icon: Zap },
  { href: "/wsb", label: "ABD Radar", icon: Radar },
  { href: "/yenile", label: "Yenile", icon: Sparkles },
  { href: "/profil", label: "Profilim", icon: UserCog },
];

function HealthBadge() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    const check = async () => {
      try {
        await api.health();
        if (alive) setOk(true);
      } catch {
        if (alive) setOk(false);
      }
    };
    check();
    const t = setInterval(check, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);
  if (ok === null)
    return (
      <Badge variant="outline" className="gap-1">
        <span className="size-1.5 rounded-full bg-muted-foreground animate-pulse" />
        bağlanıyor
      </Badge>
    );
  return ok ? (
    <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-400">
      <Wifi className="size-3" /> canlı
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1 border-red-500/30 text-red-400">
      <WifiOff className="size-3" /> offline
    </Badge>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, subscription, logout, loading } = useAuth();

  // Auth sayfalarında, landing'de, legal sayfalarda + public sayfalar (iletişim, performans, satin-al, odeme, dene) sidebar yok
  const isAuthPage = pathname?.startsWith("/auth/");
  const isPublicPage =
    pathname === "/" ||
    pathname === "/terms" ||
    pathname === "/kvkk" ||
    pathname === "/satin-al" ||
    pathname === "/iletisim" ||
    pathname === "/performans" ||
    pathname === "/dene" ||
    pathname === "/preview" ||
    pathname?.startsWith("/odeme");
  if (isAuthPage || isPublicPage) {
    return <>{children}</>;
  }

  // Yükleniyor veya henüz auth verisi yoksa boş ekran
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Yükleniyor…
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const navItems = isAdmin ? navAdmin : navSubscriber;

  // Subscription gün kalan
  const daysLeft = subscription?.expires_at
    ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="flex size-9 items-center justify-center rounded-md bg-emerald-500/15 border border-emerald-500/40">
              <span className="font-display text-emerald-400 text-xl leading-none" style={{ fontStyle: "italic", fontWeight: 600 }}>
                N
              </span>
            </div>
            <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="font-display text-base leading-none">Nexora</span>
              <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-[0.22em] mt-1">
                {user.username} · {isAdmin ? "admin" : "abone"}
              </span>
            </div>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              Navigasyon
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : !!pathname?.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.label}
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {isAdmin && (
            <SidebarGroup>
              <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-400/60">
                Admin
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navAdminPanel.map((item) => {
                    const Icon = item.icon;
                    const active = !!pathname?.startsWith(item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={<Link href={item.href} />}
                          isActive={active}
                          tooltip={item.label}
                        >
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:hidden">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em]">v2.0</span>
            <HealthBadge />
          </div>

          {/* Sosyal CTA — Telegram + X yan yana */}
          <div className="mx-2 mb-2 grid grid-cols-2 gap-1.5 group-data-[collapsible=icon]:grid-cols-1">
            <a
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-md text-[11px] text-[#3da5e0] hover:text-[#5cb8e8] border border-[#0088cc]/30 hover:border-[#0088cc]/50 bg-[#0088cc]/5 hover:bg-[#0088cc]/10 px-2 py-1.5 transition-colors"
              title="Telegram kanalına katıl"
            >
              <TwitterIcon className="size-3" />
              <span className="group-data-[collapsible=icon]:hidden">Telegram</span>
            </a>
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-md text-[11px] text-foreground hover:text-foreground border border-white/15 hover:border-white/25 bg-white/[0.03] hover:bg-white/10 px-2 py-1.5 transition-colors"
              title="X (Twitter) takip et"
            >
              <XIcon className="size-3" />
              <span className="group-data-[collapsible=icon]:hidden">X (Twitter)</span>
            </a>
          </div>

          {!isAdmin && daysLeft !== null && (
            <div className="px-2 pb-2 group-data-[collapsible=icon]:hidden">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-center">
                <span className={daysLeft < 5 ? "text-amber-400" : "text-emerald-400"}>
                  {daysLeft}
                </span>
                <span className="text-white/40 ml-1">gün kaldı</span>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="mx-2 mb-2 flex items-center gap-2 rounded-md font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 hover:text-white hover:bg-white/[0.04] px-2 py-1.5 group-data-[collapsible=icon]:justify-center transition-colors"
            title="Çıkış"
          >
            <LogOut className="size-3.5" />
            <span className="group-data-[collapsible=icon]:hidden">Çıkış</span>
          </button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-white/10 bg-background/80 backdrop-blur px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2.5">
            <span className="size-1 rounded-full bg-emerald-400/70" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.22em]">
              {[...navItems, ...(isAdmin ? navAdminPanel : [])].find(
                (n) =>
                  n.href === pathname ||
                  (n.href !== "/" && pathname?.startsWith(n.href)),
              )?.label ?? "Dashboard"}
            </span>
          </div>
          <div className="ml-auto md:hidden">
            <HealthBadge />
          </div>
        </header>
        <EmailMissingBanner />
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <SpkFooterNote />
      </SidebarInset>
      <SpkDisclaimerModal visible={!!user} />
      <OnboardingModal />
    </SidebarProvider>
  );
}
