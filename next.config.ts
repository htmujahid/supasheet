import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler: true,s

  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
