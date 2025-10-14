import Container from "@/components/Container";
import { wpRequestWithSeoFallback, wpTryQueries } from "@/lib/wpClient";
import { ALL_POSTS_QUERY, ALL_POSTS_QUERY_NO_SEO, ALL_POSTS_BARE_QUERY } from "@/lib/wpQueries";
import { defaultSEO } from "@/lib/seo";
import type { Metadata } from "next";
import { PostSchema, type AllPostsRes } from "@/types/wordpress";
import MarketGrid from "@/components/MarketGrid";
import MarketTabs from "@/components/MarketTabs";
import { getQuotes, getChart } from "@/lib/market/yahoo";
import ArticleMasonryCard from "@/components/ArticleMasonryCard";

export const revalidate = 60; // ISR: cada 60s para noticias frecuentes

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: defaultSEO.title,
    description: defaultSEO.description,
    openGraph: defaultSEO.openGraph as any,
  };
}

export default async function Page() {
  // Try to fetch market quotes; fail gracefully if the API key is missing.
  let quotes: any[] = [];
  let trackers: any[] = [];
  let stocks: any[] = [];
  let crypto: any[] = [];
  let etfs: any[] = [];
  try {
    const normalize = (data: any) => (data?.quotes ?? data?.data ?? data?.result ?? data?.quoteResponse?.result ?? [])
      .map((n: any) => ({
        symbol: n?.symbol ?? n?.ticker ?? "",
        name: n?.shortName ?? n?.longName ?? n?.name ?? null,
        price: n?.regularMarketPrice ?? n?.price ?? null,
        change: n?.regularMarketChange ?? n?.change ?? null,
        changePercent: n?.regularMarketChangePercent ?? n?.changePercent ?? null,
        currency: n?.currency ?? null,
      }))
      .filter((q: any) => q.symbol);

    const trackersSymbols = ["SPY", "QQQ", "DIA", "IWM", "BTC-USD"];
    const stocksSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"];
    const cryptoSymbols = ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "ADA-USD"];
    const etfSymbols = ["SPY", "QQQ", "IWM", "EEM", "XLF", "XLK"];

    const [tData, sData, cData, eData] = await Promise.all([
      getQuotes(trackersSymbols),
      getQuotes(stocksSymbols),
      getQuotes(cryptoSymbols),
      getQuotes(etfSymbols),
    ]);
    trackers = normalize(tData);
    stocks = normalize(sData);
    crypto = normalize(cData);
    etfs = normalize(eData);

    // Fetch sparklines for a subset to respect rate limits
    const symbolsForSpark = Array.from(new Set([
      ...trackers.map((x: any) => x.symbol),
      ...stocks.slice(0, 6).map((x: any) => x.symbol),
      ...crypto.slice(0, 6).map((x: any) => x.symbol),
      ...etfs.slice(0, 6).map((x: any) => x.symbol),
    ])).slice(0, 20);

    const chartResponses = await Promise.allSettled(
      symbolsForSpark.map((s) => getChart(s, { range: "1d", interval: "5m" }))
    );
    const sparkMap = new Map<string, number[]>();
    chartResponses.forEach((res, idx) => {
      if (res.status === "fulfilled") {
        const r: any = res.value;
        // Normalize common Yahoo chart shapes
        const series = r?.chart?.result?.[0] || r?.result || r;
        const closes: number[] =
          series?.indicators?.quote?.[0]?.close ||
          series?.close ||
          series?.prices?.map((p: any) => p?.close).filter((n: number) => typeof n === "number") ||
          [];
        const vals = (closes as number[]).filter((n) => typeof n === "number");
        if (vals.length > 1) sparkMap.set(symbolsForSpark[idx], vals);
      }
    });

    const attach = (arr: any[]) => arr.map((q) => ({ ...q, spark: sparkMap.get(q.symbol) }));
    trackers = attach(trackers);
    stocks = attach(stocks);
    crypto = attach(crypto);
    etfs = attach(etfs);
    quotes = [...trackers, ...stocks, ...crypto, ...etfs].slice(0, 8);
  } catch {}

  const data = await wpTryQueries<AllPostsRes>([
    ALL_POSTS_QUERY,
    ALL_POSTS_QUERY_NO_SEO,
    ALL_POSTS_BARE_QUERY,
  ]);
  const rawNodes = (data as any)?.posts?.nodes ?? [];
  const posts = rawNodes.filter((n: any) => PostSchema.safeParse(n).success);

  return (
    <Container>
      {/* Hero */}
      <section className="mb-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight">Markets & Financial News</h1>
            <p className="text-gray-600 dark:text-slate-400">Real-time snapshots powered by Yahoo Finance + latest articles.</p>
          </div>
        </div>
      </section>

      {/* Markets Section */}
      {(trackers.length || stocks.length || crypto.length || etfs.length) ? (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Market summary</h2>
          {/* Full-width tabs */}
          <MarketTabs data={{ trackers, stocks, crypto, etfs }} />
        </section>
      ) : null}

      {/* Articles (Uniform cards with elegant hover) */}
      <h2 className="mb-6 text-lg font-semibold">Latest Articles</h2>
      {posts.length === 0 ? (
        <p>No articles published.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((p) => (
            <ArticleMasonryCard key={p.slug} post={p as any} />
          ))}
        </div>
      )}
    </Container>
  );
}
