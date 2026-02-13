import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  },
  experimental: {
    // Increase body size limit for file uploads to 4MB (Vercel free tier limit)
    // This allows streaming files through API
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  // Add rewrites to handle static HTML files
  async rewrites() {
    return [
      {
        source: '/udfqcfua9mzrfa6zp5jath0qx5skal.html',
        destination: '/api/serve-html?file=udfqcfua9mzrfa6zp5jath0qx5skal.html',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "72.62.241.128",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.facebook.com",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
