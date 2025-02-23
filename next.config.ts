
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blush-passive-cephalopod-560.mypinata.cloud'
      }
    ]
  }
};

export default nextConfig;
