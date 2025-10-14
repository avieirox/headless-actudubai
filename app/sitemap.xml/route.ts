// Index sitemap that points to logical sub-sitemaps

export const revalidate = 60 * 60 * 24 * 7; // 1 week

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export async function GET() {
  const origin = baseUrl();
  const now = new Date().toISOString();
  const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${origin}/post-sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${origin}/category-sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${origin}/page-sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${origin}/author-sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n</sitemapindex>`;

  return new Response(index, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
