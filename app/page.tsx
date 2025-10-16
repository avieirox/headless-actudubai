import Container from "@/components/Container";
import { wpRequest, wpRequestWithSeoFallback, wpTryQueries } from "@/lib/wpClient";
import { ALL_POSTS_QUERY, ALL_POSTS_QUERY_NO_SEO, ALL_POSTS_BARE_QUERY, SEO_BY_URI_QUERY } from "@/lib/wpQueries";
import { defaultSEO } from "@/lib/seo";
import type { Metadata } from "next";
import { PostSchema, type AllPostsRes, type Post } from "@/types/wordpress";
import MarketTabs from "@/components/MarketTabs";
import { getQuotes, getChart } from "@/lib/market/yahoo";
import ArticleMasonryCard from "@/components/ArticleMasonryCard";
import Link from "next/link";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await wpRequest<{ nodeByUri?: any }>(SEO_BY_URI_QUERY, { uri: "/" });
    const node = data?.nodeByUri as any;
    const seo = node?.seo;
    if (seo) {
      return {
        title: seo.title ?? defaultSEO.title,
        description: seo.metaDesc ?? defaultSEO.description,
        openGraph: {
          type: "website",
          title: seo.opengraphTitle ?? seo.title ?? defaultSEO.title,
          description: seo.opengraphDescription ?? seo.metaDesc ?? defaultSEO.description,
          images: seo.opengraphImage?.mediaItemUrl ? [seo.opengraphImage.mediaItemUrl] : undefined,
        },
      };
    }
  } catch {}
  return {
    title: defaultSEO.title,
    description: defaultSEO.description,
    openGraph: defaultSEO.openGraph as any,
  };
}

export default async function Page() {
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
  const isPost = (n: any): n is Post => PostSchema.safeParse(n).success;
  const posts: Post[] = rawNodes.filter(isPost);

  const featuredPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3, 12);

  return (
    <>
      {/* PREMIUM HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white py-24 sm:py-40">
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <Container>
          <div className="relative z-10 max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm">
              <span className="text-sm font-semibold text-blue-200">✨ Premium Financial Intelligence</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold font-heading mb-8 leading-[1.1] text-white">
              Global Markets <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Intelligence</span> Platform
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed font-light">
              Real-time market data, professional-grade analytics, and institutional-quality financial news. Everything you need to make informed investment decisions.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link 
                href="#latest-articles"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative text-white flex items-center gap-2">
                  Explore News <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <Link 
                href="#markets"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-white font-semibold rounded-lg transition-all border border-slate-600 hover:border-slate-500 backdrop-blur-sm"
              >
                View Markets
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-700/50">
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  24/7
                </div>
                <p className="text-slate-400 text-sm font-medium">Real-Time Updates</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  1000+
                </div>
                <p className="text-slate-400 text-sm font-medium">Assets Tracked</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Global
                </div>
                <p className="text-slate-400 text-sm font-medium">Market Coverage</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* MARKETS SECTION */}
      {(trackers.length || stocks.length || crypto.length || etfs.length) ? (
        <section id="markets" className="py-20 sm:py-28 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <Container>
            <div className="mb-16">
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide">
                MARKET DATA
              </div>
              <h2 className="text-5xl sm:text-6xl font-bold font-heading mb-4 text-slate-900 dark:text-white">
                Market Summary
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                Powered by Yahoo Finance APIs with real-time quotes and historical analysis
              </p>
            </div>
            <MarketTabs data={{ trackers, stocks, crypto, etfs }} />
          </Container>
        </section>
      ) : null}

      {/* FEATURED ARTICLES SECTION */}
      {featuredPosts.length > 0 && (
        <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-950">
          <Container>
            <div className="mb-16">
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wide">
                FEATURED STORIES
              </div>
              <h2 className="text-5xl sm:text-6xl font-bold font-heading mb-4 text-slate-900 dark:text-white">
                Top Financial Stories
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                Curated market insights and analysis from industry experts
              </p>
            </div>

            {/* Featured Posts Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post, idx) => (
                <Link 
                  key={post.slug}
                  href={`/${post.categories?.nodes?.[0]?.slug || 'news'}/${post.slug}`}
                  className="group overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image container */}
                  <div className="relative h-72 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                    {post.featuredImage?.node?.sourceUrl && (
                      <img 
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category badge */}
                    {post.categories?.nodes?.[0] && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                          {post.categories.nodes[0].name}
                        </span>
                      </div>
                    )}

                    {/* Number badge */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-lg border border-white/30">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col">
                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">
                      {post.excerpt?.replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                      <span className="group-hover:translate-x-2 transition-transform duration-300 text-blue-600 dark:text-blue-400 font-bold">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* LATEST ARTICLES SECTION */}
      <section id="latest-articles" className="py-20 sm:py-28 bg-white dark:bg-slate-900">
        <Container>
          <div className="mb-16">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-semibold tracking-wide">
              LATEST UPDATES
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold font-heading mb-4 text-slate-900 dark:text-white">
              Financial News
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Stay updated with breaking news and market analysis across all asset classes
            </p>
          </div>

          {remainingPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-600 dark:text-slate-400 text-lg">No articles available at this moment.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {remainingPosts.map((p) => (
                <ArticleMasonryCard key={p.slug} post={p as any} />
              ))}
            </div>
          )}

          {posts.length > 9 && (
            <div className="text-center mt-16">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/30"
              >
                View All Articles
                <span>→</span>
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-950">
        <Container>
          <div className="mb-16">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide">
              PLATFORM FEATURES
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold font-heading text-slate-900 dark:text-white">
              Why Choose Our Platform
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: (
                  <svg className="w-12 h-12 mx-auto text-slate-400 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Real-Time Data',
                desc: 'Live market quotes updated every second'
              },
              { 
                icon: (
                  <svg className="w-12 h-12 mx-auto text-slate-400 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v1a2 2 0 002 2 2 2 0 012-2v-1a2 2 0 012-2 2 2 0 002-2v-1a2 2 0 012-2h2.945M8 3a1 1 0 00-.894.553L7.382 5H4c-1.105 0-2 .895-2 2v2c0 1.104.895 2 2 2h3.382l.724 1.447A1 1 0 0010 13h4c1.105 0 2-.896 2-2V7c0-1.105-.895-2-2-2h-3.382l-.724-1.447A1 1 0 0012 3H8z" />
                  </svg>
                ),
                title: 'Global Coverage',
                desc: 'Access stocks, crypto, ETFs, and indices'
              },
              { 
                icon: (
                  <svg className="w-12 h-12 mx-auto text-slate-400 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: 'Deep Analysis',
                desc: 'Professional-grade technical analysis tools'
              },
              { 
                icon: (
                  <svg className="w-12 h-12 mx-auto text-slate-400 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Mobile Ready',
                desc: 'Fully optimized for mobile and desktop'
              },
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-xl bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center text-center">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-3xl"></div>

        <Container>
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-5xl sm:text-6xl font-bold font-heading text-white mb-6">
              Ready to Optimize Your Portfolio?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Join thousands of investors and traders who trust our platform for real-time market insights and professional financial analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#latest-articles"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl"
              >
                Start Exploring <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-all border-2 border-white/50 backdrop-blur-sm"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
