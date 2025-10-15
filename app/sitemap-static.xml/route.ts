import { NextResponse } from "next/server";

export const revalidate = 86400; // 1 day

export async function GET() {
  // Define aquí tus páginas de Next.js (landings, comparadores, etc.)
  const staticPages = [
    "https://actudubai.com/",
    // Añade aquí solo las páginas reales que existan en tu Next.js
    // "https://actudubai.com/contact",
    // "https://actudubai.com/about-us",
    // "https://actudubai.com/comparador-de-tarjetas",
   
  ];

  const lastmod = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map(
        (url) => `
      <url>
        <loc>${url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>`
      )
      .join("")}
  </urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
