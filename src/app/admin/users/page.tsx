"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { authApi } from "@/lib/auth";
import { fmtDate } from "@/lib/api";
import { Users } from "lucide-react";

type UserRow = {
  id: number;
  username: string;
  role: string;
  created_at: string;
  last_login_at: string | null;
  sub_code: string | null;
  sub_activated_at: string | null;
  sub_expires_at: string | null;
  sub_status: string | null;
  sub_device_id: string | null;
};

function daysLeft(expires: string | null): number | null {
  if (!expires) return null;
  return Math.max(0, Math.ceil((new Date(expires).getTime() - Date.now()) / 86400000));
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const list = await authApi.listUsers();
        if (alive) setUsers(list);
      } catch (e: unknown) {
        if (alive) setErr(e instanceof Error ? e.message : "yükleme hatası");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const stats = {
    total: users?.length ?? 0,
    activeSubs: users?.filter((u) => u.sub_status === "active").length ?? 0,
    expired: users?.filter((u) => u.sub_status === "expired").length ?? 0,
    admins: users?.filter((u) => u.role === "admin").length ?? 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Users className="size-5" /> Kullanıcılar
        </h1>
        <p className="text-sm text-muted-foreground">
          Tüm kayıtlı kullanıcılar + abonelik durumu + cihaz bağlama bilgisi
        </p>
      </div>

      {err && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-sm text-red-400">{err}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Aktif abonelik</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-emerald-400">
              {stats.activeSubs}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Süresi dolmuş</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-amber-400">
              {stats.expired}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Admin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm kullanıcılar</CardTitle>
          <CardDescription>Sıralama: en yeni kayıt üstte</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Kayıt</TableHead>
                    <TableHead>Son giriş</TableHead>
                    <TableHead>Abonelik</TableHead>
                    <TableHead className="text-right">Kalan gün</TableHead>
                    <TableHead>Cihaz</TableHead>
                    <TableHead>Aktif kod</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const days = daysLeft(u.sub_expires_at);
                    const subActive = u.sub_status === "active" && days !== null && days > 0;
                    return (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium font-mono">{u.username}</TableCell>
                        <TableCell>
                          {u.role === "admin" ? (
                            <Badge className="bg-primary/20 border-primary/40 text-primary">
                              admin
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              subscriber
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {fmtDate(u.created_at)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {u.last_login_at ? fmtDate(u.last_login_at) : "—"}
                        </TableCell>
                        <TableCell>
                          {u.role === "admin" ? (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          ) : subActive ? (
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                              aktif
                            </Badge>
                          ) : u.sub_status === "expired" ? (
                            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                              süresi doldu
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              yok
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {u.role === "admin" ? (
                            <span className="text-xs text-muted-foreground">∞</span>
                          ) : days !== null ? (
                            <span
                              className={
                                days < 5
                                  ? "text-amber-400 font-semibold"
                                  : days === 0
                                  ? "text-red-400"
                                  : ""
                              }
                            >
                              {days}
                            </span>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {u.sub_device_id ? u.sub_device_id.slice(0, 8) + "…" : "—"}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {u.sub_code ?? "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Henüz kullanıcı yok. /admin/codes'tan davet kodu üret.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
