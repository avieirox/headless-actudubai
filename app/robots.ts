import type { MetadataRoute } from "next";

export const revalidate = 60 * 60 * 24 * 7; // 1 week

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const origin = baseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}

