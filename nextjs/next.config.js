/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
  },
  async redirects() {
    const categoriaAliases = [
      ['apartamentos', 'apartamento'],
      ['casas',        'casa'],
      ['terrenos',     'terreno'],
      ['chales',       'chale'],
      ['chacaras',     'chacara'],
      ['comerciais',   'comercial'],
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

    return [
      ...pluralRedirects,
      {
        source: '/alugar/:path+',
        destination: '/alugar',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
