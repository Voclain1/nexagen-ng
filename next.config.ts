import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Matches the existing nexagen.ng URLs (/services/, /work/ …) so nothing changes for Google.
  trailingSlash: true,
  // Content is read from the filesystem at request time (ISR, scheduled posts, gated
  // downloads), so make sure it ships with every server function.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "image.mux.com" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ] },
      { source: "/(account|api)/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  async redirects() {
    // One canonical host. (Also set www → apex in Vercel → Domains; this covers any other path.)
    return [{ source: "/:path*", has: [{ type: "host", value: "www.nexagen.ng" }], destination: "https://nexagen.ng/:path*", permanent: true }];
  },
};

export default nextConfig;
