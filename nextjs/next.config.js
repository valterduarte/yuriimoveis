/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'www.re9.com.br',
      },
      {
        protocol: 'https',
        hostname: 'valterduarte.github.io',
      },
      {
        protocol: 'https',
        hostname: 'www.oceanosasco.com.br',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
}

module.exports = nextConfig
