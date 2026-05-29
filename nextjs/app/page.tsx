import { fetchFeaturedProperties, fetchSiteConfig, fetchCidadesByTipo, fetchBairrosByCidade } from '../lib/api'
import { buildHomepageJsonLd } from '../lib/jsonLd'
import { HOMEPAGE_FAQ } from '../data/faq'
import { SITE_URL } from '../lib/config'
import { buildPageMetadata } from '../lib/seo'
import HeroSection from '../components/home/HeroSection'
import FeaturedProperties from '../components/home/FeaturedProperties'
import CTASection from '../components/home/CTASection'
import FAQSection from '../components/home/FAQSection'

const FALLBACK_HERO = 'https://res.cloudinary.com/dfl3eskr9/image/upload/v1775083889/po3gf0daisooo1t7run5.jpg'

export const revalidate = 300

export const metadata = buildPageMetadata({
  title: { absolute: 'Corretor Yuri — Imóveis em Osasco, Barueri e Carapicuíba' },
  description:
    'Corretor de imóveis em Osasco, Barueri e Carapicuíba com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para compra e aluguel.',
  url: SITE_URL,
  ogImage: FALLBACK_HERO,
  ogImageAlt: 'Ponte Metálica de Osasco — atendimento em Osasco, Barueri e Carapicuíba',
  ogImageWidth: 1280,
  ogImageHeight: 853,
})

export default async function Home() {
  const [featuredProperties, heroImageUrl, cidadesByTipo, bairrosPorCidade] = await Promise.all([
    fetchFeaturedProperties(),
    fetchSiteConfig('hero_image_url'),
    fetchCidadesByTipo(),
    fetchBairrosByCidade(),
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
      <HeroSection imageUrl={hero} cidadesByTipo={cidadesByTipo} bairrosPorCidade={bairrosPorCidade} />
      <FeaturedProperties properties={featuredProperties} />
      <FAQSection />
      <CTASection />
    </div>
  )
}
