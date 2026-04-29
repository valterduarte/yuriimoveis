import Image from 'next/image'
import SearchBar from '../SearchBar'

interface HeroSectionProps {
  imageUrl: string
  cidadesByTipo: Record<string, string[]>
}

export default function HeroSection({ imageUrl, cidadesByTipo }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen md:min-h-[85vh] flex items-center -mt-16 md:-mt-20 overflow-hidden">
      <Image
        src={imageUrl}
        alt="Ponte Metálica de Osasco — cartão postal da cidade"
        fill
        priority
        fetchPriority="high"
        quality={65}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/85 via-dark/70 to-dark/40" />
      <div className="relative container mx-auto px-6 pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-2xl mb-10">
          <span className="section-label !text-gray-300">Corretor Yuri Imóveis</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-none mb-6 uppercase tracking-tight">
            Imóveis em<br />Osasco <span className="text-primary">e Região</span>
          </h1>
        </div>
        <div className="max-w-2xl">
          <SearchBar cidadesByTipo={cidadesByTipo} />
        </div>
      </div>
    </section>
  )
}
