import { fetchFeaturedProperties, fetchSiteConfig } from '../lib/api'
import { buildHomepageJsonLd } from '../lib/jsonLd'
import { SITE_URL } from '../lib/config'
import HeroSection from '../components/home/HeroSection'
import FeaturedProperties from '../components/home/FeaturedProperties'
import CTASection from '../components/home/CTASection'

const FALLBACK_HERO = 'https://res.cloudinary.com/dfl3eskr9/image/upload/v1775083889/po3gf0daisooo1t7run5.jpg'

export const metadata = {
  title: 'Corretor Yuri Imóveis — Imóveis em Osasco e Região',
  description:
    'Corretor de imóveis em Osasco com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para venda e aluguel. Atendimento personalizado.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Corretor Yuri Imóveis — Imóveis em Osasco e Região',
    description:
      'Corretor de imóveis em Osasco com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para venda e aluguel.',
    url: SITE_URL,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    images: [{ url: FALLBACK_HERO, width: 1280, height: 853, alt: 'Ponte Metálica de Osasco' }],
  },
}

export default async function Home() {
  const [featuredProperties, heroImageUrl] = await Promise.all([
    fetchFeaturedProperties(),
    fetchSiteConfig('hero_image_url'),
  ])
  const hero = heroImageUrl || FALLBACK_HERO
  const jsonLd = buildHomepageJsonLd(hero)

  return (
    <div className="pb-16 md:pb-0">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <HeroSection imageUrl={hero} />
      <FeaturedProperties properties={featuredProperties} />
      <CTASection />
    </div>
  )
}
