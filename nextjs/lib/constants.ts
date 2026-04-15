export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80'

export const PROPERTY_CATEGORIES = [
  { value: 'casa',        label: 'Casa'        },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'terreno',     label: 'Terreno'     },
  { value: 'chale',       label: 'Chalé'       },
  { value: 'comercial',   label: 'Comercial'   },
  { value: 'chacara',     label: 'Chácara'     },
]

export const PROPERTY_STATUSES = [
  { value: 'pronto',     label: 'Pronto para Morar', color: 'bg-green-600' },
  { value: 'construcao', label: 'Em Construção',      color: 'bg-amber-500' },
  { value: 'planta',     label: 'Na Planta',          color: 'bg-blue-600'  },
]

export const TRANSACTION_TYPES = [
  { value: 'venda',   label: 'Comprar' },
  { value: 'aluguel', label: 'Alugar'  },
]

export const SALE_PRICE_OPTIONS = [
  { value: '200000',  label: 'R$ 200.000'    },
  { value: '400000',  label: 'R$ 400.000'    },
  { value: '600000',  label: 'R$ 600.000'    },
  { value: '800000',  label: 'R$ 800.000'    },
  { value: '1000000', label: 'R$ 1.000.000'  },
  { value: '2000000', label: 'R$ 2.000.000+' },
]

export const RENT_PRICE_OPTIONS = [
  { value: '1000', label: 'R$ 1.000/mês' },
  { value: '2000', label: 'R$ 2.000/mês' },
  { value: '3000', label: 'R$ 3.000/mês' },
  { value: '5000', label: 'R$ 5.000/mês' },
]

export const NAVIGATION_LINKS = [
  { href: '/',        label: 'Início'  },
  { href: '/imoveis',   label: 'Imóveis'   },
  { href: '/simulador', label: 'Simulador' },
  { href: '/sobre',     label: 'Sobre'     },
  { href: '/contato', label: 'Contato' },
]

export const ITEMS_PER_PAGE       = 9
export const SCROLL_THRESHOLD     = 60
export const CARD_IMAGE_HEIGHT    = 260
export const ADMIN_PROPERTIES_LIMIT = 50
export const DEBOUNCE_DELAY       = 600

export const SORT_OPTIONS = [
  { value: 'recente',     label: 'Mais recente' },
  { value: 'menor_preco', label: 'Menor preço'  },
  { value: 'maior_preco', label: 'Maior preço'  },
  { value: 'maior_area',  label: 'Maior área'   },
]

export const BEDROOM_OPTIONS = ['', '1', '2', '3', '4+']
