import Image from 'next/image'
import SearchBar from '../SearchBar'

interface HeroSectionProps {
  imageUrl: string
}

export default function HeroSection({ imageUrl }: HeroSectionProps) {
  return (
    <section className="relative h-[70vh] min-h-[520px] md:h-[75vh] flex items-center -mt-16 md:-mt-20 overflow-hidden">
      <Image
        src={imageUrl}
        alt="Ponte Metálica de Osasco — cartão postal da cidade"
        fill
        priority
        fetchPriority="high"
        quality={75}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/85 via-dark/70 to-dark/40" />
      <div className="relative container mx-auto px-6 pt-24 pb-10">
        <div className="max-w-2xl mb-10">
          <span className="section-label !text-gray-300">Corretor Yuri Imóveis</span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-6 uppercase tracking-tight">
            Imóveis em<br />Osasco <span className="text-primary">e Região</span>
          </h1>
          <p className="text-gray-200 text-base leading-relaxed max-w-lg">
            Mais de 10 anos ajudando famílias a comprar, vender e alugar na Grande São Paulo. Atendimento direto com o corretor — sem intermediários.
          </p>
        </div>
        <div className="max-w-2xl">
          <SearchBar />
        </div>
      </div>
    </section>
  )
}
