import { fetchFeaturedProperties, fetchSiteConfig, fetchCidadesByTipo } from '../lib/api'
import { buildHomepageJsonLd } from '../lib/jsonLd'
import { HOMEPAGE_FAQ } from '../data/faq'
import { SITE_URL } from '../lib/config'
import HeroSection from '../components/home/HeroSection'
import FeaturedProperties from '../components/home/FeaturedProperties'
import CTASection from '../components/home/CTASection'
import FAQSection from '../components/home/FAQSection'

const FALLBACK_HERO = 'https://res.cloudinary.com/dfl3eskr9/image/upload/v1775083889/po3gf0daisooo1t7run5.jpg'

export const revalidate = 300

export const metadata = {
  title: 'Corretor Yuri — Imóveis em Osasco, Barueri e Carapicuíba',
  description:
    'Corretor de imóveis em Osasco, Barueri e Carapicuíba com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para compra e aluguel.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Corretor Yuri — Imóveis em Osasco, Barueri e Carapicuíba',
    description:
      'Corretor de imóveis em Osasco, Barueri e Carapicuíba com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para compra e aluguel.',
    url: SITE_URL,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    images: [{ url: FALLBACK_HERO, width: 1280, height: 853, alt: 'Ponte Metálica de Osasco — atendimento em Osasco, Barueri e Carapicuíba' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corretor Yuri — Imóveis em Osasco, Barueri e Carapicuíba',
    description:
      'Corretor de imóveis em Osasco, Barueri e Carapicuíba com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para compra e aluguel.',
    images: [FALLBACK_HERO],
  },
}

export default async function Home() {
  const [featuredProperties, heroImageUrl, cidadesByTipo] = await Promise.all([
    fetchFeaturedProperties(),
    fetchSiteConfig('hero_image_url'),
    fetchCidadesByTipo(),
  ])
  const hero = heroImageUrl || FALLBACK_HERO
  const jsonLd = buildHomepageJsonLd(
    HOMEPAGE_FAQ.map(faq => ({ question: faq.question, answer: faq.answerText }))
  )

  return (
    <div className="pb-16 md:pb-0">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <HeroSection imageUrl={hero} cidadesByTipo={cidadesByTipo} />
      <FeaturedProperties properties={featuredProperties} />
      <FAQSection />
      <CTASection />
    </div>
  )
}
