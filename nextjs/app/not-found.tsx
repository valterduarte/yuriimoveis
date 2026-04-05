import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-center px-6">
      <h1 className="text-2xl font-bold uppercase">Página não encontrada</h1>
      <p className="text-gray-500 text-sm">A página que você procura não existe ou foi removida.</p>
      <Link href="/" className="btn-primary">Voltar ao início</Link>
    </div>
  )
}
