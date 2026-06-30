/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    // react-icons subpath barrels (react-icons/fi, /fa, ...) re-export hundreds
    // of icons each; this tree-shakes them to only the icons actually imported.
    optimizePackageImports: ['react-icons'],
  },
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
        hostname: 'valterduarte.github.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Required from Next 16: list every quality passed to next/image.
    qualities: [65, 75],
  },
  async redirects() {
    const categoriaAliases = [
      ['apartamentos', 'apartamento'],
      ['casas',        'casa'],
      ['terrenos',     'terreno'],
      ['chales',       'chale'],
      ['chacaras',     'chacara'],
      ['comerciais',   'comercial'],
      ['coberturas',   'cobertura'],
    ]

    const pluralRedirects = categoriaAliases.flatMap(([plural, singular]) => [
      {
        source: `/:acao(comprar|alugar)/:cidade/${plural}`,
        destination: `/:acao/:cidade/${singular}`,
        permanent: true,
      },
      {
        source: `/:acao(comprar|alugar)/:cidade/${plural}/:bairro`,
        destination: `/:acao/:cidade/${singular}/:bairro`,
        permanent: true,
      },
      {
        source: `/:acao(comprar|alugar)/:cidade/${plural}/filtro/:slug*`,
        destination: `/:acao/:cidade/${singular}/filtro/:slug*`,
        permanent: true,
      },
      {
        source: `/:acao(comprar|alugar)/:cidade/${plural}/:bairro/filtro/:slug*`,
        destination: `/:acao/:cidade/${singular}/:bairro/filtro/:slug*`,
        permanent: true,
      },
    ])

    const rootCategoryRedirects = categoriaAliases.flatMap(([plural, singular]) => [
      { source: `/${plural}`,  destination: '/imoveis', permanent: true },
      { source: `/${singular}`, destination: '/imoveis', permanent: true },
    ])

    return [
      ...pluralRedirects,
      ...rootCategoryRedirects,
      {
        source: '/comprar',
        destination: '/imoveis',
        permanent: true,
      },
      {
        source: '/alugar/:path+',
        destination: '/alugar',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/imoveis',
        headers: [
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
          { key: 'CDN-Cache-Control',        value: 'public, s-maxage=60, stale-while-revalidate=300' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
