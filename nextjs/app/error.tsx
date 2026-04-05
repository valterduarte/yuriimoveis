'use client'

import Link from 'next/link'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-center px-6">
      <h1 className="text-2xl font-bold uppercase">Algo deu errado</h1>
      <p className="text-gray-500 text-sm">Ocorreu um erro inesperado. Tente novamente.</p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">Tentar novamente</button>
        <Link href="/" className="btn-outline">Voltar ao início</Link>
      </div>
    </div>
  )
}
