import type { BairroData } from '../types'

/**
 * Conteúdo descritivo dos bairros de Osasco para SEO local.
 * Chave = slug (resultado de slugify(bairro)).
 * Fallback: bairros sem entrada aqui renderizam normalmente, só sem texto descritivo.
 */
export const BAIRROS: Record<string, BairroData> = {
  'metalurgicos': {
    nome: 'Metalúrgicos',
    slug: 'metalurgicos',
    titulo: 'Imóveis no Metalúrgicos, Osasco SP',
    descricaoMeta:
      'Casas, apartamentos e terrenos no bairro Metalúrgicos em Osasco, SP. Veja opções de venda e aluguel com o Corretor Yuri Imóveis.',
    conteudo: {
      sobre:
        'O Metalúrgicos é um bairro residencial consolidado na zona sul de Osasco, conhecido pela tranquilidade e pelo perfil familiar. Suas ruas arborizadas e o comércio local diversificado fazem dele uma escolha frequente para quem busca qualidade de vida sem se afastar da capital paulista.',
      infraestrutura:
        'O bairro conta com supermercados, padarias, farmácias e pequenos comércios que atendem às necessidades do dia a dia. Há também unidades básicas de saúde e clínicas particulares nas proximidades. O comércio ao longo das vias principais oferece conveniência para os moradores.',
      transporte:
        'O Metalúrgicos tem acesso rápido à Rodovia Presidente Castelo Branco e à Marginal Tietê, facilitando o deslocamento para São Paulo e cidades vizinhas. Linhas de ônibus conectam o bairro ao centro de Osasco e a terminais de integração com o metrô e a CPTM.',
      educacao:
        'A região conta com escolas municipais e estaduais de ensino fundamental e médio. Creches e escolas de educação infantil atendem famílias com crianças pequenas. Para ensino superior, a proximidade com o centro de Osasco dá acesso a faculdades e universidades da região.',
      porqueMorar:
        'Morar no Metalúrgicos é ideal para quem valoriza um bairro residencial com custo-benefício atrativo em Osasco. Os imóveis na região oferecem metragens generosas a preços competitivos quando comparados a bairros mais centrais. A combinação de tranquilidade, comércio acessível e boa conectividade viária torna o bairro uma opção sólida para famílias e investidores.',
    },
  },

  'jd-roberto': {
    nome: 'Jd Roberto',
    slug: 'jd-roberto',
    titulo: 'Imóveis no Jardim Roberto, Osasco SP',
    descricaoMeta:
      'Encontre imóveis no Jardim Roberto em Osasco, SP. Casas e apartamentos para venda e aluguel. Atendimento com o Corretor Yuri.',
    conteudo: {
      sobre:
        'O Jardim Roberto é um bairro tradicional de Osasco, situado em uma região de fácil acesso ao centro da cidade. Caracteriza-se por ruas residenciais com casas e sobrados, além de um comércio local que cresceu nos últimos anos acompanhando o desenvolvimento urbano da região.',
      infraestrutura:
        'O bairro dispõe de padarias, mercados, açougues e lojas de conveniência. Na área de saúde, os moradores contam com postos de atendimento e proximidade com o Hospital Municipal de Osasco. Há agências bancárias e serviços públicos acessíveis nas vias principais.',
      transporte:
        'O Jardim Roberto é servido por linhas de ônibus que conectam o bairro ao Terminal Osasco e ao centro da cidade. A estação Osasco da CPTM (Linha 8-Diamante) fica a poucos minutos, oferecendo ligação direta com a Estação da Luz em São Paulo.',
      educacao:
        'A região possui escolas de ensino fundamental e médio da rede pública estadual e municipal. Há também opções de escolas particulares nos bairros vizinhos. O acesso ao centro de Osasco facilita a busca por cursos técnicos e ensino superior.',
      porqueMorar:
        'O Jardim Roberto atrai moradores que buscam imóveis bem localizados em Osasco com valores acessíveis. A proximidade com a CPTM é um diferencial importante para quem trabalha em São Paulo. O perfil residencial do bairro, aliado ao comércio em crescimento, faz dele uma opção prática para o dia a dia.',
    },
  },

  'padroeira': {
    nome: 'Padroeira',
    slug: 'padroeira',
    titulo: 'Imóveis na Padroeira, Osasco SP',
    descricaoMeta:
      'Imóveis na Padroeira em Osasco, SP. Casas, apartamentos e terrenos para compra e aluguel. Fale com o Corretor Yuri Imóveis.',
    conteudo: {
      sobre:
        'A Padroeira é um bairro em desenvolvimento na região de Osasco, que vem atraindo novos moradores pela oferta crescente de imóveis e pela melhoria da infraestrutura urbana. O bairro mescla áreas residenciais com comércio de bairro, mantendo um ritmo de vida mais tranquilo.',
      infraestrutura:
        'O bairro possui comércios essenciais como mercados, padarias e farmácias. Obras de urbanização nos últimos anos melhoraram o asfaltamento e a iluminação pública. A região conta com unidades de saúde para atendimento básico e emergencial.',
      transporte:
        'Linhas de ônibus municipais e intermunicipais atendem a Padroeira, conectando o bairro ao centro de Osasco e a cidades vizinhas como Carapicuíba. O acesso à Rodovia Raposo Tavares e à Castelo Branco está a poucos quilômetros.',
      educacao:
        'O bairro conta com escolas públicas de ensino fundamental. Para ensino médio e superior, os moradores se deslocam ao centro de Osasco, que concentra mais opções educacionais.',
      porqueMorar:
        'A Padroeira é uma opção para quem busca imóveis com preços mais acessíveis em Osasco. Terrenos e casas na região têm valores abaixo da média da cidade, representando oportunidade para quem quer comprar o primeiro imóvel ou investir. O bairro está em valorização e tende a se beneficiar das melhorias de infraestrutura em andamento.',
    },
  },

  'rochdale': {
    nome: 'Rochdale',
    slug: 'rochdale',
    titulo: 'Imóveis no Rochdale, Osasco SP',
    descricaoMeta:
      'Imóveis no bairro Rochdale em Osasco, SP. Veja casas e apartamentos disponíveis para venda e aluguel com o Corretor Yuri.',
    conteudo: {
      sobre:
        'O Rochdale é um bairro residencial de Osasco localizado na região norte da cidade, próximo à divisa com São Paulo. O nome homenageia a cooperativa inglesa de Rochdale, refletindo a origem comunitária do bairro. A região é predominantemente residencial, com casas e conjuntos habitacionais.',
      infraestrutura:
        'O bairro possui comércio local com mercados, padarias, açougues e prestadores de serviço. Há unidades básicas de saúde e escolas na região. O Parque Rochdale, área verde do bairro, é utilizado para caminhadas e lazer ao ar livre.',
      transporte:
        'O Rochdale é atendido por linhas de ônibus que conectam ao centro de Osasco e ao Terminal Pirituba em São Paulo. A Rodovia Anhanguera e a Marginal Tietê são acessíveis pela região, facilitando o deslocamento para a zona norte e oeste de São Paulo.',
      educacao:
        'A região possui escolas municipais e estaduais de ensino fundamental e médio. A proximidade com Pirituba e o centro de Osasco amplia as opções de ensino técnico e superior para os moradores.',
      porqueMorar:
        'O Rochdale é indicado para quem busca imóveis em Osasco com boa relação custo-benefício e proximidade com São Paulo. A localização na divisa entre as duas cidades é estratégica para trabalhadores que precisam transitar entre Osasco e a capital. O perfil tranquilo do bairro e a presença de áreas verdes são diferenciais para famílias.',
    },
  },

  'vila-ayrosa': {
    nome: 'Vila Ayrosa',
    slug: 'vila-ayrosa',
    titulo: 'Imóveis na Vila Ayrosa, Osasco SP',
    descricaoMeta:
      'Casas e apartamentos na Vila Ayrosa em Osasco, SP. Opções de venda e aluguel com atendimento personalizado do Corretor Yuri.',
    conteudo: {
      sobre:
        'A Vila Ayrosa é um bairro tradicional de Osasco, com forte identidade residencial e comércio ativo. Localizado em área central da cidade, o bairro se beneficia da proximidade com serviços, transporte e equipamentos públicos. É uma das regiões mais procuradas por famílias que querem morar perto do centro sem pagar os preços dos bairros mais valorizados.',
      infraestrutura:
        'O bairro tem infraestrutura completa: supermercados de rede, bancos, farmácias, restaurantes e prestadores de serviço variados. Há UBS (Unidade Básica de Saúde) no bairro e fácil acesso a hospitais no centro de Osasco. A região também conta com academias, salões e comércio diversificado ao longo das ruas principais.',
      transporte:
        'A Vila Ayrosa tem excelente conectividade. Linhas de ônibus ligam o bairro ao Terminal Osasco e à Estação Osasco da CPTM (Linha 8-Diamante), com acesso direto à Estação da Luz. A proximidade com a Avenida dos Autonomistas e a Rodovia Castelo Branco facilita o deslocamento de carro.',
      educacao:
        'O bairro possui escolas municipais e estaduais de ensino fundamental e médio. A proximidade com o centro de Osasco dá acesso a instituições de ensino superior como UNIFIEO e IFSP Osasco. Creches e escolas de educação infantil também estão disponíveis na região.',
      porqueMorar:
        'A Vila Ayrosa combina localização central com preços mais acessíveis que bairros como Centro e Presidente Altino. É ideal para quem depende de transporte público, já que a CPTM e diversas linhas de ônibus estão a poucos minutos. O comércio forte e a infraestrutura consolidada fazem do bairro uma escolha segura para morar em Osasco.',
    },
  },
}

/**
 * Busca dados do bairro pelo slug.
 * Retorna undefined se o bairro não está cadastrado (fallback gracioso).
 */
export function getBairroBySlug(slug: string): BairroData | undefined {
  return BAIRROS[slug]
}
