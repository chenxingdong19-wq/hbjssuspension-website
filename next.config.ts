import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 图片/媒体资源：长缓存（文件名不变则复用，加速加载）
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Next.js 构建产物（带 hash 文件名）：长缓存
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // 所有 HTML 页面：禁止缓存，每次都从服务器拿最新内容
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, no-cache, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;