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
