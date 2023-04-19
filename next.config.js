/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh', 'tailwindui.com']
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@tremor/react']
  },
  reactStrictMode: false
};

module.exports = nextConfig;
