import type { BairroData } from '../types'

/**
 * Conteúdo descritivo dos bairros de Osasco para SEO local.
 * Chave = slug (resultado de slugify(bairro)).
 * Fallback: bairros sem entrada aqui renderizam normalmente, só sem texto descritivo.
 */
export const BAIRROS: Record<string, BairroData> = {
  'bela-vista': {
    nome: 'Bela Vista',
    slug: 'bela-vista',
    titulo: 'Imóveis na Bela Vista, Osasco SP — Corretor Yuri',
    descricaoMeta:
      'Apartamentos e casas na Bela Vista em Osasco, SP. Lançamentos e imóveis prontos para venda e aluguel. Atendimento personalizado com o Corretor Yuri.',
    conteudo: {
      sobre:
        'A Bela Vista é um dos bairros mais valorizados de Osasco, com localização estratégica próxima ao centro da cidade e fácil acesso às principais vias. O bairro combina infraestrutura urbana consolidada com áreas residenciais tranquilas, atraindo famílias e profissionais que trabalham na região.',
      infraestrutura:
        'O bairro conta com supermercados de rede, farmácias, bancos, restaurantes e comércio diversificado. A presença de condomínios novos com lazer completo tem elevado o padrão de moradia na região. Há unidades de saúde e hospitais acessíveis nas proximidades.',
      transporte:
        'A Bela Vista tem acesso direto à Avenida dos Autonomistas e proximidade com a Rodovia Presidente Castelo Branco, facilitando deslocamentos para São Paulo e cidades vizinhas. Linhas de ônibus conectam o bairro ao centro de Osasco e a estações da CPTM.',
      educacao:
        'A região conta com escolas públicas e particulares de ensino fundamental e médio. A proximidade com o centro de Osasco dá acesso a faculdades e cursos técnicos da região metropolitana.',
      porqueMorar:
        'A Bela Vista se destaca pela oferta de lançamentos imobiliários com excelente custo-benefício. É ideal para quem busca apartamentos novos com lazer completo em um bairro bem localizado e em plena valorização.',
    },
  },

  'centro': {
    nome: 'Centro',
    slug: 'centro',
    titulo: 'Imóveis no Centro de Osasco SP — Corretor Yuri',
    descricaoMeta:
      'Imóveis no Centro de Osasco, SP. Apartamentos e salas comerciais para venda e aluguel. Região com melhor infraestrutura da cidade.',
    conteudo: {
      sobre:
        'O Centro de Osasco é o coração comercial e administrativo da cidade. Concentra os principais serviços públicos, bancos, escritórios e comércio. A região tem alta demanda tanto para moradia quanto para investimento, especialmente em apartamentos compactos e salas comerciais.',
      infraestrutura:
        'Infraestrutura completa: shopping centers, bancos, supermercados, hospitais, cartórios e órgãos públicos. O Calçadão de Osasco é o principal polo de comércio popular da cidade. Restaurantes, academias e serviços variados estão a poucos metros.',
      transporte:
        'O Centro é o ponto de maior conectividade de Osasco. A Estação Osasco da CPTM (Linha 8-Diamante) oferece ligação direta com a Estação da Luz em São Paulo. O Terminal Osasco centraliza dezenas de linhas de ônibus municipais e intermunicipais.',
      educacao:
        'A região concentra escolas públicas e particulares de todos os níveis, além de faculdades como UNIFIEO e unidades do SENAC e SENAI. O IFSP Osasco também fica próximo.',
      porqueMorar:
        'Morar no Centro de Osasco é ideal para quem prioriza praticidade e acesso a transporte público. Tudo está a poucos minutos a pé: trabalho, comércio, serviços e lazer. Apartamentos na região têm alta liquidez para revenda e locação.',
    },
  },

  'cipava': {
    nome: 'Cipava',
    slug: 'cipava',
    titulo: 'Imóveis no Cipava, Osasco SP — Corretor Yuri',
    descricaoMeta:
      'Casas e apartamentos no Cipava em Osasco, SP. Imóveis para venda e aluguel com atendimento do Corretor Yuri Imóveis.',
    conteudo: {
      sobre:
        'O Cipava é um bairro residencial de Osasco que se destaca pela tranquilidade e pelo ambiente familiar. Localizado na região sudoeste da cidade, o bairro tem ruas arborizadas e um comércio local que atende bem os moradores no dia a dia.',
      infraestrutura:
        'O bairro possui mercados, padarias, farmácias e pequenos comércios. Há postos de saúde na região e fácil acesso a hospitais no centro de Osasco. A infraestrutura de lazer inclui praças e áreas verdes utilizadas pela comunidade.',
      transporte:
        'Linhas de ônibus municipais conectam o Cipava ao centro de Osasco e ao Terminal Osasco. O acesso à Rodovia Raposo Tavares e à Castelo Branco é facilitado pelas vias da região, tornando o deslocamento de carro prático.',
      educacao:
        'O bairro tem escolas municipais de ensino fundamental e creches. Para ensino médio e superior, os moradores contam com as opções no centro de Osasco, a poucos minutos de ônibus.',
      porqueMorar:
        'O Cipava é uma boa opção para quem busca imóveis com preços acessíveis em um bairro tranquilo de Osasco. Casas com quintal e sobrados são comuns na região, ideais para famílias que valorizam espaço e sossego.',
    },
  },

  'conceicao': {
    nome: 'Conceição',
    slug: 'conceicao',
    titulo: 'Imóveis na Conceição, Osasco SP — Corretor Yuri',
    descricaoMeta:
      'Imóveis na Conceição em Osasco, SP. Casas, apartamentos e terrenos para compra e aluguel. Fale com o Corretor Yuri.',
    conteudo: {
      sobre:
        'A Conceição é um bairro residencial de Osasco com boa localização e acesso às principais vias da cidade. O bairro tem perfil misto, combinando residências tradicionais com novos empreendimentos que vêm modernizando a região.',
      infraestrutura:
        'O bairro conta com comércio de bairro, incluindo mercados, padarias e prestadores de serviço. Há unidades de saúde para atendimento básico e proximidade com hospitais no centro de Osasco.',
      transporte:
        'A Conceição tem bom acesso a vias importantes como a Avenida dos Autonomistas. Linhas de ônibus atendem o bairro com conexões ao Terminal Osasco e à estação da CPTM, garantindo mobilidade para quem trabalha em São Paulo.',
      educacao:
        'Escolas públicas de ensino fundamental e médio atendem a região. A proximidade com o centro amplia as opções para ensino técnico e superior.',
      porqueMorar:
        'A Conceição oferece boa relação custo-benefício para moradia em Osasco. A valorização imobiliária nos últimos anos, impulsionada por novos condomínios, torna o bairro atrativo tanto para moradia quanto para investimento.',
    },
  },

  'jaguaribe': {
    nome: 'Jaguaribe',
    slug: 'jaguaribe',
    titulo: 'Imóveis no Jaguaribe, Osasco SP — Corretor Yuri',
    descricaoMeta:
      'Apartamentos e casas no Jaguaribe em Osasco, SP. Lançamentos e imóveis prontos para morar. Atendimento com o Corretor Yuri.',
    conteudo: {
      sobre:
        'O Jaguaribe é um dos bairros mais procurados de Osasco para novos empreendimentos imobiliários. Sua localização privilegiada entre o centro e a Rodovia Castelo Branco atrai construtoras e compradores que buscam apartamentos modernos com lazer completo.',
      infraestrutura:
        'O bairro tem infraestrutura em expansão: supermercados, farmácias, restaurantes e academias. Novos condomínios trouxeram padarias gourmet e comércios mais sofisticados. Há UBS na região e acesso rápido a hospitais do centro.',
      transporte:
        'O Jaguaribe tem excelente acesso viário. A Rodovia Presidente Castelo Branco está a poucos minutos, conectando rapidamente a São Paulo. Linhas de ônibus ligam o bairro ao Terminal Osasco e à estação CPTM.',
      educacao:
        'Escolas públicas e particulares atendem a região. O crescimento de condomínios familiares tem impulsionado a oferta de escolas de educação infantil e ensino fundamental no entorno.',
      porqueMorar:
        'O Jaguaribe é a escolha ideal para quem busca apartamentos novos em Osasco com infraestrutura de lazer completa. A região está em forte valorização e concentra alguns dos principais lançamentos imobiliários da cidade.',
    },
  },

  'km-18': {
    nome: 'Km 18',
    slug: 'km-18',
    titulo: 'Imóveis no Km 18, Osasco SP — Corretor Yuri',
    descricaoMeta:
      'Imóveis no Km 18 em Osasco, SP. Casas, apartamentos e terrenos para venda e aluguel. Fale com o Corretor Yuri Imóveis.',
    conteudo: {
      sobre:
        'O Km 18 é uma das regiões mais tradicionais de Osasco, com forte identidade de bairro e comércio pulsante. O nome faz referência ao marco quilométrico da antiga estrada de ferro. A região combina comércio ativo com áreas residenciais consolidadas.',
      infraestrutura:
        'O Km 18 tem um dos comércios mais ativos de Osasco, com lojas, restaurantes, bares, mercados e feiras livres. A região conta com serviços de saúde, bancos, academias e lazer. O comércio ao longo das vias principais é diversificado e acessível.',
      transporte:
        'A estação Km 18 da CPTM (Linha 8-Diamante) é o principal trunfo do bairro, oferecendo conexão direta com São Paulo. Linhas de ônibus complementam o transporte, ligando a região ao centro de Osasco e a cidades vizinhas.',
      educacao:
        'A região possui escolas públicas e particulares de todos os níveis. A proximidade com o centro de Osasco e com São Paulo amplia as opções de ensino superior e técnico.',
      porqueMorar:
        'O Km 18 é perfeito para quem depende de transporte público e valoriza um bairro com vida própria. A estação CPTM no bairro é um diferencial enorme. Os imóveis na região oferecem boa relação custo-benefício, com opções de casas e apartamentos.',
    },
  },

  'presidente-altino': {
    nome: 'Presidente Altino',
    slug: 'presidente-altino',
    titulo: 'Imóveis em Presidente Altino, Osasco SP — Corretor Yuri',
    descricaoMeta:
      'Apartamentos e casas em Presidente Altino, Osasco SP. Imóveis próximos à CPTM para venda e aluguel. Corretor Yuri Imóveis.',
    conteudo: {
      sobre:
        'Presidente Altino é um bairro nobre de Osasco, conhecido pela qualidade de vida, ruas arborizadas e proximidade com a capital paulista. É um dos bairros mais valorizados da cidade, atraindo moradores que buscam conforto sem se distanciar de São Paulo.',
      infraestrutura:
        'O bairro tem infraestrutura de alto padrão: supermercados premium, restaurantes variados, academias, clínicas e laboratórios. O comércio local é sofisticado e atende bem as necessidades dos moradores. Há condomínios de alto padrão na região.',
      transporte:
        'A estação Presidente Altino da CPTM (Linha 8-Diamante) oferece acesso direto à Estação da Luz em São Paulo em cerca de 30 minutos. A proximidade com a Marginal Pinheiros e a Rodovia Castelo Branco facilita o deslocamento de carro.',
      educacao:
        'A região concentra excelentes escolas particulares e públicas. O IFSP Osasco fica próximo, assim como faculdades do centro de Osasco. A oferta educacional é um dos pontos fortes do bairro.',
      porqueMorar:
        'Presidente Altino é a melhor opção em Osasco para quem busca qualidade de vida, valorização patrimonial e fácil acesso a São Paulo. Os imóveis na região são mais valorizados, mas justificam pelo padrão de moradia e pela localização estratégica.',
    },
  },

  'santa-maria': {
    nome: 'Santa Maria',
    slug: 'santa-maria',
    titulo: 'Imóveis em Santa Maria, Osasco SP — Corretor Yuri',
    descricaoMeta:
      'Imóveis em Santa Maria, Osasco SP. Apartamentos e casas para venda e aluguel. Atendimento personalizado com o Corretor Yuri.',
    conteudo: {
      sobre:
        'Santa Maria é um bairro residencial de Osasco que vem se destacando pelo número de lançamentos imobiliários nos últimos anos. A região combina tranquilidade com boa infraestrutura, atraindo famílias e jovens profissionais.',
      infraestrutura:
        'O bairro possui comércio local com mercados, padarias e farmácias. Novos empreendimentos trouxeram melhorias de infraestrutura urbana, como asfaltamento e iluminação. Há postos de saúde na região e acesso a hospitais no centro.',
      transporte:
        'Linhas de ônibus conectam Santa Maria ao centro de Osasco e ao Terminal Osasco. O acesso à Rodovia Castelo Branco é facilitado pelas vias do bairro, possibilitando deslocamento rápido para São Paulo.',
      educacao:
        'A região conta com escolas municipais e estaduais de ensino fundamental. Creches e escolas de educação infantil atendem a demanda crescente de famílias com crianças.',
      porqueMorar:
        'Santa Maria é ideal para quem busca apartamentos novos com preços competitivos em Osasco. Os lançamentos na região oferecem lazer completo e condições de financiamento atrativas, incluindo opções no programa Minha Casa Minha Vida.',
    },
  },

  'vila-isabel': {
    nome: 'Vila Isabel',
    slug: 'vila-isabel',
    titulo: 'Imóveis na Vila Isabel, Osasco SP — Corretor Yuri',
    descricaoMeta:
      'Casas e apartamentos na Vila Isabel em Osasco, SP. Imóveis para compra e aluguel com o Corretor Yuri Imóveis.',
    conteudo: {
      sobre:
        'A Vila Isabel é um bairro residencial de Osasco com perfil familiar e localização conveniente. Próximo ao centro da cidade, o bairro oferece a tranquilidade de ruas residenciais com acesso rápido a serviços e transporte.',
      infraestrutura:
        'O bairro tem comércio de bairro funcional, com mercados, padarias e farmácias. A proximidade com o centro de Osasco complementa a oferta de serviços. Há unidades de saúde e escolas na região.',
      transporte:
        'Linhas de ônibus conectam a Vila Isabel ao Terminal Osasco e à estação da CPTM. A localização próxima ao centro facilita o deslocamento a pé ou de bicicleta para serviços e comércios.',
      educacao:
        'Escolas públicas de ensino fundamental e médio atendem os moradores. A proximidade com o centro dá acesso a opções de ensino superior e técnico da região.',
      porqueMorar:
        'A Vila Isabel é uma opção sólida para quem busca imóveis em Osasco com boa localização e preços razoáveis. O perfil residencial do bairro e a proximidade com o centro são os principais atrativos para famílias e investidores.',
    },
  },

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

  'jardim-roberto': {
    nome: 'Jardim Roberto',
    slug: 'jardim-roberto',
    dbMatch: 'Jd Roberto',
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

  'jardim-esperanca': {
    nome: 'Jardim Esperança',
    slug: 'jardim-esperanca',
    titulo: 'Imóveis no Jardim Esperança, Barueri SP — Corretor Yuri',
    descricaoMeta:
      'Apartamentos no Jardim Esperança em Barueri, SP. Imóveis prontos para morar e lançamentos. Atendimento personalizado com o Corretor Yuri.',
    conteudo: {
      sobre:
        'O Jardim Esperança é um bairro residencial de Barueri em expansão, com novos empreendimentos de médio e alto padrão chegando à região. Bem localizado em relação ao centro de Barueri e à área de Alphaville, o bairro atrai famílias e investidores em busca de apartamentos com boa infraestrutura e preços competitivos na Grande São Paulo.',
      infraestrutura:
        'O bairro conta com comércio local, supermercados, farmácias e acesso fácil a serviços no centro de Barueri. A proximidade com Alphaville e o eixo da Castelo Branco ampliam o acesso a shoppings, restaurantes, clínicas e hospitais. Novos empreendimentos têm impulsionado melhorias urbanas na região.',
      transporte:
        'O Jardim Esperança tem acesso às principais vias de Barueri e conexão com a Rodovia Castelo Branco, facilitando o deslocamento para São Paulo e para a região de Alphaville. Linhas de ônibus atendem o bairro com integração ao centro de Barueri e aos terminais da região.',
      educacao:
        'A região conta com escolas públicas municipais de ensino fundamental. A proximidade com o centro de Barueri e com Alphaville amplia as opções de colégios particulares e cursos técnicos. Para ensino superior, o acesso às rodovias facilita deslocamentos a instituições em Osasco, Barueri e São Paulo.',
      porqueMorar:
        'O Jardim Esperança oferece boa relação custo-benefício para quem deseja morar em Barueri com fácil acesso a Alphaville e à capital. Empreendimentos prontos para morar com lazer completo, como academia, piscinas e espaços rooftop, tornam o bairro uma escolha prática para famílias que buscam qualidade de vida sem abrir mão da localização.',
    },
  },

  'cruz-preta': {
    nome: 'Cruz Preta',
    slug: 'cruz-preta',
    titulo: 'Imóveis no Cruz Preta, Barueri SP — Corretor Yuri',
    descricaoMeta:
      'Apartamentos no Cruz Preta em Barueri, SP. Lançamentos e imóveis prontos para morar. Atendimento personalizado com o Corretor Yuri.',
    conteudo: {
      sobre:
        'O Cruz Preta é um bairro residencial de Barueri em pleno desenvolvimento, próximo à região de Alphaville. Com novos empreendimentos de médio e alto padrão chegando à área, o bairro ganhou visibilidade nos últimos anos como uma alternativa acessível para quem deseja morar em Barueri com boa localização e infraestrutura crescente.',
      infraestrutura:
        'O bairro conta com comércio local, mercados, farmácias e prestadores de serviço. A proximidade com o centro de Barueri e com a região de Alphaville amplia o acesso a shoppings, hospitais, restaurantes e serviços de alto padrão. Novos empreendimentos trouxeram melhorias de urbanização e valorização da região.',
      transporte:
        'O Cruz Preta tem acesso às principais vias de Barueri, com conexão à Rodovia Castelo Branco e ao Rodoanel Mario Covas. Linhas de ônibus atendem o bairro com integração ao centro de Barueri e à região de Alphaville. O deslocamento para São Paulo via Castelo Branco é rápido nos horários fora do pico.',
      educacao:
        'A região conta com escolas públicas municipais e estaduais de ensino fundamental. A proximidade com Alphaville dá acesso a colégios particulares de referência regional. Para ensino superior, o acesso ao centro de Barueri e a São Paulo é facilitado pelas vias expressas.',
      porqueMorar:
        'O Cruz Preta atrai quem busca apartamentos com boa relação custo-benefício em Barueri, aproveitando a valorização da região de Alphaville sem pagar os preços dos endereços mais consolidados. Empreendimentos prontos para morar com lazer completo têm chegado ao bairro, tornando-o uma opção prática para famílias e investidores.',
    },
  },

  'alphaville': {
    nome: 'Alphaville',
    slug: 'alphaville',
    titulo: 'Imóveis em Alphaville, Barueri SP — Corretor Yuri',
    descricaoMeta:
      'Apartamentos em Alphaville, Barueri SP. Lançamentos de alto padrão para venda e aluguel. Atendimento personalizado com o Corretor Yuri.',
    conteudo: {
      sobre:
        'Alphaville é um dos endereços mais desejados da Região Metropolitana de São Paulo. Localizado entre Barueri e Santana de Parnaíba, o bairro se consolidou como referência em alto padrão, segurança e qualidade de vida. Abriga condomínios residenciais fechados, torres de lançamentos contemporâneos e um eixo comercial pujante que atrai empresas nacionais e multinacionais.',
      infraestrutura:
        'Alphaville reúne infraestrutura completa: shoppings (Alphaville, Iguatemi e Tamboré), supermercados premium, restaurantes renomados, academias, clubes esportivos e centros comerciais de alto padrão. Na área de saúde, o bairro conta com o Hospital Albert Einstein Alphaville e o Laboratório Fleury. Bancos, cartórios e serviços variados estão concentrados nas avenidas principais.',
      transporte:
        'O bairro tem acesso direto à Rodovia Castelo Branco (km 22–23) e ao Rodoanel Mario Covas, ligando rapidamente a cidade de São Paulo, Osasco e o interior. Linhas de ônibus fretadas e circulares internas atendem os condomínios. A proximidade com o aeroporto de Viracopos e o Centro Empresarial Tamboré reforça a vocação corporativa da região.',
      educacao:
        'Alphaville concentra algumas das melhores escolas da região metropolitana, incluindo Escola Morumbi Alphaville, Colégio Visconde de Porto Seguro, Colégio Concept e unidades bilíngues. Para ensino superior, há opções como a Universidade Anhembi Morumbi e Faculdade Alphaville, além de fácil acesso a instituições na capital paulista.',
      porqueMorar:
        'Morar em Alphaville é escolher alto padrão, segurança e valorização imobiliária consistente. Os lançamentos atuais oferecem lazer elevado em rooftops, academias equipadas, piscinas, espaços gourmet e áreas corporativas como coworking. A combinação de áreas verdes, segurança 24h e infraestrutura de primeira faz do bairro um dos destinos mais sólidos para morar e investir na grande São Paulo.',
    },
  },

  'jardim-julio': {
    nome: 'Jardim Julio',
    slug: 'jardim-julio',
    dbMatch: 'Jardim Julio',
    titulo: 'Imóveis no Jardim Julio, Barueri SP — Corretor Yuri',
    descricaoMeta:
      'Apartamentos no Jardim Julio em Barueri, SP. Lançamentos e imóveis em construção para venda ao lado de Alphaville. Atendimento com o Corretor Yuri.',
    conteudo: {
      sobre:
        'O Jardim Julio é um bairro residencial em expansão de Barueri, localizado em região privilegiada entre o centro da cidade e Alphaville. A proximidade com a Estrada das Pitas e a Rua São Fernando deu ao bairro protagonismo como endereço de novos empreendimentos verticais, com torres modernas e lazer completo atraindo famílias que buscam morar perto do polo corporativo de Alphaville sem pagar os preços dos condomínios fechados.',
      infraestrutura:
        'O bairro e arredores contam com supermercados, farmácias, padarias e comércio de rua crescente. Há unidades de saúde, escolas municipais e restaurantes pela região. A proximidade com o Centro de Barueri e com os shoppings de Alphaville (Iguatemi, Tamboré e Alphaville) amplia as opções de compras, cinemas e serviços a poucos minutos de carro.',
      transporte:
        'O Jardim Julio tem acesso rápido à Rodovia Castelo Branco e ao Rodoanel Mario Covas, facilitando o deslocamento para São Paulo, Osasco e o interior. Linhas de ônibus municipais e intermunicipais conectam o bairro ao Terminal Barueri e à Estação Barueri da CPTM (Linha 8-Diamante), que liga direto à Estação da Luz.',
      educacao:
        'A região conta com escolas municipais e estaduais de ensino fundamental e médio, além de creches e escolas de educação infantil. A proximidade com Alphaville e o centro de Barueri dá acesso a colégios particulares tradicionais e a faculdades da região metropolitana.',
      porqueMorar:
        'Morar no Jardim Julio é combinar preço competitivo com localização estratégica: a poucos minutos do polo de Alphaville e com acesso rápido à Castelo Branco. Os lançamentos verticais do bairro oferecem lazer de alto padrão — piscina, academia, salão de festas, espaço gourmet, coworking, quadra e playground — a valores mais acessíveis que os bairros vizinhos. Escolha sólida para famílias jovens e para quem quer investir em imóvel na planta com boa perspectiva de valorização.',
    },
  },

  'aldeia': {
    nome: 'Aldeia',
    slug: 'aldeia',
    dbMatch: 'Aldeia',
    titulo: 'Imóveis na Aldeia, Barueri SP — Corretor Yuri',
    descricaoMeta:
      'Apartamentos e casas na Aldeia em Barueri, SP. Lançamentos e imóveis prontos para venda e aluguel ao lado do Shopping Barueri. Atendimento com o Corretor Yuri.',
    conteudo: {
      sobre:
        'A Aldeia é um bairro central de Barueri com forte vocação residencial e comercial. É a região onde surgiu o núcleo histórico da cidade, hoje consolidada como endereço estratégico pela proximidade com o Shopping Barueri, o centro administrativo e o eixo da Rodovia Castelo Branco. O bairro concentra lançamentos recentes, prédios consolidados e casas em condomínio, atraindo famílias que querem combinar infraestrutura urbana com conveniência no dia a dia.',
      infraestrutura:
        'A Aldeia conta com o Shopping Barueri a poucos metros, reunindo cinemas, praça de alimentação, supermercado, academias e dezenas de lojas. A região tem agências bancárias, farmácias, padarias, restaurantes e comércio de rua diversificado. Na área de saúde, há clínicas, laboratórios e fácil acesso ao Hospital Municipal de Barueri e unidades privadas da região.',
      transporte:
        'O bairro tem acesso direto à Rodovia Castelo Branco (km 26) e proximidade com o Rodoanel Mario Covas, facilitando deslocamentos para São Paulo, Osasco, Alphaville e o interior. A Estação Barueri da CPTM (Linha 8-Diamante) fica a poucos minutos, com ligação direta à Estação da Luz. Linhas de ônibus municipais e intermunicipais atendem o bairro e conectam ao Terminal Barueri.',
      educacao:
        'A Aldeia e entorno concentram escolas municipais e estaduais de ensino fundamental e médio, além de colégios particulares tradicionais de Barueri. Há creches e escolas de educação infantil, e a proximidade com Alphaville e o centro da cidade dá acesso a faculdades e cursos técnicos da região metropolitana.',
      porqueMorar:
        'Morar na Aldeia é escolher localização central em Barueri sem abrir mão de infraestrutura e mobilidade. Os lançamentos recentes oferecem lazer completo — piscina, academia, espaço gourmet, sport bar — com preços mais acessíveis que Alphaville, mas com o mesmo acesso rápido à Castelo Branco e à CPTM. Ideal para quem trabalha em Barueri, Alphaville ou São Paulo e quer praticidade no dia a dia.',
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
