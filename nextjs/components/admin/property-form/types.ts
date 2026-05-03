/**
 * Form state shared by every section of the admin property form.
 *
 * All fields are strings/booleans on the form side because <input> values
 * are strings; they are converted (Number(form.preco), etc.) at submit
 * time in AdminPropertyForm.
 */
export interface FormState {
  titulo: string
  descricao: string
  descricao_seo: string
  tipo: string
  categoria: string
  status: string
  preco: string
  parcela_display: string
  parcela_label: string
  area: string
  area_display: string
  quartos: string
  banheiros: string
  vagas: string
  vagas_display: string
  endereco: string
  bairro: string
  cidade: string
  cep: string
  destaque: boolean
  diferenciais: string
  lat: string
  lng: string
}

export const EMPTY_FORM: FormState = {
  titulo: '', descricao: '', descricao_seo: '', tipo: 'venda', categoria: 'apartamento',
  status: 'pronto',
  preco: '', parcela_display: '', parcela_label: '', area: '', area_display: '', quartos: '', banheiros: '', vagas: '', vagas_display: '',
  endereco: '', bairro: '', cidade: 'Osasco', cep: '',
  destaque: false, diferenciais: '',
  lat: '', lng: '',
}

export type UpdateField = (key: keyof FormState, value: string | boolean) => void
