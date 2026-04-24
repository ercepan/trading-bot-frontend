"use client";

import {
  LayoutDashboard,
  TrendingUp,
  History,
  AlertTriangle,
  Settings,
  Bot,
  Wifi,
  WifiOff,
  Radar,
  FlaskConical,
} from "lucide-react";
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

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/positions", label: "Açık Pozisyonlar", icon: TrendingUp },
  { href: "/history", label: "Geçmiş", icon: History },
  { href: "/wsb", label: "WSB Radar", icon: Radar },
  { href: "/lab", label: "Strategy Lab", icon: FlaskConical },
  { href: "/errors", label: "Hatalar", icon: AlertTriangle },
  { href: "/settings", label: "Ayarlar", icon: Settings },
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
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Bot className="size-4" />
            </div>
            <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sm">Trading Bot</span>
              <span className="text-[11px] text-muted-foreground">
                BTC · ETH · SOL
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
                {nav.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === "/"
                      ? pathname === "/"
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
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:hidden">
            <span className="text-[11px] text-muted-foreground">v2.0</span>
            <HealthBadge />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 backdrop-blur px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="text-sm font-medium">
            {nav.find(
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
      </SidebarInset>
    </SidebarProvider>
  );
}
