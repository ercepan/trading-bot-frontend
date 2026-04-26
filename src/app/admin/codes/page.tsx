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
import { ShieldCheck, Plus, Copy, Check, X } from "lucide-react";

type CodeRow = {
  code: string;
  duration_days: number;
  created_at: string;
  used_at: string | null;
  used_by_user_id: number | null;
  status: string;
  note: string | null;
};

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<CodeRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [duration, setDuration] = useState(30);
  const [note, setNote] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const list = await authApi.listCodes();
      setCodes(list);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "yükleme hatası");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setErr(null);
    try {
      await authApi.createCode(duration, note);
      setNote("");
      await refresh();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "oluşturma hatası");
    } finally {
      setCreating(false);
    }
  };

  const onCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const onRevoke = async (code: string) => {
    if (!confirm(`${code} kodunu iptal etmek istediğine emin misin?`)) return;
    try {
      await authApi.revokeCode(code);
      await refresh();
    } catch {}
  };

  const counts = {
    available: codes?.filter((c) => c.status === "available").length ?? 0,
    used: codes?.filter((c) => c.status === "used").length ?? 0,
    revoked: codes?.filter((c) => c.status === "revoked").length ?? 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ShieldCheck className="size-5" /> Davet Kodları
        </h1>
        <p className="text-sm text-muted-foreground">
          Yeni kullanıcılar için 1-aylık invitation kodu üret. Kripto ile sat, kullanıcı kodla
          kayıt olduğunda 30 gün abonelik aktive olur.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Kullanılabilir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-emerald-400">
              {counts.available}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Kullanılmış</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{counts.used}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>İptal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-red-400">
              {counts.revoked}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni kod oluştur</CardTitle>
          <CardDescription>Format: INV-XXXX-XXXX-XXXX (16 karakter)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Süre (gün)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                max={365}
                className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground">Not (opsiyonel)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="örn: ahmet@telegram, BTC ödeme"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="size-3.5" />
              {creating ? "Oluşturuluyor…" : "Kod oluştur"}
            </button>
          </form>
          {err && (
            <div className="mt-3 rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-400">
              {err}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Kodlar ({codes?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : codes && codes.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kod</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">Süre</TableHead>
                    <TableHead>Oluşturuldu</TableHead>
                    <TableHead>Kullanıldı</TableHead>
                    <TableHead>Not</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((c) => (
                    <TableRow key={c.code}>
                      <TableCell className="font-mono text-xs">{c.code}</TableCell>
                      <TableCell>
                        {c.status === "available" ? (
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                            kullanılabilir
                          </Badge>
                        ) : c.status === "used" ? (
                          <Badge variant="outline" className="text-muted-foreground">
                            kullanıldı
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-red-500/30 text-red-400">
                            iptal
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{c.duration_days}g</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{fmtDate(c.created_at)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.used_at ? fmtDate(c.used_at) : "—"}
                      </TableCell>
                      <TableCell className="text-xs">{c.note ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          {c.status === "available" && (
                            <>
                              <button
                                onClick={() => onCopy(c.code)}
                                className="rounded border border-border hover:bg-accent p-1.5"
                                title="Kopyala"
                              >
                                {copied === c.code ? (
                                  <Check className="size-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="size-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => onRevoke(c.code)}
                                className="rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 p-1.5"
                                title="İptal et"
                              >
                                <X className="size-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Henüz kod yok. Yukarıdan ilk kodu oluştur.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
