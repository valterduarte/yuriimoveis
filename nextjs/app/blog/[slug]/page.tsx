import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { fetchBlogPostBySlug, fetchAllBlogSlugs } from '../../../lib/api'
import { SITE_URL, OG_DEFAULT_IMAGE, PHONE_WA } from '../../../lib/config'
import { PLACEHOLDER_IMAGE } from '../../../lib/constants'
import WhatsAppLink from '../../../components/WhatsAppLink'
import { FaWhatsapp } from 'react-icons/fa'
import type { Metadata } from 'next'

export const revalidate = 60

type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await fetchAllBlogSlugs()
  return slugs.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)
  if (!post) return { title: 'Post não encontrado' }

  const title = post.meta_titulo || `${post.titulo} — Corretor Yuri`
  const description = post.meta_descricao || post.resumo || post.titulo
  const url = `${SITE_URL}/blog/${post.slug}`
  const image = post.imagem_capa || OG_DEFAULT_IMAGE

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Corretor Yuri Imóveis',
      locale: 'pt_BR',
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      images: [{ url: image, width: 1200, height: 630, alt: post.titulo }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)
  if (!post) notFound()

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.titulo, item: `${SITE_URL}/blog/${post.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.titulo,
      description: post.meta_descricao || post.resumo,
      image: post.imagem_capa || OG_DEFAULT_IMAGE,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.created_at,
      dateModified: post.updated_at,
      author: {
        '@type': 'RealEstateAgent',
        name: 'Corretor Yuri Imóveis',
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Corretor Yuri Imóveis',
        url: SITE_URL,
      },
      ...(post.tags.length > 0 ? { keywords: post.tags.join(', ') } : {}),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{post.titulo}</span>
          </nav>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-primary bg-white/10 px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{post.titulo}</h1>
          <time className="text-gray-400 text-sm mt-3 block" dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </time>
        </div>
      </div>

      <article className="container mx-auto px-6 py-10 max-w-3xl">
        {post.imagem_capa && (
          <div className="relative aspect-[16/9] mb-8 overflow-hidden">
            <Image
              src={post.imagem_capa}
              alt={post.titulo}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-dark prose-headings:uppercase prose-headings:tracking-wide
            prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-sm prose-p:leading-relaxed prose-p:text-gray-700
            prose-li:text-sm prose-li:text-gray-700
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-dark
            prose-img:rounded-none"
          dangerouslySetInnerHTML={{ __html: post.conteudo }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-white border border-gray-200 p-6 text-center">
            <h2 className="text-base font-bold text-dark mb-2 uppercase tracking-wide">Gostou do conteúdo?</h2>
            <p className="text-gray-500 text-sm mb-4">Fale com o Corretor Yuri para encontrar o imóvel ideal para você.</p>
            <WhatsAppLink
              href={PHONE_WA}
              source="blog-cta"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs py-3 px-6 transition-colors"
            >
              <FaWhatsapp size={14} /> Falar com o Corretor
            </WhatsAppLink>
          </div>
        </div>
      </article>
    </div>
  )
}
