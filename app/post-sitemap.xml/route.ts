import { wpRequest } from "@/lib/wpClient";
import { ALL_POSTS_BARE_QUERY } from "@/lib/wpQueries";

export const revalidate = 604800; // 1 week

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

type PostsRes = {
  posts?: { nodes?: { slug: string; date: string; categories?: { nodes?: { slug: string }[] } }[] };
};

export async function GET() {
  const origin = baseUrl();
  const data = await wpRequest<PostsRes>(ALL_POSTS_BARE_QUERY);
  const posts = data?.posts?.nodes ?? [];

  const urls = posts.map((p) => {
    const cat = p.categories?.nodes?.[0]?.slug;
    const path = cat ? `/${cat}/${p.slug}` : `/blog/${p.slug}`;
    const loc = `${origin}${path}`;
    const lastmod = new Date(p.date).toISOString();
    return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
