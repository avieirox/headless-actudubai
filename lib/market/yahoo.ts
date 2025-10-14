type Params = Record<string, string | number | boolean | undefined>;

const ALLOWED_PATHS = new Set([
  "market/get-quotes",
  "stock/get-detail",
  "stock/get-options",
  "stock/get-chart",
]);

function buildQuery(params?: Params) {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export async function yahooRequest<T>(path: string, params?: Params): Promise<T> {
  if (!ALLOWED_PATHS.has(path)) {
    throw new Error(`Path not allowed: ${path}`);
  }
  const key = process.env.YAHOO_RAPIDAPI_KEY;
  const host = process.env.YAHOO_RAPIDAPI_HOST || "yahoo-finance-real-time1.p.rapidapi.com";
  if (!key) throw new Error("Missing YAHOO_RAPIDAPI_KEY env var");
  const url = `https://${host}/${path}${buildQuery(params)}`;
  const res = await fetch(url, {
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": host,
    },
    // Cache on the server for a minute by default
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Yahoo API error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function getQuotes(symbols: string[], region = process.env.YAHOO_REGION || "US", lang = process.env.YAHOO_LANG || "en-US") {
  return yahooRequest("market/get-quotes", { symbols: symbols.join(","), region, lang });
}

export async function getOptions(symbol: string, region = process.env.YAHOO_REGION || "US", lang = process.env.YAHOO_LANG || "en-US") {
  return yahooRequest("stock/get-options", { symbol, region, lang });
}

export async function getChart(
  symbol: string,
  {
    range = "1d",
    interval = "5m",
    region = process.env.YAHOO_REGION || "US",
    lang = process.env.YAHOO_LANG || "en-US",
  }: { range?: string; interval?: string; region?: string; lang?: string } = {}
) {
  return yahooRequest("stock/get-chart", { symbol, range, interval, region, lang });
}
