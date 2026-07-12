/**
 * Backwards-compatible barrel for the property helper functions.
 *
 * These used to live in this single file. They now live in cohesive domain
 * modules under lib/imovel (media, slug, whatsapp, finance, narrative) and
 * lib/bairroGrammar. New code should import from the module directly; this
 * barrel exists so existing consumers do not have to change in lockstep.
 */
export { formatPrice } from '../lib/formatters'
export * from '../lib/imovel/media'
export * from '../lib/imovel/slug'
export * from '../lib/imovel/whatsapp'
export * from '../lib/imovel/finance'
export * from '../lib/imovel/narrative'
export {
  emBairro,
  deBairro,
  sobreBairro,
  articuloBairro,
  aoBairro,
  capitalize,
  pluralizeImoveis,
} from '../lib/bairroGrammar'
