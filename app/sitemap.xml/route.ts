import { NextResponse } from "next/server";

export const revalidate = 86400; // 1 day
export const dynamic = "force-dynamic"; // evitar caché agresiva en local/dev

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

function fallbackIndex(origin: string) {
  const now = new Date().toISOString();
  // Índice mínimo funcional que apunta a los sub-sitemaps servidos por rewrites + proxy
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${origin}/sitemap-static.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${origin}/post-sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${origin}/page-sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${origin}/category-sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${origin}/tag-sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${origin}/author-sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n</sitemapindex>`;
}

export async function GET() {
  const origin = baseUrl();
  const WP_SITEMAP_URL = "https://backoffice.actudubai.com/sitemap_index.xml";

  try {
    const res = await fetch(WP_SITEMAP_URL, { next: { revalidate } });
    if (!res.ok) {
      console.error("Sitemap upstream fetch failed", res.status, res.statusText);
      const xml = fallbackIndex(origin);
      return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
    }
    const xml = await res.text();
    const replacedXml = xml.replaceAll(/https:\/\/backoffice\.actudubai\.com/g, origin);

    // Si Yoast devuelve un sitemapindex, inyectamos el sitemap estático propio
    if (replacedXml.includes("</sitemapindex>")) {
      const now = new Date().toISOString();
      const augmented = replacedXml.replace(
        "</sitemapindex>",
        `  <sitemap>\n    <loc>${origin}/sitemap-static.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n</sitemapindex>`
      );
      return new NextResponse(augmented, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }

    // En caso de no ser un índice, devolvemos el XML reescrito tal cual
    return new NextResponse(replacedXml, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (e) {
    console.error("Sitemap generation error", e);
    const xml = fallbackIndex(origin);
    return new NextResponse(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
  }
}
