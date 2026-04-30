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

const navAdmin = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/positions", label: "Açık Pozisyonlar", icon: TrendingUp },
  { href: "/history", label: "Geçmiş", icon: History },
  { href: "/haberler", label: "Haberler", icon: Newspaper },
  { href: "/wsb", label: "ABD Radar", icon: Radar },
  { href: "/bist", label: "BIST Radar", icon: Globe },
  { href: "/signals", label: "Hisse Sinyalleri", icon: Zap },
  { href: "/lab", label: "Strateji Laboratuvarı", icon: FlaskConical },
  { href: "/errors", label: "Hatalar", icon: AlertTriangle },
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
  { href: "/bist", label: "BIST Radar", icon: Globe },
  { href: "/signals", label: "Hisse Sinyalleri", icon: Zap },
  { href: "/wsb", label: "ABD Radar", icon: Radar },
  { href: "/yenile", label: "Yenile", icon: Sparkles },
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

  // Auth sayfalarında, landing'de, legal sayfalarda ve /satin-al'da sidebar yok
  const isAuthPage = pathname?.startsWith("/auth/");
  const isPublicPage =
    pathname === "/" ||
    pathname === "/terms" ||
    pathname === "/kvkk" ||
    pathname === "/satin-al";
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
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex size-9 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 group-data-[collapsible=icon]:size-9">
              <NexoraLogo className="size-7" />
            </div>
            <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-base tracking-tight">
                <span className="text-emerald-400">N</span>EXORA
              </span>
              <span className="text-[10px] text-muted-foreground">
                {user.username} · {isAdmin ? "admin" : "abone"}
              </span>
            </div>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigasyon</SidebarGroupLabel>
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
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
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
            <span className="text-[11px] text-muted-foreground">v2.0</span>
            <HealthBadge />
          </div>
          {!isAdmin && daysLeft !== null && (
            <div className="px-2 pb-2 group-data-[collapsible=icon]:hidden">
              <div className="text-[10px] text-muted-foreground rounded-md border border-border/50 px-2 py-1 text-center">
                <span className={daysLeft < 5 ? "text-amber-400" : ""}>{daysLeft}</span> gün kaldı
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="mx-2 mb-2 flex items-center gap-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-1.5 group-data-[collapsible=icon]:justify-center"
            title="Çıkış"
          >
            <LogOut className="size-3.5" />
            <span className="group-data-[collapsible=icon]:hidden">Çıkış</span>
          </button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 backdrop-blur px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="text-sm font-medium">
            {[...navItems, ...(isAdmin ? navAdminPanel : [])].find(
              (n) =>
                n.href === pathname ||
                (n.href !== "/" && pathname?.startsWith(n.href)),
            )?.label ?? "Dashboard"}
          </div>
          <div className="ml-auto md:hidden">
            <HealthBadge />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <SpkFooterNote />
      </SidebarInset>
      <SpkDisclaimerModal visible={!!user} />
    </SidebarProvider>
  );
}
