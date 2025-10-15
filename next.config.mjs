/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backoffice.actudubai.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {},
  async rewrites() {
    return [
      // Paginated sub-sitemaps e.g., /post-sitemap2.xml, /tag-sitemap3.xml
      {
        source: "/:name(.*)-sitemap:page(\\d+)\\.xml",
        destination: "/api/sitemap-proxy?name=:name&page=:page",
      },
      // Base sub-sitemaps e.g., /post-sitemap.xml, /tag-sitemap.xml
      {
        source: "/:name(.*)-sitemap.xml",
        destination: "/api/sitemap-proxy?name=:name",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/categoria/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
