import { z } from 'zod'

const TIPOS = ['venda', 'aluguel']
const CATEGORIAS = ['casa', 'apartamento', 'terreno', 'chale', 'comercial', 'chacara']
const STATUSES = ['pronto', 'construcao', 'planta']

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
  parcela_display: z.string().max(50).optional().default(''),
  parcela_label:   z.string().max(50).optional().default(''),
})

export const imovelUpdateSchema = imovelCreateSchema.partial().extend({
  ativo: z.coerce.boolean().optional(),
})

export const contatoSchema = z.object({
  nome:      z.string().min(2).max(100),
  email:     z.string().email().max(200),
  telefone:  z.string().max(20).optional().default(''),
  assunto:   z.string().max(200).optional().default(''),
  mensagem:  z.string().min(10).max(2000),
  imovel_id: z.coerce.number().int().positive().optional().nullable(),
})
