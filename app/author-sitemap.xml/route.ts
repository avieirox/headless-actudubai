import { wpRequest } from "@/lib/wpClient";
import { ALL_AUTHORS_QUERY } from "@/lib/wpQueries";

export const revalidate = 60 * 60 * 24 * 7; // 1 week

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

type AuthorsRes = { users?: { nodes?: { slug: string }[] } };

export async function GET() {
  const origin = baseUrl();
  let authors: { slug: string }[] = [];
  try {
    const data = await wpRequest<AuthorsRes>(ALL_AUTHORS_QUERY);
    authors = data?.users?.nodes ?? [];
  } catch {
    authors = [];
  }

  const now = new Date().toISOString();
  const urls = authors.map((a) => {
    const loc = `${origin}/author/${a.slug}`;
    return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

