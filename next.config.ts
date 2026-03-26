import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
  }),
};

export default nextConfig;
