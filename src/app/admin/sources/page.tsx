"use client";

import { useAuth } from "@/components/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, ExternalLink, Globe, Newspaper, Bot, TrendingUp, Lock } from "lucide-react";

type Source = {
  category: string;
  name: string;
  url?: string;
  purpose: string;
  cost: "Ücretsiz" | "API key" | "Paid";
  rate_limit?: string;
};

const SOURCES: Source[] = [
  // BIST
  {
    category: "BIST",
    name: "yfinance",
    url: "https://github.com/ranaroussi/yfinance",
    purpose: "BIST100 hisse fiyat + hacim + 30g geçmiş + son haberler",
    cost: "Ücretsiz",
    rate_limit: "~2/sn (informal)",
  },
  {
    category: "BIST",
    name: "KAP (Kamuyu Aydınlatma Platformu)",
    url: "https://www.kap.org.tr",
    purpose: "Şirketlerin SPK'ya sundukları resmi açıklamalar",
    cost: "Ücretsiz",
    rate_limit: "API yok (Next.js'e geçti, scraping zor)",
  },
  {
    category: "BIST",
    name: "Bigpara (eski)",
    url: "https://www.bigpara.com.tr",
    purpose: "Türkçe finans haberleri (bugün yfinance.get_news() ile değiştirildi)",
    cost: "Ücretsiz",
    rate_limit: "Şu an kullanımda değil",
  },
  // ABD/WSB
  {
    category: "ABD Hisse",
    name: "APE Wisdom",
    url: "https://apewisdom.io",
    purpose: "r/wallstreetbets agregeli mention sayıları",
    cost: "Ücretsiz",
    rate_limit: "100 req/saat",
  },
  {
    category: "ABD Hisse",
    name: "FinnHub",
    url: "https://finnhub.io",
    purpose: "Analyst rating, news sentiment, recommendation trend",
    cost: "API key (ücretsiz tier)",
    rate_limit: "60 req/dk",
  },
  {
    category: "ABD Hisse",
    name: "yfinance (US)",
    url: "https://github.com/ranaroussi/yfinance",
    purpose: "Hisse fiyat + teknik göstergeler (RSI/EMA)",
    cost: "Ücretsiz",
  },
  // AI
  {
    category: "AI",
    name: "Claude Haiku (Anthropic)",
    url: "https://www.anthropic.com",
    purpose: "Türkçe haber/KAP sentiment, signal değerlendirme, Strategy Lab üretimi",
    cost: "Pay-per-token",
    rate_limit: "Tier'a bağlı",
  },
  // Crypto
  {
    category: "Crypto Trading",
    name: "MEXC (ccxt)",
    url: "https://www.mexc.com",
    purpose: "Spot + futures emir, hesap, balance, leverage",
    cost: "API key",
    rate_limit: "20 req/sn",
  },
  {
    category: "Crypto Trading",
    name: "Binance (ccxt)",
    url: "https://www.binance.com",
    purpose: "Yedek borsa, fiyat fallback",
    cost: "API key",
    rate_limit: "1200 req/dk",
  },
  // TradingView
  {
    category: "Sinyal Kaynağı",
    name: "TradingView Webhook",
    url: "https://www.tradingview.com",
    purpose: "Pine Script alarmları → /webhook/{tier_id} POST",
    cost: "Pro plan ($14.95/ay)",
    rate_limit: "Plan'a göre",
  },
  // Bildirim
  {
    category: "Bildirim",
    name: "Telegram Bot API",
    url: "https://core.telegram.org/bots/api",
    purpose: "Trade açılış/kapanış, hata, günlük özet, DB backup",
    cost: "Ücretsiz",
    rate_limit: "30 mesaj/sn",
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  BIST: <Globe className="size-4" />,
  "ABD Hisse": <TrendingUp className="size-4" />,
  AI: <Bot className="size-4" />,
  "Crypto Trading": <Database className="size-4" />,
  "Sinyal Kaynağı": <Newspaper className="size-4" />,
  Bildirim: <ExternalLink className="size-4" />,
};

export default function AdminSourcesPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-sm text-muted-foreground">Yükleniyor…</div>;
  if (user?.role !== "admin") {
    return (
      <Card className="max-w-md border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-6 text-sm flex items-start gap-3">
          <Lock className="size-4 text-amber-400 mt-0.5" />
          <span>Bu sayfa sadece admin için.</span>
        </CardContent>
      </Card>
    );
  }

  // Group by category
  const byCategory = SOURCES.reduce(
    (acc, s) => {
      (acc[s.category] ??= []).push(s);
      return acc;
    },
    {} as Record<string, Source[]>,
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Database className="size-6" /> Veri Kaynakları (Admin)
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bu sayfa sadece admin görür. Subscriber'lara hiçbir kaynak adı gösterilmez —
          sadece analiz sonuçları ve sinyaller.
        </p>
      </div>

      {Object.entries(byCategory).map(([cat, sources]) => (
        <Card key={cat}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {CATEGORY_ICONS[cat]} {cat}
              <Badge variant="outline" className="ml-auto">
                {sources.length} kaynak
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left py-2 w-1/4">Kaynak</th>
                  <th className="text-left py-2">Amaç</th>
                  <th className="text-left py-2 w-32">Maliyet</th>
                  <th className="text-left py-2 w-32">Limit</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.name} className="border-b border-border/30 align-top">
                    <td className="py-2.5 pr-2">
                      <div className="font-medium">{s.name}</div>
                      {s.url && (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-muted-foreground hover:text-foreground underline inline-flex items-center gap-1"
                        >
                          aç <ExternalLink className="size-2.5" />
                        </a>
                      )}
                    </td>
                    <td className="py-2.5 text-muted-foreground pr-2">{s.purpose}</td>
                    <td className="py-2.5">
                      <Badge
                        variant="outline"
                        className={
                          s.cost === "Ücretsiz"
                            ? "border-emerald-500/30 text-emerald-400"
                            : s.cost === "API key"
                              ? "border-blue-500/30 text-blue-400"
                              : "border-amber-500/30 text-amber-400"
                        }
                      >
                        {s.cost}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-[11px] text-muted-foreground">
                      {s.rate_limit ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}

      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="pt-6 text-xs text-muted-foreground">
          <strong className="text-foreground">Not:</strong> Subscriber sayfalarında
          (BIST, WSB, Stock Signals) tüm kaynak isimleri kaldırıldı. Sadece "AI sentiment",
          "topluluk mention", "resmi açıklama" gibi neutral terimler görünür.
        </CardContent>
      </Card>
    </div>
  );
}
