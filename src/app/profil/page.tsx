"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { authApi } from "@/lib/auth";
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
    <div className="max-w-3xl space-y-8">
      {/* Hero */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <User className="size-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
            05 / Hesap · Güvenlik
          </span>
        </div>
        <h1
          className="font-display font-medium tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
        >
          Profil{" "}
          <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
            ayarları.
          </em>
        </h1>
        <p className="font-mono text-[10px] text-white/45 uppercase tracking-[0.18em]">
          Hesap bilgileri · e-posta · parola
        </p>
      </div>

      {/* Hesap özet */}
      <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-7 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
            Hesap Özet
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-white/[0.02] border border-white/10 p-4">
            <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">Kullanıcı Adı</div>
            <div className="font-mono text-sm mt-2 text-white/85">@{user.username}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-4">
            <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">Rol</div>
            <div className="font-mono text-sm mt-2 text-white/85 uppercase tracking-[0.18em]">
              {user.role === "admin" ? (
                <span className="text-amber-300">Admin</span>
              ) : (
                <span className="text-emerald-400">Abone</span>
              )}
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-4">
            <div className="font-mono text-[10px] text-white/45 uppercase tracking-[0.22em]">E-Posta</div>
            <div className={`font-mono text-xs mt-2 ${user.email ? "text-white/85" : "text-amber-300"}`}>
              {user.email || "(eklenmemiş)"}
            </div>
          </div>
        </div>
      </div>

      {/* E-posta güncelle */}
      <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-7 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Mail className="size-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              E-posta · Bildirim Kanalı
            </span>
          </div>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em]">
            Welcome · abonelik uyarısı · parola sıfırlama
          </p>
        </div>
        <form onSubmit={onUpdateEmail} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2">
              Yeni E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              disabled={emailSubmit}
              className="w-full bg-white/[0.02] border border-white/15 px-3 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
            />
          </div>
          {emailMsg && (
            <div
              className={`font-mono text-[11px] flex items-center gap-2 px-4 py-2.5 uppercase tracking-wider border ${
                emailMsg.type === "ok"
                  ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300"
                  : "border-red-500/30 bg-red-500/[0.06] text-red-400"
              }`}
            >
              {emailMsg.type === "ok" ? (
                <CheckCircle2 className="size-3.5 shrink-0" />
              ) : (
                <XCircle className="size-3.5 shrink-0" />
              )}
              <span className="normal-case tracking-normal">{emailMsg.text}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={emailSubmit || !email.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 transition-all"
          >
            {emailSubmit && <Loader2 className="size-3.5 animate-spin" />}
            {user.email ? "E-postayı Güncelle" : "E-posta Ekle"}
          </button>
        </form>
      </div>

      {/* Parola */}
      <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 md:p-7 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Lock className="size-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              Parola · Hesap Güvenliği
            </span>
          </div>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em]">
            Min 6 karakter · periyodik değiştir
          </p>
        </div>
        <form onSubmit={onUpdatePwd} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2">
              Mevcut Parola
            </label>
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              autoComplete="current-password"
              disabled={pwdSubmit}
              className="w-full bg-white/[0.02] border border-white/15 px-3 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2">
                Yeni Parola
              </label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                disabled={pwdSubmit}
                className="w-full bg-white/[0.02] border border-white/15 px-3 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-white/45 uppercase tracking-[0.22em] mb-2">
                Tekrar
              </label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                disabled={pwdSubmit}
                className="w-full bg-white/[0.02] border border-white/15 px-3 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] transition-all disabled:opacity-60"
              />
            </div>
          </div>
          {pwdMsg && (
            <div
              className={`font-mono text-[11px] flex items-center gap-2 px-4 py-2.5 uppercase tracking-wider border ${
                pwdMsg.type === "ok"
                  ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300"
                  : "border-red-500/30 bg-red-500/[0.06] text-red-400"
              }`}
            >
              {pwdMsg.type === "ok" ? (
                <CheckCircle2 className="size-3.5 shrink-0" />
              ) : (
                <XCircle className="size-3.5 shrink-0" />
              )}
              <span className="normal-case tracking-normal">{pwdMsg.text}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={pwdSubmit || !currentPwd || !newPwd || !confirmPwd}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 transition-all"
          >
            {pwdSubmit && <Loader2 className="size-3.5 animate-spin" />}
            Parolayı Değiştir
          </button>
        </form>
      </div>
    </div>
  );
}
