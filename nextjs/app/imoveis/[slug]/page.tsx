import { classifySlug } from './_lib/slugRouter'
import { generateImoveisSlugParams } from './_lib/staticParams'
import {
  buildPropertyMetadata,
  buildLandingMetadata,
  buildBairroMetadata,
} from './_lib/metadata'
import ImovelDetalheView from './_components/ImovelDetalheView'
import LandingView from './_components/LandingView'
import BairroView from './_components/BairroView'
import type { Metadata } from 'next'

export const revalidate = 60

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return generateImoveisSlugParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const route = classifySlug(slug)
  switch (route.kind) {
    case 'property': return buildPropertyMetadata(route.id)
    case 'landing':  return buildLandingMetadata(slug)
    case 'bairro':   return buildBairroMetadata(slug)
  }
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params
  const route = classifySlug(slug)
  switch (route.kind) {
    case 'property': return <ImovelDetalheView id={route.id} />
    case 'landing':  return <LandingView slug={slug} />
    case 'bairro':   return <BairroView slug={slug} />
  }
}
