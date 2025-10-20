import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: '',
        pathname: "/**"
      }
    ]
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          { key: "Origin-Agent-Cluster", value: "?1" },
        ],
      },
    ];
  },
  reactStrictMode: false
};

export default nextConfig;
