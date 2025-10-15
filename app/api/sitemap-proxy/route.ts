import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400; // 1 day
export const dynamic = "force-dynamic"; // evitar caché agresiva en local/dev

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export async function GET(req: NextRequest) {
  const origin = baseUrl();
  const name = req.nextUrl.searchParams.get("name") || "";
  const page = req.nextUrl.searchParams.get("page") || "";

  if (!name) {
    return new NextResponse("Missing sitemap name", { status: 400 });
  }

  const pageSuffix = page ? `${page}` : "";
  const upstream = `https://backoffice.actudubai.com/${name}-sitemap${pageSuffix}.xml`;

  try {
    const res = await fetch(upstream, { next: { revalidate } });
    if (!res.ok) {
      return new NextResponse("Upstream sitemap not found", { status: res.status });
    }
    const xml = await res.text();
    const replaced = xml.replaceAll(/https:\/\/backoffice\.actudubai\.com/g, origin);
    return new NextResponse(replaced, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
  } catch (e) {
    return new NextResponse("Sitemap proxy error", { status: 500 });
  }
}
