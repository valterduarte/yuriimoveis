import Image from 'next/image'
import SearchBar from '../SearchBar'

interface HeroSectionProps {
  imageUrl: string
}

export default function HeroSection({ imageUrl }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center -mt-16 md:-mt-20 overflow-hidden">
      <Image
        src={imageUrl}
        alt="Ponte Metálica de Osasco — cartão postal da cidade"
        fill
        priority
        quality={80}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-dark/75" />
      <div className="relative container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-2xl mb-12">
          <span className="section-label !text-gray-300">Corretor Yuri Imóveis</span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-6 uppercase tracking-tight">
            Encontre o<br />Imóvel <span className="text-primary">Ideal</span>
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-lg">
            Especialistas em imóveis residenciais e comerciais em Osasco e região. Realizamos o sonho da casa própria há mais de 10 anos.
          </p>
        </div>
        <div className="max-w-2xl">
          <SearchBar />
        </div>
      </div>

    </section>
  )
}
