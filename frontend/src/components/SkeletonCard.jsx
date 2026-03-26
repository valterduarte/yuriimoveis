export default function SkeletonCard() {
  return (
    <div className="bg-white overflow-hidden animate-pulse">
      {/* Imagem */}
      <div className="bg-gray-200" style={{ height: '260px' }} />

      {/* Conteúdo */}
      <div className="p-5 border border-gray-200 border-t-0 space-y-3">
        {/* Preço */}
        <div className="h-5 bg-gray-200 rounded w-2/5" />
        {/* Título */}
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        {/* Localização */}
        <div className="h-3 bg-gray-200 rounded w-3/5" />

        {/* Stats */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-8" />
          <div className="h-3 bg-gray-200 rounded w-8" />
          <div className="h-3 bg-gray-200 rounded w-8" />
          <div className="h-3 bg-gray-200 rounded w-12 ml-auto" />
        </div>
      </div>
    </div>
  )
}
