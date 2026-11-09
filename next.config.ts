import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ["26.222.207.224"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload-arquivos.s3-sa-east-1.amazonaws.com",
        port: "",
        pathname: "/img/produtos_fotos/**",
      },
    ],
  },
};

export default nextConfig;
