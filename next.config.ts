import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // App router support
  },
};

export default nextConfig;

