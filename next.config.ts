import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/hear-navi' : '',
  images: {
    unoptimized: true,
  },
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
  }),
};

export default nextConfig;
