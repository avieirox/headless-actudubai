import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

function fallbackIndex(origin: string) {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${origin}/sitemap-static.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
}

export async function GET() {
  const origin = baseUrl();
  const WP_SITEMAP_URL = "https://backoffice.actudubai.com/sitemap_index.xml";

  try {
    const res = await fetch(WP_SITEMAP_URL, { cache: "no-store" });
    if (!res.ok) {
      console.error("❌ Error fetch sitemap:", res.status, res.statusText);
      const xml = fallbackIndex(origin);
      return new NextResponse(xml, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }

    const xml = await res.text();

    if (!xml || xml.trim().length === 0) {
      console.error("⚠️ XML empty, fallback");
      const xml = fallbackIndex(origin);
      return new NextResponse(xml, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }

    const replacedXml = xml.replaceAll(/https:\/\/backoffice\.actudubai\.com/g, origin);

    if (replacedXml.includes("</sitemapindex>")) {
      const now = new Date().toISOString();
      const augmented = replacedXml.replace(
        "</sitemapindex>",
        `  <sitemap>
    <loc>${origin}/sitemap-static.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`
      );
      return new NextResponse(augmented, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }

    return new NextResponse(replacedXml, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (error) {
    console.error("💥 Error al generar sitemap:", error);
    const xml = fallbackIndex(origin);
    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
