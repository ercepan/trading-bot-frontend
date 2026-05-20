"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Clock,
  BarChart3,
  ChevronDown,
  Filter,
  Star,
  Lock,
  Sparkles,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-context";
import {
  LESSONS,
  LESSON_CATEGORIES,
  TOTAL_LESSONS,
  type LessonCategory,
  type Lesson,
} from "@/lib/egitim-content";
import { LESSON_DIAGRAMS } from "@/components/egitim-diagrams";

const PRICE_USD = 40;

const LEVEL_COLORS: Record<string, string> = {
  "Başlangıç": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Orta":      "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "İleri":     "bg-red-500/15 text-red-400 border-red-500/30",
};

const CATEGORY_COLORS: Record<LessonCategory, string> = {
  TA:     "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  RISK:   "bg-amber-500/10 border-amber-500/30 text-amber-400",
  BIST:   "bg-red-500/10 border-red-500/30 text-red-400",
  KRIPTO: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  PSY:    "bg-purple-500/10 border-purple-500/30 text-purple-400",
};

function LessonCard({
  lesson,
  open,
  onToggle,
}: {
  lesson: Lesson;
  open: boolean;
  onToggle: () => void;
}) {
  const cat = LESSON_CATEGORIES.find((c) => c.id === lesson.category);
  return (
    <Card className="overflow-hidden border-border/60">
      <button
        onClick={onToggle}
        className="w-full text-left p-4 md:p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
              CATEGORY_COLORS[lesson.category]
            }`}
          >
            {cat?.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="outline" className={`${CATEGORY_COLORS[lesson.category]} text-[10px]`}>
                {cat?.label}
              </Badge>
              <Badge variant="outline" className={`${LEVEL_COLORS[lesson.level]} text-[10px]`}>
                {lesson.level}
              </Badge>
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <Clock className="size-3" /> {lesson.duration}
              </span>
            </div>
            <h3 className="font-semibold text-base md:text-lg leading-tight">
              {lesson.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{lesson.subtitle}</p>
          </div>
          <ChevronDown
            className={`shrink-0 size-5 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-border/40 px-4 md:px-5 py-5 bg-muted/10">
          {/* Görseller (varsa) — body'den önce göster, dikkat çekmesin */}
          {(LESSON_DIAGRAMS[lesson.id] || []).map((Diagram, i) => (
            <Diagram key={i} />
          ))}

          <div className="space-y-6 prose prose-invert max-w-none">
            {lesson.sections.map((s, i) => (
              <section key={i}>
                <h4 className="text-emerald-400 font-semibold text-base md:text-lg mb-2">
                  {s.heading}
                </h4>
                <div className="text-sm md:text-[15px] text-foreground/90 whitespace-pre-line leading-relaxed">
                  {s.body}
                </div>
                {s.example && (
                  <div className="mt-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-emerald-400 font-semibold mb-1">
                      Örnek
                    </div>
                    <div className="text-sm text-foreground/85 whitespace-pre-line">
                      {s.example}
                    </div>
                  </div>
                )}
                {s.tip && (
                  <div className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-amber-400 font-semibold mb-1">
                      💡 İpucu
                    </div>
                    <div className="text-sm text-foreground/85">{s.tip}</div>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function PremiumPaywall() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-8 md:p-10 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative">
          <div className="size-20 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4">
            <Lock className="size-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Eğitim Seti — Premium Plan'a özel
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            12 kapsamlı ders, görsel anlatımlarla — sadece{" "}
            <span className="text-emerald-400 font-semibold">$40 / ay</span> Premium plan
            aboneleri için açık.
          </p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
            {[
              { num: "12", label: "Ders" },
              { num: "5", label: "Kategori" },
              { num: "~2sa", label: "Okuma" },
              { num: "9+", label: "Görsel" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border/60 bg-background/40 p-3 text-center"
              >
                <div className="text-2xl font-bold text-emerald-400">{s.num}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link
              href="/satin-al?plan=education"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-3 transition-colors"
            >
              <Sparkles className="size-4" />
              Premium'a yükselt — $40
            </Link>
            <Link
              href="/yenile"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-border hover:bg-accent px-5 py-3 text-sm transition-colors"
            >
              Yenile
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
        <h3 className="font-semibold text-foreground mb-3">
          Eğitim Seti'nde neler var?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {LESSONS.map((l) => (
            <div key={l.id} className="flex items-start gap-2 text-muted-foreground">
              <Check className="size-4 text-emerald-400/60 mt-0.5 shrink-0" />
              <div>
                <div className="text-foreground/80 font-medium">{l.title.split("—")[0].trim()}</div>
                <div className="text-[11px]">{l.duration} · {l.level}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EgitimPage() {
  const { user, subscription } = useAuth();
  const [activeCat, setActiveCat] = useState<LessonCategory | "ALL">("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

  // Premium check: admin her zaman görür, subscriber is_premium=1 ise görür
  const hasAccess =
    user?.role === "admin" ||
    Boolean(subscription?.is_premium);

  const filtered = useMemo(() => {
    if (activeCat === "ALL") return LESSONS;
    return LESSONS.filter((l) => l.category === activeCat);
  }, [activeCat]);

  const stats = useMemo(() => {
    const byCat: Record<string, number> = {};
    LESSONS.forEach((l) => {
      byCat[l.category] = (byCat[l.category] || 0) + 1;
    });
    return byCat;
  }, []);

  // Premium değilse paywall göster
  if (!hasAccess) {
    return <PremiumPaywall />;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* HERO */}
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <GraduationCap className="size-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/55 uppercase tracking-[0.28em]">
              08 / Eğitim Seti · Premium
            </span>
          </div>
          <h1
            className="font-display font-medium tracking-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
          >
            Sıfırdan{" "}
            <em className="text-emerald-400" style={{ fontStyle: "italic", fontWeight: 600 }}>
              profesyonele.
            </em>
          </h1>
          <p className="font-mono text-[10px] text-white/45 uppercase tracking-[0.18em]">
            Kripto · Türk borsası · risk · psikoloji
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-4">
            <div className="font-display text-2xl font-medium tabular-nums text-emerald-400 tracking-tight">{TOTAL_LESSONS}</div>
            <div className="font-mono text-[10px] text-white/45 mt-2 uppercase tracking-[0.22em]">Ders</div>
          </div>
          <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-4">
            <div className="font-display text-2xl font-medium tabular-nums text-emerald-400 tracking-tight">5</div>
            <div className="font-mono text-[10px] text-white/45 mt-2 uppercase tracking-[0.22em]">Kategori</div>
          </div>
          <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-4">
            <div className="font-display text-2xl font-medium tabular-nums text-emerald-400 tracking-tight">~2sa</div>
            <div className="font-mono text-[10px] text-white/45 mt-2 uppercase tracking-[0.22em]">Toplam Okuma</div>
          </div>
          <div className="bg-amber-500/[0.06] border border-amber-500/30 p-4">
            <div className="font-display text-2xl font-medium tabular-nums text-amber-400 tracking-tight inline-flex items-center gap-1.5">
              ${PRICE_USD}
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
            </div>
            <div className="font-mono text-[10px] text-amber-300/70 mt-2 uppercase tracking-[0.22em]">Premium · ay</div>
          </div>
        </div>

        <div className="border-l-2 border-emerald-500/30 bg-emerald-500/[0.03] pl-4 py-3 pr-3">
          <p className="text-sm text-white/70 leading-relaxed">
            <strong className="text-white/90">Kimler için?</strong> Yeni başlayanlar, deneyimli ama metodolojisi olmayan trader'lar, bilanço okumayı öğrenmek isteyen yatırımcılar. <strong className="text-white/90">Format:</strong> Kolay dilde, somut örneklerle.
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mr-1">
          <Filter className="size-3.5" /> Filtre:
        </span>
        <Button
          variant={activeCat === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCat("ALL")}
          className="h-8"
        >
          Tümü ({TOTAL_LESSONS})
        </Button>
        {LESSON_CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCat === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCat(cat.id)}
            className="h-8"
          >
            {cat.emoji} {cat.label}{" "}
            <span className="text-[10px] opacity-60 ml-1">
              ({stats[cat.id] || 0})
            </span>
          </Button>
        ))}
      </div>

      {/* LESSONS */}
      <div className="space-y-3">
        {filtered.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            open={openId === lesson.id}
            onToggle={() => setOpenId(openId === lesson.id ? null : lesson.id)}
          />
        ))}
      </div>

      {/* FOOTER NOT */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-5 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <BarChart3 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-foreground mb-1">Eğitim devam ediyor</div>
            <p className="leading-relaxed">
              Yeni içerikler her ay eklenir: pattern tanıma derinleştirme, opsiyon stratejileri,
              kripto on-chain analiz, sektör bazlı BIST analizleri. İçerik genişledikçe abone
              olduğunuz dönem boyunca ek ücret alınmaz.
            </p>
            <p className="mt-3 text-xs">
              <span className="text-amber-400 font-medium">⚠ Yatırım tavsiyesi değildir.</span>{" "}
              Eğitim materyali bilgi amaçlıdır. Yatırım kararları size aittir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
