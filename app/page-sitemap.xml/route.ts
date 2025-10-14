export const revalidate = 60 * 60 * 24 * 7; // 1 week

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Static/local pages managed within this app (not headless)
const LOCAL_PAGES: string[] = ["/", "/about", "/contact", "/privacy"]; // extend as needed

export async function GET() {
  const origin = baseUrl();
  const now = new Date().toISOString();

  const urls = LOCAL_PAGES.map((path) => `  <url>\n    <loc>${xmlEscape(`${origin}${path}`)}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`);

  const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

