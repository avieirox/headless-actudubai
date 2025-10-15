import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400; // 1 day
export const dynamic = "force-dynamic";

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

function extractLocs(xml: string): string[] {
  const locs: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) locs.push(m[1]);
  return locs;
}

export async function GET(req: NextRequest) {
  const serverOrigin = req.nextUrl.origin;
  const site = (process.env.NEXT_PUBLIC_SITE_URL || baseUrl()).replace(/\/$/, "");
  const endpoints = {
    posts: `${serverOrigin}/post-sitemap.xml`,
    categories: `${serverOrigin}/category-sitemap.xml`,
    tags: `${serverOrigin}/post_tag-sitemap.xml`,
  } as const;

  async function fetchLocs(url: string): Promise<string[]> {
    try {
      const res = await fetch(url, { next: { revalidate } });
      if (!res.ok) return [];
      const xml = await res.text();
      return extractLocs(xml);
    } catch {
      return [];
    }
  }

  const [postUrls, categoryUrls, tagUrls] = await Promise.all([
    fetchLocs(endpoints.posts),
    fetchLocs(endpoints.categories),
    fetchLocs(endpoints.tags),
  ]);

  const normalize = (u: string) =>
    u
      .replace(/^https?:\/\/backoffice\.actudubai\.com/i, site)
      .replace(new RegExp(`^${serverOrigin.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}`), site);

  const list = (urls: string[]) =>
    urls
      .map((u) => {
        const v = normalize(u);
        return `<li class=\"py-1\"><a class=\"text-sky-600 hover:underline\" href=\"${v}\" rel=\"nofollow\">${v}</a></li>`;
      })
      .join("");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sitemap - Index</title>
    <meta name="robots" content="noindex,follow" />
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif;margin:0;padding:2rem;background:#fff;color:#0f172a}
      .wrap{max-width:1000px;margin:0 auto}
      h1{font-size:1.5rem;margin:0 0 1rem 0}
      h2{font-size:1.1rem;margin:1.5rem 0 .5rem 0}
      .muted{color:#475569}
      ul{list-style:none;padding:0;margin:0}
      .card{background:rgba(15,23,42,.02);border:1px solid #e2e8f0;border-radius:12px;padding:1rem}
      .grid{display:grid;grid-template-columns:1fr;gap:1rem}
      @media(min-width:900px){.grid{grid-template-columns:1fr 1fr}}
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>Sitemap <span class="muted">(posts ${postUrls.length} - categories ${categoryUrls.length} - tags ${tagUrls.length})</span></h1>
      <div class="grid">
        <section class="card">
          <h2>Posts</h2>
          <ul>${list(postUrls)}</ul>
        </section>
        <section class="card">
          <h2>Categories</h2>
          <ul>${list(categoryUrls)}</ul>
        </section>
        <section class="card" style="grid-column:1/-1">
          <h2>Tags</h2>
          <ul>${list(tagUrls)}</ul>
        </section>
      </div>
    </div>
  </body>
 </html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
