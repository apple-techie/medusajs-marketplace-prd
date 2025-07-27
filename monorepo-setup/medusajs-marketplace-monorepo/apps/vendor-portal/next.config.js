/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@marketplace/ui', '@marketplace/core', '@marketplace/types'],
}

module.exports = nextConfig