import { z } from 'zod'

const TIPOS = ['venda', 'aluguel'] as const
const CATEGORIAS = ['casa', 'apartamento', 'terreno', 'chale', 'comercial', 'chacara'] as const
const STATUSES = ['pronto', 'construcao', 'planta'] as const

export const imovelCreateSchema = z.object({
  titulo:          z.string().min(3).max(200),
  tipo:            z.enum(TIPOS),
  categoria:       z.enum(CATEGORIAS),
  preco:           z.coerce.number().positive(),
  descricao:       z.string().max(5000).optional().default(''),
  descricao_seo:   z.string().max(300).optional().default(''),
  area:            z.coerce.number().min(0).optional().default(0),
  quartos:         z.coerce.number().int().min(0).optional().default(0),
  banheiros:       z.coerce.number().int().min(0).optional().default(0),
  vagas:           z.coerce.number().int().min(0).optional().default(0),
  endereco:        z.string().max(300).optional().default(''),
  bairro:          z.string().max(100).optional().default(''),
  cidade:          z.string().max(100).optional().default('Osasco'),
  cep:             z.string().max(10).optional().default(''),
  status:          z.enum(STATUSES).optional().default('pronto'),
  destaque:        z.coerce.boolean().optional().default(false),
  imagens:         z.array(z.string().url()).optional().default([]),
  diferenciais:    z.array(z.string().max(100)).optional().default([]),
  area_display:    z.string().max(50).optional().default(''),
  vagas_display:   z.string().max(50).optional().default(''),
  parcela_display: z.string().max(50).optional().default(''),
  parcela_label:   z.string().max(50).optional().default(''),
})

export const imovelUpdateSchema = z.object({
  titulo:          z.string().min(3).max(200).optional(),
  tipo:            z.enum(TIPOS).optional(),
  categoria:       z.enum(CATEGORIAS).optional(),
  preco:           z.coerce.number().positive().optional(),
  descricao:       z.string().max(5000).optional(),
  descricao_seo:   z.string().max(300).optional(),
  area:            z.coerce.number().min(0).optional(),
  quartos:         z.coerce.number().int().min(0).optional(),
  banheiros:       z.coerce.number().int().min(0).optional(),
  vagas:           z.coerce.number().int().min(0).optional(),
  endereco:        z.string().max(300).optional(),
  bairro:          z.string().max(100).optional(),
  cidade:          z.string().max(100).optional(),
  cep:             z.string().max(10).optional(),
  status:          z.enum(STATUSES).optional(),
  destaque:        z.coerce.boolean().optional(),
  ativo:           z.coerce.boolean().optional(),
  imagens:         z.array(z.string().url()).optional(),
  diferenciais:    z.array(z.string().max(100)).optional(),
  area_display:    z.string().max(50).optional(),
  vagas_display:   z.string().max(50).optional(),
  parcela_display: z.string().max(50).optional(),
  parcela_label:   z.string().max(50).optional(),
})

export const blogPostCreateSchema = z.object({
  titulo:         z.string().min(3).max(200),
  slug:           z.string().min(3).max(250).regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  resumo:         z.string().max(500).optional().default(''),
  conteudo:       z.string().max(50000).optional().default(''),
  imagem_capa:    z.string().max(500).optional().default(''),
  meta_titulo:    z.string().max(200).optional().default(''),
  meta_descricao: z.string().max(300).optional().default(''),
  tags:           z.array(z.string().max(50)).optional().default([]),
  publicado:      z.coerce.boolean().optional().default(false),
})

export const blogPostUpdateSchema = z.object({
  titulo:         z.string().min(3).max(200).optional(),
  slug:           z.string().min(3).max(250).regex(/^[a-z0-9-]+$/).optional(),
  resumo:         z.string().max(500).optional(),
  conteudo:       z.string().max(50000).optional(),
  imagem_capa:    z.string().max(500).optional(),
  meta_titulo:    z.string().max(200).optional(),
  meta_descricao: z.string().max(300).optional(),
  tags:           z.array(z.string().max(50)).optional(),
  publicado:      z.coerce.boolean().optional(),
})

export const contatoSchema = z.object({
  nome:      z.string().min(2).max(100),
  email:     z.string().email().max(200),
  telefone:  z.string().max(20).optional().default(''),
  assunto:   z.string().max(200).optional().default(''),
  mensagem:  z.string().min(10).max(2000),
  imovel_id: z.coerce.number().int().positive().optional().nullable(),
})
