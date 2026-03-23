import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://yuriimoveis.com.br'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`

export default function SEOHead({
  title,
  description,
  image,
  url,
  type = 'website',
  jsonLd,
}) {
  const fullTitle = title ? `${title} | Corretor Yuri Imóveis` : 'Corretor Yuri Imóveis — Imóveis em Osasco e Região'
  const fullDescription = description || 'Corretor Yuri Imóveis — Encontre o imóvel dos seus sonhos em Osasco e região. Casas, apartamentos, terrenos e imóveis comerciais.'
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const fullImage = image || DEFAULT_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Corretor Yuri Imóveis" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}
