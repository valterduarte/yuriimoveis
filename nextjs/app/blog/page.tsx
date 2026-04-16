import Link from 'next/link'
import Image from 'next/image'
import { fetchPublishedBlogPosts } from '../../lib/api'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import { PLACEHOLDER_IMAGE } from '../../lib/constants'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog — Corretor Yuri Imóveis',
  description: 'Dicas, guias e informações sobre o mercado imobiliário em Osasco e região. Aprenda sobre financiamento, documentação, bairros e muito mais.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Blog — Corretor Yuri Imóveis',
    description: 'Dicas e guias sobre o mercado imobiliário em Osasco e região.',
    url: `${SITE_URL}/blog`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630 }],
  },
}

export default async function BlogListPage() {
  const posts = await fetchPublishedBlogPosts()

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Blog — Corretor Yuri Imóveis',
      url: `${SITE_URL}/blog`,
      numberOfItems: posts.length,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Blog</span>
          </nav>
          <span className="section-label">Conteúdo</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">Blog Imobiliário</h1>
          <p className="text-gray-400 text-sm mt-2">Dicas, guias e informações sobre o mercado imobiliário em Osasco e região</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 px-6">
            <div className="text-5xl mb-4" aria-hidden="true">&#128221;</div>
            <h2 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">Em breve</h2>
            <p className="text-gray-500 text-sm">Estamos preparando conteúdo sobre o mercado imobiliário de Osasco e região.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <article key={post.id} className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.imagem_capa || PLACEHOLDER_IMAGE}
                      alt={post.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-primary bg-red-50 px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-base font-bold text-dark mb-2 group-hover:text-primary transition-colors leading-snug">
                      {post.titulo}
                    </h2>
                    {post.resumo && (
                      <p className="text-gray-500 text-sm line-clamp-2">{post.resumo}</p>
                    )}
                    <time className="text-xs text-gray-400 mt-3 block" dateTime={post.created_at}>
                      {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </time>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
