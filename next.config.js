/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // This allows us to run both React and Next.js in the same project
  experimental: {
    esmExternals: 'loose',
  },
}

module.exports = nextConfig 