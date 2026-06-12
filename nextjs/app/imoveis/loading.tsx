import SkeletonCard from '../../components/SkeletonCard'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <span className="section-label">Portfólio</span>
          {/* Loading placeholder, intentionally not a heading: this skeleton can
              stream into nested routes such as /imoveis/[slug], whose real page
              heading is the property title. Two top-level headings on one URL
              would dilute the heading signal for search engines. */}
          <p className="text-4xl font-black uppercase text-white" aria-hidden="true">Imóveis Disponíveis</p>
        </div>
      </div>
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  )
}
