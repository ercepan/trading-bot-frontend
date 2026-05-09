"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { authApi } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Lock, Loader2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

export default function ProfilPage() {
  const { user, refresh } = useAuth();

  // Email
  const [email, setEmail] = useState(user?.email || "");
  const [emailSubmit, setEmailSubmit] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSubmit, setPwdSubmit] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const onUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean.includes("@") || clean.length < 5) {
      setEmailMsg({ type: "err", text: "Geçerli bir e-posta gir" });
      return;
    }
    if (clean === user?.email) {
      setEmailMsg({ type: "err", text: "Aynı e-posta — değişiklik yok" });
      return;
    }
    setEmailSubmit(true);
    setEmailMsg(null);
    try {
      const res = await authApi.updateEmail(clean);
      setEmailMsg({
        type: "ok",
        text: res.pending
          ? `Onay maili ${clean} adresine gönderildi. Linke tıklayınca güncellenecek (mevcut adresin aktif kalır).`
          : `Onay maili ${clean} adresine gönderildi. Linke tıklayınca aktif olacak.`,
      });
      await refresh();
    } catch (err) {
      setEmailMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Güncelleme başarısız",
      });
    } finally {
      setEmailSubmit(false);
    }
  };

  const onUpdatePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd.length < 6) {
      setPwdMsg({ type: "err", text: "Yeni parola en az 6 karakter" });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: "err", text: "Yeni parolalar eşleşmiyor" });
      return;
    }
    if (newPwd === currentPwd) {
      setPwdMsg({ type: "err", text: "Yeni parola mevcuttan farklı olmalı" });
      return;
    }
    setPwdSubmit(true);
    setPwdMsg(null);
    try {
      await authApi.updatePassword(currentPwd, newPwd);
      setPwdMsg({ type: "ok", text: "Parola değiştirildi ✓" });
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err) {
      setPwdMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Güncelleme başarısız",
      });
    } finally {
      setPwdSubmit(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <User className="size-6 text-emerald-400" /> Profil
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hesap bilgilerini yönet, parolanı değiştir.
        </p>
      </div>

      {/* Hesap bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-400" /> Hesap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Kullanıcı adı</span>
            <span className="font-mono">{user.username}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Rol</span>
            <span className="font-medium">
              {user.role === "admin" ? "Admin" : "Abone"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">E-posta</span>
            <span className={user.email ? "" : "text-amber-400"}>
              {user.email || "(eklenmemiş)"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* E-posta güncelle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="size-4 text-emerald-400" /> E-posta
          </CardTitle>
          <CardDescription className="text-xs">
            Welcome maili, abonelik bitiş uyarıları ve parola sıfırlama için kullanılır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onUpdateEmail} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              disabled={emailSubmit}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {emailMsg && (
              <div
                className={`text-xs flex items-center gap-1.5 ${
                  emailMsg.type === "ok" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {emailMsg.type === "ok" ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <XCircle className="size-3.5" />
                )}
                {emailMsg.text}
              </div>
            )}
            <button
              type="submit"
              disabled={emailSubmit || !email.trim()}
              className="rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 text-sm disabled:opacity-50 inline-flex items-center gap-2"
            >
              {emailSubmit && <Loader2 className="size-3.5 animate-spin" />}
              {user.email ? "E-postayı güncelle" : "E-posta ekle"}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Parola değiştir */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="size-4 text-emerald-400" /> Parola
          </CardTitle>
          <CardDescription className="text-xs">
            Hesap güvenliğin için periyodik olarak değiştir. En az 6 karakter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onUpdatePwd} className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Mevcut parola</label>
              <input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                autoComplete="current-password"
                disabled={pwdSubmit}
                className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Yeni parola</label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                disabled={pwdSubmit}
                className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Yeni parola (tekrar)</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                disabled={pwdSubmit}
                className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            {pwdMsg && (
              <div
                className={`text-xs flex items-center gap-1.5 ${
                  pwdMsg.type === "ok" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {pwdMsg.type === "ok" ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <XCircle className="size-3.5" />
                )}
                {pwdMsg.text}
              </div>
            )}
            <button
              type="submit"
              disabled={pwdSubmit || !currentPwd || !newPwd || !confirmPwd}
              className="rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 text-sm disabled:opacity-50 inline-flex items-center gap-2"
            >
              {pwdSubmit && <Loader2 className="size-3.5 animate-spin" />}
              Parolayı değiştir
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
