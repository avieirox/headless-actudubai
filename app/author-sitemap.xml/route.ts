import { NextResponse } from "next/server";

export const revalidate = 86400; // 1 day
export const dynamic = "force-dynamic";

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export async function GET() {
  const origin = baseUrl();
  const upstream = "https://backoffice.actudubai.com/author-sitemap.xml";
  try {
    const res = await fetch(upstream, { next: { revalidate } });
    if (!res.ok) return new NextResponse("Upstream sitemap not found", { status: res.status });
    const xml = await res.text();
    const replaced = xml.replaceAll(/https:\/\/backoffice\.actudubai\.com/g, origin);
    return new NextResponse(replaced, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
  } catch (e) {
    return new NextResponse("Sitemap proxy error", { status: 500 });
  }
}

