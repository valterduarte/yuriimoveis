export interface GuiaLink {
  href: string
  label: string
  description: string
  type: 'blog' | 'ajuda' | 'tool' | 'listing' | 'bairro'
}

export interface GuiaSection {
  heading: string
  paragraphs: string[]
  links?: GuiaLink[]
}

export interface GuiaFaq {
  question: string
  answer: string
}

export interface GuiaData {
  slug: string
  titulo: string
  subtitulo: string
  descricaoMeta: string
  intro: string
  sections: GuiaSection[]
  faqs: GuiaFaq[]
  ctaLabel: string
  ctaHref: string
}

export const GUIAS: Record<string, GuiaData> = {
  'comprar-imovel-osasco': {
    slug: 'comprar-imovel-osasco',
    titulo: 'Como Comprar Imóvel em Osasco em 2026',
    subtitulo: 'Guia completo para compra segura na cidade',
    descricaoMeta:
      'Guia completo para comprar imóvel em Osasco em 2026: melhores bairros, faixas de preço, passo a passo da compra, financiamento e custos com ITBI e cartório.',
    intro:
      'Osasco é o quinto maior PIB do estado de São Paulo e concentra um mercado imobiliário ativo, com boa oferta de apartamentos e casas em bairros consolidados a preços significativamente abaixo dos praticados em São Paulo capital. Este guia reúne tudo que você precisa saber para comprar com segurança em 2026.',
    sections: [
      {
        heading: 'Por que comprar imóvel em Osasco?',
        paragraphs: [
          'Osasco oferece uma combinação rara: infraestrutura de grande cidade, acesso direto à capital (Linha 8-Diamante da CPTM, Rodoanel, rodovias Castello Branco e Anhanguera) e preços que ainda cabem no orçamento de quem trabalha em São Paulo. Apartamentos de 2 quartos com vaga partem de R$ 220.000 em bairros consolidados — enquanto imóveis equivalentes na zona oeste de SP chegam a R$ 450.000.',
          'A cidade tem um dos menores índices de vacância do ABCD paulista, o que significa que quem compra para investir tem facilidade de alugar. E para quem compra para morar, o custo de vida médio é inferior ao da capital, com a mesma proximidade ao mercado de trabalho da Grande SP.',
        ],
        links: [
          { href: '/bairros/centro', label: 'Guia do Centro de Osasco', description: 'O bairro mais acessível, com maior oferta de imóveis próximos à CPTM', type: 'bairro' },
          { href: '/bairros/bela-vista', label: 'Guia do Bela Vista', description: 'Bairro consolidado com boa infraestrutura e preços intermediários', type: 'bairro' },
          { href: '/bairros/presidente-altino', label: 'Guia do Presidente Altino', description: 'O bairro de maior padrão em Osasco, com edifícios mais recentes', type: 'bairro' },
        ],
      },
      {
        heading: 'Quanto custa comprar imóvel em Osasco?',
        paragraphs: [
          'As faixas de preço variam conforme o tipo de imóvel, o bairro e a conservação. Como referência para 2026:',
          'Apartamento 1 quarto: R$ 130.000 a R$ 220.000. Apartamento 2 quartos com vaga: R$ 220.000 a R$ 380.000. Apartamento 3 quartos: R$ 320.000 a R$ 550.000. Casa em bairro consolidado: R$ 280.000 a R$ 600.000.',
          'Os bairros com maior oferta de imóveis novos são Presidente Altino, Quitaúna e Novo Osasco. Os mais acessíveis ficam no Centro, Bonfim e Vila Yara. Para comparar custo-benefício entre bairros vizinhos de Barueri, veja o guia de Alphaville.',
        ],
        links: [
          { href: '/imoveis?tipo=venda&cidade=Osasco', label: 'Ver todos os imóveis à venda em Osasco', description: 'Listagem completa com filtros por bairro, tipo e faixa de preço', type: 'listing' },
          { href: '/blog/alphaville-ou-barueri-qual-vale-mais-a-pena-2026', label: 'Alphaville ou Barueri? Comparativo 2026', description: 'Análise de custo-benefício entre as duas regiões para quem considera os dois mercados', type: 'blog' },
        ],
      },
      {
        heading: 'Passo a passo da compra de imóvel em Osasco',
        paragraphs: [
          '1. Defina o orçamento total: some a entrada mínima (20% do valor) com os custos de cartório e ITBI (aproximadamente 4,5% do valor do imóvel). Veja se a parcela do financiamento cabe em 30% da renda familiar.',
          '2. Escolha o bairro: considere deslocamento até o trabalho, presença de escolas, supermercados e serviços de saúde. Use os guias de bairro para comparar.',
          '3. Visite ao menos 5 imóveis antes de decidir: compare imóveis similares em bairros diferentes. Preço por metro quadrado é o melhor parâmetro de comparação.',
          '4. Faça a proposta e negocie: o preço pedido raramente é o preço final. Em imóveis acima de 90 dias de anúncio, reduções de 5% a 10% são comuns.',
          '5. Verifique a documentação do imóvel e do vendedor: matrícula atualizada, certidões negativas, IPTU quitado, ausência de inventário pendente.',
          '6. Assine o Contrato de Compra e Venda (ou promessa de compra): junto ao sinal de 10% a 20% do valor.',
          '7. Acompanhe o financiamento (se houver): a aprovação no banco leva em média 30 a 45 dias após a entrega de toda a documentação.',
          '8. Lavre a escritura em cartório e registre no Cartório de Registro de Imóveis: o imóvel só é legalmente seu após o registro na matrícula.',
        ],
        links: [
          { href: '/ajuda/documentos-para-comprar-imovel', label: 'Checklist de documentos para comprar imóvel', description: 'Lista completa de documentos do comprador, vendedor e imóvel', type: 'ajuda' },
          { href: '/ajuda/custos-para-comprar-imovel-em-osasco', label: 'Custos de compra em Osasco: ITBI, escritura e registro', description: 'Cálculo detalhado de todos os custos além do preço do imóvel', type: 'ajuda' },
          { href: '/ajuda/cartorios-de-imoveis-em-osasco', label: 'Cartórios de imóveis em Osasco', description: 'Endereços, telefones e área de abrangência de cada cartório', type: 'ajuda' },
        ],
      },
      {
        heading: 'Financiamento imobiliário em Osasco',
        paragraphs: [
          'A maioria das compras em Osasco é financiada. As principais opções em 2026 são o Minha Casa Minha Vida (para imóveis até R$ 350.000 e renda familiar até R$ 8.000) e o SBPE (mercado livre, para imóveis acima desse teto ou compradores acima do teto de renda do MCMV).',
          'Use o simulador de financiamento para calcular a parcela, o total pago em juros e se você se enquadra no MCMV. Leve o resultado para a conversa com o banco — isso agiliza a análise de crédito.',
        ],
        links: [
          { href: '/simulador', label: 'Simular financiamento imobiliário', description: 'Calcule parcelas SAC, ITBI, custos de cartório e elegibilidade ao MCMV', type: 'tool' },
          { href: '/blog/fgts-compra-imovel-como-usar', label: 'Como usar o FGTS para comprar imóvel em 2026', description: 'Regras, limites e passo a passo para usar o saldo do FGTS na entrada', type: 'blog' },
          { href: '/blog/minha-casa-minha-vida-2026-faixas-subsidio', label: 'Minha Casa Minha Vida 2026: faixas e subsídios', description: 'Regras atualizadas, teto de renda, teto de imóvel e subsídio por faixa', type: 'blog' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Qual o valor mínimo de entrada para comprar imóvel em Osasco?',
        answer: 'A entrada mínima para financiamento pela Caixa e pelos bancos privados é de 20% do valor do imóvel. Para um imóvel de R$ 300.000, você precisa de pelo menos R$ 60.000 de entrada. Quem se enquadra no Minha Casa Minha Vida pode ter essa entrada reduzida com subsídio do governo.',
      },
      {
        question: 'Quanto tempo leva para comprar um imóvel em Osasco?',
        answer: 'O processo completo leva entre 60 e 90 dias: 30 a 45 dias para aprovação do financiamento no banco, mais 15 a 30 dias para lavratura da escritura, pagamento do ITBI e registro em cartório. Sem financiamento (compra à vista), o prazo cai para 15 a 30 dias.',
      },
      {
        question: 'Vale a pena comprar imóvel em Osasco para investir?',
        answer: 'Osasco tem um mercado de locação ativo, especialmente para apartamentos de 1 e 2 quartos próximos à CPTM. A taxa de retorno (renda de aluguel / preço do imóvel) gira em torno de 0,4% a 0,6% ao mês, competindo com investimentos de renda fixa. A valorização histórica acompanhou o IGP-M, com picos nos bairros que receberam novos lançamentos.',
      },
      {
        question: 'Posso comprar imóvel em Osasco sendo autônomo ou MEI?',
        answer: 'Sim. Bancos como Caixa, Itaú e Bradesco aceitam autônomos e MEIs com comprovação de renda por declaração do Imposto de Renda, extratos bancários dos últimos 6 a 12 meses e decore de faturamento. A análise de crédito costuma ser mais criteriosa do que para assalariados.',
      },
    ],
    ctaLabel: 'Ver imóveis à venda em Osasco',
    ctaHref: '/imoveis?tipo=venda&cidade=Osasco',
  },

  'financiamento-imobiliario-osasco': {
    slug: 'financiamento-imobiliario-osasco',
    titulo: 'Financiamento Imobiliário em Osasco: Guia Completo 2026',
    subtitulo: 'Programas, taxas, simulação e passo a passo',
    descricaoMeta:
      'Guia completo de financiamento imobiliário em Osasco em 2026: programas disponíveis (MCMV, SBPE), taxas de juros, como usar o FGTS, passo a passo e simulador.',
    intro:
      'A maioria das compras de imóveis em Osasco é financiada. Entender as diferenças entre os programas — Minha Casa Minha Vida, SBPE e Crédito Associativo — e calcular o custo total antes de escolher o imóvel é o que separa uma compra bem feita de uma surpresa financeira no decorrer do contrato.',
    sections: [
      {
        heading: 'Programas de financiamento disponíveis em Osasco em 2026',
        paragraphs: [
          'Os três programas principais que operam em Osasco são: Minha Casa Minha Vida (MCMV), SBPE (Sistema Brasileiro de Poupança e Empréstimo) e Crédito Associativo via cooperativas.',
          'O MCMV é o mais vantajoso para quem se enquadra: juros de 4% a 7,66% ao ano (contra 11,49% no mercado livre), além de subsídio direto na entrada para as faixas 1 e 2. O limite é renda familiar bruta de até R$ 8.000/mês e imóvel de até R$ 350.000. Em Osasco, boa parte dos lançamentos de 2024-2025 foi projetada para se enquadrar nesse teto.',
          'Para quem fica fora do MCMV — ou quer um imóvel acima de R$ 350.000 — o SBPE com relacionamento bancário parte de 9,9% ao ano na Caixa e de 11% a 12% nos bancos privados.',
        ],
        links: [
          { href: '/simulador', label: 'Simular financiamento com as taxas de 2026', description: 'Compare parcelas SAC, total de juros e elegibilidade ao MCMV', type: 'tool' },
          { href: '/blog/minha-casa-minha-vida-2026-faixas-subsidio', label: 'MCMV 2026: faixas, subsídios e regras completas', description: 'Entenda os tetos de renda, os tetos de imóvel e o valor máximo de subsídio por faixa', type: 'blog' },
        ],
      },
      {
        heading: 'Quanto você precisa ter antes de financiar',
        paragraphs: [
          'Os bancos financiam em geral até 80% do valor do imóvel. Os 20% restantes mais os custos de cartório e ITBI precisam vir do seu bolso (ou do FGTS).',
          'Para um imóvel de R$ 300.000: entrada de R$ 60.000 + ITBI de R$ 9.000 (3% em Osasco conforme LC 227/2026) + cartório em torno de R$ 7.500 = R$ 76.500 antes de financiar o restante.',
          'A capacidade de pagamento é limitada a 30% da renda familiar bruta. Para uma parcela inicial de R$ 2.000, a renda mínima exigida é R$ 6.667/mês.',
        ],
        links: [
          { href: '/ajuda/custos-para-comprar-imovel-em-osasco', label: 'Custos totais de compra em Osasco', description: 'Cálculo detalhado de ITBI (3% em Osasco), escritura e registro', type: 'ajuda' },
          { href: '/blog/fgts-compra-imovel-como-usar', label: 'Como usar o FGTS para compor a entrada', description: 'Regras de elegibilidade, modos de uso e limites por programa', type: 'blog' },
        ],
      },
      {
        heading: 'Passo a passo do financiamento imobiliário',
        paragraphs: [
          '1. Simule o financiamento antes de escolher o imóvel: saiba exatamente qual parcela máxima você pode pagar (30% da renda) e qual o valor máximo de imóvel que isso financia.',
          '2. Reúna a documentação: RG, CPF, comprovante de renda (últimos 3 contracheques ou declaração de IR), extratos bancários, certidão de estado civil e comprovante de residência.',
          '3. Faça a análise de crédito no banco: pode ser feita antes mesmo de escolher o imóvel. A aprovação preliminar (carta de crédito) dá segurança na negociação.',
          '4. Escolha o imóvel e assine a proposta: o banco vai pedir a documentação do imóvel (matrícula, IPTU, habite-se) para avaliação e laudo técnico.',
          '5. Assine o contrato de financiamento: geralmente feito no próprio banco ou cartório conveniado. A Caixa opera em cartórios credenciados em Osasco.',
          '6. Registre o contrato no Cartório de Registro de Imóveis: o imóvel fica em alienação fiduciária até a quitação do financiamento.',
        ],
        links: [
          { href: '/blog/documentos-para-financiar-imovel-2026', label: 'Checklist de documentos para aprovação do financiamento', description: 'Lista completa separada por banco: Caixa, Itaú, Bradesco e Santander', type: 'blog' },
          { href: '/ajuda/cartorios-de-imoveis-em-osasco', label: 'Cartórios de imóveis em Osasco', description: 'Endereços e áreas de abrangência para registro do contrato', type: 'ajuda' },
        ],
      },
      {
        heading: 'Sistema SAC: como funcionam as parcelas',
        paragraphs: [
          'O sistema de amortização padrão nos financiamentos brasileiros é o SAC (Amortização Constante). As parcelas começam maiores e vão caindo todo mês, porque a amortização do principal é constante enquanto os juros incidem sobre o saldo devedor — que diminui a cada pagamento.',
          'No PRICE (parcelas fixas), as parcelas são iguais do início ao fim, mas o saldo devedor cai mais lentamente — você paga mais juros no total. A maioria dos programas habitacionais usa o SAC porque protege o tomador de crédito a longo prazo.',
          'Use o simulador para comparar o custo total entre os dois sistemas com o seu perfil de renda e prazo desejado.',
        ],
        links: [
          { href: '/simulador', label: 'Comparar SAC e PRICE no simulador', description: 'Veja parcelas, total de juros e saldo devedor mês a mês', type: 'tool' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Qual banco tem as melhores taxas de financiamento em Osasco?',
        answer: 'Para imóveis dentro do teto do MCMV (até R$ 350.000), a Caixa Econômica Federal tem as melhores taxas: de 4% a.a. (Faixa 1) até 9,9% a.a. (SBPE com relacionamento). Para imóveis acima do teto, vale cotar nos bancos privados — Itaú, Bradesco e Santander costumam oferecer taxas competitivas para clientes com bom relacionamento.',
      },
      {
        question: 'O FGTS pode ser usado para dar entrada em Osasco?',
        answer: 'Sim, desde que o imóvel seja residencial urbano, o comprador não tenha outro imóvel na cidade onde mora ou trabalha, e a renda esteja dentro dos limites do SFH (financiamento de até R$ 1,5 milhão). O saldo do FGTS pode ser usado para entrada, amortização do saldo devedor ou abatimento de parcelas.',
      },
      {
        question: 'Quanto tempo leva a aprovação do financiamento na Caixa?',
        answer: 'Com documentação completa, a aprovação na Caixa leva entre 30 e 45 dias úteis para imóveis novos (direto da construtora) e 20 a 30 dias para imóveis usados. O processo inclui análise de crédito, vistoria e avaliação do imóvel, e emissão do contrato.',
      },
      {
        question: 'Posso financiar um imóvel em Osasco morando em outra cidade?',
        answer: 'Sim. O financiamento imobiliário não exige que o comprador more na mesma cidade do imóvel. A restrição do MCMV é diferente: você não pode ter outro imóvel financiado pelo SFH em qualquer cidade do Brasil, e não pode ter comprado imóvel com recursos do FGTS nos últimos 3 anos.',
      },
    ],
    ctaLabel: 'Simular meu financiamento',
    ctaHref: '/simulador',
  },

  'custos-compra-imovel': {
    slug: 'custos-compra-imovel',
    titulo: 'Custos de Compra de Imóvel em Osasco: Guia Completo 2026',
    subtitulo: 'ITBI, cartório, corretor e financiamento — tudo calculado',
    descricaoMeta:
      'Guia completo dos custos de compra de imóvel em Osasco em 2026: ITBI (3%), cartório, escritura, registro, corretor e custos do financiamento. Calcule o valor total da transação.',
    intro:
      'O preço do imóvel é só uma parte do que você vai gastar. Quem não calcula os custos adicionais antes de assinar o contrato costuma se surpreender com uma conta de 7% a 12% do valor do imóvel que precisa sair do bolso logo no início. Este guia detalha cada custo e mostra como calcular o total.',
    sections: [
      {
        heading: 'ITBI — Imposto de Transmissão de Bens Imóveis',
        paragraphs: [
          'O ITBI é um imposto municipal cobrado toda vez que um imóvel muda de proprietário. Em Osasco, a alíquota foi ajustada para 3% sobre o valor de avaliação fiscal do imóvel (o maior entre o valor declarado na escritura e o valor venal atualizado) pela Lei Complementar 227/2026.',
          'Para um imóvel de R$ 300.000, o ITBI em Osasco corresponde a R$ 9.000. O ITBI precisa ser pago antes da lavratura da escritura — é uma guia emitida pela Prefeitura de Osasco e quitada na rede bancária.',
          'O ITBI só incide sobre a parte financiada quando há financiamento bancário? Não — ele incide sobre o valor total do imóvel, independentemente de quanto foi financiado.',
        ],
        links: [
          { href: '/blog/itbi-osasco-barueri-carapicuiba-sao-paulo-2026', label: 'ITBI em Osasco, Barueri e Carapicuíba: como calcular e onde pagar', description: 'Passo a passo para emitir a guia e evitar erros no cálculo nas três cidades', type: 'blog' },
          { href: '/ajuda/custos-para-comprar-imovel-em-osasco', label: 'Calculadora de custos de compra em Osasco', description: 'Ferramenta para calcular ITBI, cartório e registro de uma só vez', type: 'ajuda' },
        ],
      },
      {
        heading: 'Escritura e registro em cartório',
        paragraphs: [
          'A escritura é o ato notarial que formaliza a transferência de propriedade. Ela é lavrada no Tabelionato de Notas e tem custo calculado sobre o valor do imóvel conforme tabela do Estado de SP — para imóveis de R$ 300.000, gira em torno de R$ 3.000 a R$ 4.000.',
          'O registro da escritura no Cartório de Registro de Imóveis é o passo final que torna o comprador o proprietário legal. Seu custo também varia conforme o valor do imóvel; para R$ 300.000, fica entre R$ 2.500 e R$ 3.500.',
          'Atenção: para imóveis financiados, não há escritura pública separada — o contrato de financiamento bancário já tem força de escritura e é registrado diretamente no Cartório de Imóveis.',
        ],
        links: [
          { href: '/ajuda/cartorios-de-imoveis-em-osasco', label: 'Cartórios de imóveis em Osasco: endereços e competências', description: 'Qual cartório registrar seu imóvel conforme o bairro', type: 'ajuda' },
        ],
      },
      {
        heading: 'Honorários do corretor de imóveis',
        paragraphs: [
          'Quando há intermediação de um corretor credenciado no CRECI, os honorários são devidos por quem contratou o serviço — geralmente o vendedor. Em imóveis residenciais urbanos, a tabela do CRECI-SP estabelece 6% como piso; o mercado pratica entre 5% e 8%.',
          'Para um imóvel de R$ 300.000, a comissão do corretor fica entre R$ 15.000 e R$ 24.000 — valor que o vendedor considera ao definir o preço pedido. Como comprador, você não paga diretamente, mas esse custo está embutido no preço de anúncio.',
        ],
        links: [
          { href: '/blog/quanto-custa-contratar-corretor-imoveis-2026', label: 'Comissão do corretor de imóveis: tabela e o que o CRECI regula', description: 'Percentuais por tipo de transação e quando a intermediação vale a pena', type: 'blog' },
        ],
      },
      {
        heading: 'Custos do financiamento (se houver)',
        paragraphs: [
          'Além da entrada e dos custos de cartório, quem financia tem custos adicionais: tarifa de avaliação do imóvel (geralmente R$ 3.000 a R$ 5.000 pela Caixa), seguro habitacional (MIP — Morte e Invalidez Permanente + DFI — Danos Físicos ao Imóvel, incluídos na parcela) e tarifa de abertura de crédito (varia por banco).',
          'Nos financiamentos pelo MCMV, o seguro MIP é subsidiado pelo programa e seu custo é menor do que no SBPE.',
        ],
        links: [
          { href: '/simulador', label: 'Simular parcelas e custos do financiamento', description: 'Calcule parcela inicial, total de juros, ITBI e custos de cartório', type: 'tool' },
          { href: '/guia/financiamento-imobiliario-osasco', label: 'Guia completo de financiamento imobiliário em Osasco', description: 'Programas, taxas, passo a passo e simulação para 2026', type: 'blog' },
        ],
      },
      {
        heading: 'Resumo: quanto custa comprar imóvel em Osasco',
        paragraphs: [
          'Exemplo para um imóvel de R$ 300.000 com 80% financiado: Entrada (20%): R$ 60.000. ITBI (3%): R$ 9.000. Escritura/registro: R$ 5.500. Avaliação bancária: R$ 3.500. Total necessário no ato: R$ 78.000.',
          'Como regra geral, reserve de 7% a 10% do valor do imóvel além da entrada para cobrir todos esses custos. Quem não planeia esse valor acaba precisando postergar a compra ou recorrer a crédito pessoal de emergência.',
        ],
      },
    ],
    faqs: [
      {
        question: 'O ITBI em Osasco mudou em 2026?',
        answer: 'Sim. A Lei Complementar 227/2026 do Município de Osasco alterou a alíquota do ITBI para 3% sobre o valor de avaliação fiscal do imóvel. A alíquota anterior era de 2%. O impacto é de R$ 3.000 a mais para cada R$ 300.000 de valor de imóvel.',
      },
      {
        question: 'Posso usar o FGTS para pagar o ITBI e o cartório?',
        answer: 'Não diretamente. O FGTS só pode ser usado para entrada (amortização do valor do imóvel) ou para abater parcelas do financiamento. Os custos de ITBI, escritura e registro precisam ser pagos do bolso.',
      },
      {
        question: 'Esses custos são os mesmos para imóvel novo e usado?',
        answer: 'Sim, o ITBI e os custos de cartório são os mesmos. A diferença é que imóveis novos direto da construtora podem ter isenção de ITBI em alguns programas habitacionais específicos — consulte a incorporadora. Também há isenção de escritura para financiamentos pelo SFH abaixo de determinado valor.',
      },
    ],
    ctaLabel: 'Calcular custos do meu financiamento',
    ctaHref: '/simulador',
  },

  'alugar-imovel-osasco-barueri': {
    slug: 'alugar-imovel-osasco-barueri',
    titulo: 'Como Alugar Imóvel em Osasco e Barueri em 2026',
    subtitulo: 'Preços, bairros, garantias e direitos do inquilino',
    descricaoMeta:
      'Guia completo para alugar imóvel em Osasco e Barueri em 2026: preços por bairro, modalidades de garantia (fiador, seguro-fiança, caução), documentos exigidos e direitos do inquilino.',
    intro:
      'Osasco e Barueri formam um dos mercados de locação residencial mais ativos da Grande São Paulo. Quem trabalha no ABCD paulista ou na capital e quer pagar menos de aluguel encontra aqui apartamentos bem localizados com acesso à CPTM, rodovias e comércio completo. Este guia ajuda você a escolher o bairro certo, entender as garantias e fechar sem surpresas.',
    sections: [
      {
        heading: 'Preços de aluguel em Osasco e Barueri em 2026',
        paragraphs: [
          'Osasco: kitnet/studio R$ 800–1.400 | 1 dormitório R$ 1.100–1.800 | 2 dormitórios R$ 1.500–2.800 | 3 dormitórios R$ 2.200–4.500.',
          'Barueri (excluindo Alphaville): 1 dormitório R$ 1.200–2.000 | 2 dormitórios R$ 1.700–3.200. Alphaville pratica preços 30% a 50% acima da média de Barueri.',
          'Em Osasco, os bairros mais baratos ficam no Centro, Bonfim e Vila Yara. Os mais valorizados são Presidente Altino, Continental e Jardim das Flores. Para quem prioriza acesso à CPTM, Jaguaribe e Centro têm a melhor relação custo-acesso.',
        ],
        links: [
          { href: '/blog/alugar-apartamento-osasco-precos-2026', label: 'Preços de aluguel por bairro em Osasco: análise completa', description: 'Comparativo detalhado com faixas por número de quartos e bairro', type: 'blog' },
          { href: '/imoveis?tipo=aluguel&cidade=Osasco', label: 'Ver apartamentos para alugar em Osasco', description: 'Listagem atualizada com filtros por bairro e faixa de preço', type: 'listing' },
        ],
      },
      {
        heading: 'Modalidades de garantia para alugar',
        paragraphs: [
          'Fiador com imóvel próprio: a garantia mais aceita por proprietários mais antigos. O fiador precisa ter imóvel quitado no mesmo estado. Nenhum custo extra para o inquilino, mas exige ter alguém disposto a assinar.',
          'Seguro-fiança: o inquilino contrata uma seguradora via imobiliária. Custo médio de 1 a 2 meses de aluguel por ano. É a alternativa mais rápida quando não há fiador disponível.',
          'Caução em dinheiro: depósito de até 3 meses de aluguel em conta conjunta. Devolvido ao final do contrato corrigido pela TR. Imobiliza capital mas não tem custo recorrente.',
          'Título de capitalização: funciona como caução, mas o valor fica em título no nome do inquilino. Sem rendimento real, mas o dinheiro não fica diretamente acessível ao proprietário.',
        ],
        links: [
          { href: '/blog/documentos-para-alugar-imovel', label: 'Checklist de documentos para alugar por modalidade de garantia', description: 'O que você e o fiador precisam reunir para cada tipo de garantia', type: 'blog' },
        ],
      },
      {
        heading: 'Custos além do aluguel',
        paragraphs: [
          'Antes de fechar, confirme: condomínio (R$ 180 a R$ 600 em Osasco, podendo chegar a R$ 800 em condomínios com portaria 24h), IPTU (a maioria dos contratos transfere ao inquilino; varia de R$ 60 a R$ 150/mês parcelado para apartamentos de 2 quartos em Osasco), água, luz e taxa de administração da imobiliária.',
          'Em Barueri, o IPTU tende a ser mais alto do que em Osasco para imóveis equivalentes. Em Alphaville, some ainda a taxa de manutenção da ALPHAVILLE URBANISMO que varia conforme o setor.',
        ],
      },
      {
        heading: 'Direitos do inquilino: o que a Lei do Inquilinato garante',
        paragraphs: [
          'A Lei 8.245/91 (Lei do Inquilinato) regula todos os contratos de locação residencial no Brasil. Os pontos mais importantes para quem vai alugar em Osasco ou Barueri:',
          'Reajuste: apenas anual, pelo índice previsto em contrato (IGP-M ou IPCA). O proprietário não pode reajustar no meio do contrato.',
          'Prazo mínimo: contratos de 30 meses permitem que o inquilino fique ao final do prazo sem ser despejado sem motivo. Em contratos menores de 30 meses, o proprietário pode retomar o imóvel ao final sem justificativa.',
          'Multa por rescisão: proporcional ao tempo restante do contrato. Em um contrato de 30 meses, após os primeiros 12, a multa cai proporcionalmente a zero.',
          'Vistoria: documente o estado do imóvel na entrada com fotos e vídeos. A imobiliária deve fornecer um laudo de vistoria. Na saída, o proprietário só pode descontar do caução avarias além do desgaste natural de uso.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Preciso ter fiador para alugar apartamento em Osasco?',
        answer: 'Não necessariamente. A maioria das imobiliárias em Osasco aceita seguro-fiança ou caução em dinheiro como alternativa ao fiador. O seguro-fiança custa entre R$ 160 e R$ 360 por mês para um aluguel de R$ 1.800, mas elimina a necessidade de ter um fiador com imóvel próprio.',
      },
      {
        question: 'Qual o prazo mínimo de um contrato de aluguel em Osasco?',
        answer: 'Não há prazo mínimo legal, mas contratos residenciais com prazo inferior a 30 meses permitem que o proprietário solicite o imóvel de volta ao final sem precisar dar motivo. Contratos de 30 meses dão mais estabilidade ao inquilino.',
      },
      {
        question: 'O condomínio pode ser cobrado do inquilino?',
        answer: 'Sim. É prática padrão e legal que o contrato de locação transfira a obrigação de pagamento do condomínio ao inquilino. Taxas extras de condomínio (reformas estruturais, fundo de reserva para obras) podem ser contestadas se o contrato não as prevê explicitamente.',
      },
      {
        question: 'Como saber se o IPTU do imóvel está quitado antes de alugar?',
        answer: 'Peça ao proprietário ou à imobiliária a certidão negativa de débitos municipais do imóvel, emitida pela Prefeitura de Osasco. Débitos de IPTU em aberto podem afetar o inquilino em situações de execução fiscal.',
      },
    ],
    ctaLabel: 'Ver imóveis para alugar em Osasco',
    ctaHref: '/imoveis?tipo=aluguel&cidade=Osasco',
  },
}

export function getGuiaBySlug(slug: string): GuiaData | undefined {
  return GUIAS[slug]
}

export const GUIA_SLUGS = Object.keys(GUIAS)
