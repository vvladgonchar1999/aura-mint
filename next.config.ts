import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },      
    ],
    domains: ['gateway.pinata.cloud', 'ipfs.io','encrypted-tbn0.gstatic.com','image-cdn-ak.spotifycdn.com','i.pinimg.com'],
    dangerouslyAllowSVG: true, 
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", 
  },
};

export default nextConfig;
