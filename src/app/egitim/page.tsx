"use client";

import { useState, useMemo } from "react";
import { GraduationCap, Clock, BarChart3, ChevronDown, Filter, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LESSONS,
  LESSON_CATEGORIES,
  TOTAL_LESSONS,
  type LessonCategory,
  type Lesson,
} from "@/lib/egitim-content";

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

export default function EgitimPage() {
  const [activeCat, setActiveCat] = useState<LessonCategory | "ALL">("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

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

  return (
    <div className="space-y-6 max-w-5xl">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6 md:p-8">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <GraduationCap className="size-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Nexora <span className="text-emerald-400">Eğitim Seti</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Sıfırdan profesyonele — kripto + Türk borsası için kapsamlı rehber
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="rounded-lg border border-border/60 bg-background/40 p-3">
              <div className="text-2xl font-bold text-emerald-400">{TOTAL_LESSONS}</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Ders
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/40 p-3">
              <div className="text-2xl font-bold text-emerald-400">5</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Kategori
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/40 p-3">
              <div className="text-2xl font-bold text-emerald-400">~2sa</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Toplam okuma
              </div>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <div className="text-2xl font-bold text-amber-400 flex items-center gap-1">
                ${PRICE_USD}
                <Star className="size-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Premium / ay
              </div>
            </div>
          </div>

          <div className="mt-5 text-sm text-muted-foreground leading-relaxed">
            🎯 <span className="text-foreground font-medium">Kimler için?</span>{" "}
            Yeni başlayanlar, deneyimli ama metodolojisi olmayan trader'lar, bilanço
            okumayı öğrenmek isteyen yatırımcılar.{" "}
            <span className="text-foreground font-medium">Format:</span> Kolay dilde,
            somut örneklerle.
          </div>
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
