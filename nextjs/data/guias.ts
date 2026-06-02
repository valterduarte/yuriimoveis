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
  publishedAt: string
  updatedAt: string
}

export const GUIAS: Record<string, GuiaData> = {
  'comprar-imovel-osasco': {
    slug: 'comprar-imovel-osasco',
    titulo: 'Como Comprar Imóvel em Osasco em 2026',
    subtitulo: 'Guia completo: bairros, preços, passo a passo, financiamento e negociação',
    descricaoMeta:
      'Guia definitivo para comprar imóvel em Osasco em 2026: faixas de preço por bairro e tipo, passo a passo das 10 etapas, documentação completa, financiamento (MCMV e SBPE), custos paralelos (ITBI 3%, cartório), técnicas de negociação e os 7 erros mais comuns.',
    intro:
      'Osasco fechou 2025 com mais de 14 mil transações imobiliárias residenciais — o segundo maior volume da Grande SP fora da capital — e o ritmo segue forte em 2026 com a ampliação do Minha Casa Minha Vida e a queda gradual da Selic. Mas comprar imóvel aqui não é o mesmo que comprar em Alphaville ou na zona oeste paulistana: as faixas de preço variam muito entre bairros vizinhos, o ITBI subiu para 3% em 2026, e três bairros que apareciam em "promessa de valorização" em 2023 já passaram do pico. Este guia reúne o que aprendi como corretor atuando há mais de 10 anos em Osasco e região: as faixas reais de preço por bairro e tipo de imóvel atualizadas para 2026, o passo a passo completo das 10 etapas da compra (com prazos por etapa), o checklist tripartite de documentação (comprador, vendedor e imóvel), como negociar para fechar 5% a 12% abaixo do preço pedido, e os 7 erros que mais custam dinheiro a quem está comprando pela primeira vez.',
    sections: [
      {
        heading: 'Por que comprar imóvel em Osasco em 2026',
        paragraphs: [
          'Osasco é o quinto maior PIB do estado de São Paulo, com cerca de 700 mil habitantes e uma das maiores densidades de empresas por km² do país — sede da Caixa Seguradora, Embraer Defesa, Cosmópolis, e polo de filiais regionais de quase todas as grandes redes de varejo. Isso explica por que o mercado de trabalho local sustenta uma demanda real e consistente por moradia, em vez de depender apenas de quem trabalha em São Paulo capital.',
          'A combinação de infraestrutura é rara para uma cidade fora da capital: Linha 8-Diamante da CPTM (com sete estações dentro do município), Rodoanel Mário Covas, Rodovia Castello Branco, Rodovia Anhanguera, Marginal Tietê a 20 minutos. Quem mora em Osasco e trabalha na zona oeste, Berrini, Faria Lima ou Pinheiros costuma chegar mais rápido ao trabalho do que quem mora na zona leste da capital.',
          'O diferencial de preço continua expressivo em 2026, mas vem se estreitando: apartamentos de 2 quartos com vaga partem de R$ 230.000 em bairros consolidados, contra R$ 460.000 a R$ 550.000 para imóveis equivalentes na zona oeste de SP. O valor do m² médio em Osasco fechou 2025 em R$ 6.400 (FipeZap), com variação de R$ 4.800 no Centro Comercial Jubran a R$ 9.200 em Presidente Altino e Aldeia.',
          'A taxa de vacância residencial em Osasco é de 4,8% — uma das menores da Grande SP — o que significa que quem compra para investir geralmente aluga em 30 a 60 dias. Para quem compra para morar, o custo de vida médio é cerca de 18% inferior ao da capital, com a mesma proximidade ao mercado de trabalho da Grande SP.',
        ],
        links: [
          { href: '/bairros/centro', label: 'Guia do Centro de Osasco', description: 'O bairro com maior oferta de imóveis e melhor relação custo-acesso à CPTM', type: 'bairro' },
          { href: '/bairros/presidente-altino', label: 'Guia do Presidente Altino', description: 'O bairro de maior padrão em Osasco, com edifícios mais recentes', type: 'bairro' },
          { href: '/bairros/aldeia', label: 'Guia do Aldeia', description: 'Bairro residencial valorizado, ideal para famílias com filhos', type: 'bairro' },
        ],
      },
      {
        heading: 'Quanto custa comprar imóvel em Osasco — faixas atualizadas 2026',
        paragraphs: [
          'As faixas variam conforme tipo de imóvel, bairro, conservação e idade do prédio. Os valores abaixo são o que vejo praticado em 2026 nos imóveis efetivamente fechados (e não no preço pedido nos anúncios, que costuma estar 8% a 12% acima):',
          'Apartamento de 1 quarto / studio: R$ 135.000 a R$ 240.000. Mais barato no Centro, Bonfim, Cipava, Cidade de Deus. Mais caro em Vila Yara, Aldeia, Presidente Altino. Studios de 30-35 m² em prédios novos perto da estação Osasco e Presidente Altino partem de R$ 195.000.',
          'Apartamento de 2 quartos com vaga: R$ 230.000 a R$ 410.000. O produto mais comum em Osasco — corresponde a quase metade dos imóveis à venda. Faixa baixa: Bonfim, Padroeira, Conceição, Cidade de Deus, Rochdale. Faixa intermediária: Bela Vista, Centro, Jaguaribe, Km-18. Faixa alta: Vila Yara, Presidente Altino, Aldeia, Jardim das Flores.',
          'Apartamento de 3 quartos com vaga: R$ 340.000 a R$ 620.000. Em bairros consolidados como Bela Vista, Km-18 e Jaguaribe, parte de R$ 360.000 para imóveis usados. Em Presidente Altino e Aldeia, parte de R$ 480.000 para usados e passa de R$ 700.000 em lançamentos novos com 90 m² úteis.',
          'Casa em bairro consolidado: R$ 290.000 a R$ 720.000. As casas têm dispersão maior que apartamentos — depende muito do terreno, padrão de construção e quantidade de vagas. Bairros com maior oferta de casas: Rochdale, Padroeira, Bonfim, Vila Yara, Bela Vista.',
          'Imóvel novo (lançamento ou pronto recente da incorporadora): adicione 10% a 25% sobre as faixas acima. Os bairros com maior oferta de imóveis novos em 2026 são Presidente Altino, Quitaúna, Centro (na faixa da estação) e a expansão recente em Jardim das Flores. O Aldeia tem poucos lançamentos por estar quase totalmente ocupado.',
          'A relação preço por m² é o melhor parâmetro de comparação entre bairros. Em 2026 vejo praticado: R$ 4.800-5.400 em Bonfim, Cidade de Deus, Cipava. R$ 5.800-6.800 em Centro, Bela Vista, Jaguaribe. R$ 7.000-8.000 em Vila Yara, Km-18. R$ 8.500-9.500 em Presidente Altino, Aldeia. Para comparar bairros vizinhos de Barueri (Alphaville e Tamboré), o m² parte de R$ 11.000 — quase o dobro de Osasco para padrão de construção equivalente.',
        ],
        links: [
          { href: '/imoveis?tipo=venda&cidade=Osasco', label: 'Ver todos os imóveis à venda em Osasco', description: 'Listagem completa com filtros por bairro, tipo, número de quartos e faixa de preço', type: 'listing' },
          { href: '/blog/alphaville-ou-barueri-qual-vale-mais-a-pena-2026', label: 'Alphaville ou Barueri? Comparativo 2026', description: 'Análise de custo-benefício entre as duas regiões para quem considera Osasco e Barueri', type: 'blog' },
          { href: '/bairros/bela-vista', label: 'Guia do Bela Vista', description: 'Bairro consolidado com a melhor relação m² versus infraestrutura em Osasco', type: 'bairro' },
        ],
      },
      {
        heading: 'Como escolher o bairro certo para o seu perfil',
        paragraphs: [
          'Escolher o bairro errado é o erro mais caro da compra de imóvel, porque é irreversível sem refazer toda a operação (com novo ITBI, nova escritura, nova mudança). Antes de visitar imóveis, vale ranquear os critérios que importam para o SEU perfil — não os critérios genéricos de "boa localização".',
          'Para jovem solo ou casal sem filhos que prioriza acesso ao trabalho: o que pesa é a distância até a estação da CPTM e a frequência dos trens. Centro, Jaguaribe e Presidente Altino têm acesso direto à Linha 8-Diamante (estações Osasco, Comandante Sampaio e Presidente Altino respectivamente). Cidade de Deus e Conceição também são opções com bom transporte público para a capital.',
          'Para família com filhos em idade escolar: o que pesa é a presença de escolas de qualidade, áreas verdes e segurança. Vila Yara concentra as escolas particulares mais procuradas (Anglo, Objetivo, Etapa Osasco). Aldeia e Bela Vista têm o melhor mix de escolas, praças e supermercados em distância caminhável. Presidente Altino também é forte nessa categoria mas com preço mais alto.',
          'Para quem prioriza padrão construtivo e valorização: Presidente Altino e Aldeia têm os imóveis mais novos e melhor padrão construtivo (acabamentos, áreas de lazer completas com piscina, churrasqueira, salão de festas). A valorização nos últimos 10 anos nesses bairros ficou acima da inflação imobiliária da Grande SP. O ponto de atenção é que a oferta nesses bairros é menor — você precisa ser paciente para encontrar o imóvel certo no preço certo.',
          'Para investidor que vai alugar: o cálculo muda. O que importa é a relação entre preço de compra e aluguel praticado. Em 2026, os melhores yields em Osasco vejo em studios e 1 quarto perto da estação Osasco (Centro, Bonfim), com retorno bruto mensal entre 0,55% e 0,7%. Apartamentos de 2 quartos em Cidade de Deus e Padroeira também têm boa taxa de aluguel pelo perfil de demanda local (famílias jovens com renda MCMV).',
          'Para quem trabalha em Alphaville e quer pagar menos que morar lá: Aldeia, Vila Yara, Km-18 e Jardim das Flores são os bairros que mais recebem essa migração. A distância até Alphaville é de 15 a 25 minutos de carro, e o m² é metade do praticado em Tamboré.',
          'Visite o bairro em três momentos antes de fechar: dia útil às 8h (para entender o trânsito da saída para o trabalho), final de tarde (para sentir o movimento de comércio e segurança no retorno) e fim de semana (para ver lazer e barulho de bares e clubes). Imóvel é compromisso de 30 anos — bairros parecem diferentes em momentos diferentes do dia.',
        ],
        links: [
          { href: '/bairros/vila-yara', label: 'Guia do Vila Yara', description: 'Bairro de famílias com escolas particulares, comércio completo e arborização', type: 'bairro' },
          { href: '/bairros/jaguaribe', label: 'Guia do Jaguaribe', description: 'Acesso direto à estação Comandante Sampaio com preços ainda intermediários', type: 'bairro' },
          { href: '/bairros/km-18', label: 'Guia do Km-18', description: 'Bairro residencial valorizado, ideal para quem trabalha em Alphaville', type: 'bairro' },
          { href: '/bairros/cidade-de-deus', label: 'Guia do Cidade de Deus', description: 'Faixa MCMV e boa relação aluguel-preço para investidores', type: 'bairro' },
        ],
      },
      {
        heading: 'Passo a passo da compra em Osasco — as 10 etapas',
        paragraphs: [
          '1. Defina o orçamento total realista: some entrada (20% para SBPE, 10% para MCMV Faixas 1-2), ITBI (3% sobre o valor), escritura e registro (cerca de 2% combinados), avaliação bancária (R$ 3.500 na Caixa) e mudança. Para um imóvel de R$ 300.000, isso totaliza R$ 78.000 a R$ 80.000 que precisam estar no bolso ANTES de assinar. Verifique também se a parcela do financiamento cabe em 30% da renda familiar bruta.',
          '2. Rode uma análise prévia de crédito (carta de crédito): leva 5 a 10 dias úteis na Caixa para clientes correntistas com renda CLT, 7 a 14 dias nos privados. Ter a carta na mão antes de visitar imóveis dá poder de negociação real: o vendedor sabe que você é qualificado e fecha mais rápido.',
          '3. Defina seu shortlist de 2-3 bairros e visite-os antes de visitar imóveis. Já vi gente fechar contrato em um imóvel "lindo" sem nunca ter caminhado pelo bairro às 8h num dia útil — e descobrir depois que perde 90 minutos no trânsito todo dia para chegar ao trabalho.',
          '4. Visite ao menos 5 imóveis antes de fazer a primeira proposta. Compare imóveis similares (mesmo número de quartos, mesma faixa de m²) em bairros diferentes. Preço por metro quadrado é o melhor parâmetro de comparação objetivo. Anote em cada visita: condição do prédio, vizinhança, andar, posição solar, vagas, condomínio mensal e IPTU anual.',
          '5. Faça a proposta por escrito (mesmo que informal por mensagem): o preço pedido raramente é o preço final. Em imóveis com mais de 90 dias de anúncio, reduções de 5% a 12% são comuns. Em imóveis novos direto da construtora, o desconto vem em condições de pagamento (parcelamento da entrada, taxa de financiamento subsidiada) mais do que no preço.',
          '6. Verifique a documentação do imóvel e do vendedor ANTES de assinar qualquer compromisso: matrícula atualizada com até 30 dias, certidões negativas do imóvel (ônus, ações reais e reipersecutórias) e do vendedor (certidões cíveis e trabalhistas dos cartórios distribuidores), IPTU quitado, ausência de inventário pendente, declaração de quitação de condomínio se for apartamento.',
          '7. Assine o Contrato de Promessa de Compra e Venda com sinal de 10% a 20% do valor — junto com cláusula expressa de "condicionado à aprovação do financiamento pelo valor de compra". Sem essa cláusula, se o banco avaliar abaixo, você pode perder o sinal.',
          '8. Acompanhe a análise de crédito e a avaliação bancária: a Caixa leva 30 a 45 dias úteis no MCMV, 20 a 30 nos privados para imóveis usados. A avaliação técnica do imóvel acontece em paralelo (engenheiro/arquiteto credenciado pelo banco visita o imóvel). Se a avaliação vier abaixo do preço, ative a cláusula do passo 7 ou renegocie.',
          '9. Pague o ITBI antes da assinatura do contrato de financiamento: a guia é emitida pela Prefeitura de Osasco (presencial ou pelo portal online), com prazo de pagamento de 30 dias após emissão. Sem ITBI quitado, o cartório recusa o registro.',
          '10. Assine o contrato de financiamento (ou a escritura, se compra à vista) e registre no Cartório de Registro de Imóveis competente: prazo de 30 dias após a assinatura. Em Osasco há dois cartórios de registro de imóveis com áreas de competência divididas por bairro — registrar no cartório errado significa pagar de novo e refazer tudo.',
          'Ciclo total típico em Osasco: 60 a 90 dias para compra financiada via Caixa (mais lenta), 40 a 70 dias via Itaú ou Santander, 20 a 35 dias para compra à vista. Esse prazo conta do aceite da proposta até a chave entregue.',
        ],
        links: [
          { href: '/ajuda/documentos-para-comprar-imovel', label: 'Checklist de documentos para comprar imóvel', description: 'Lista completa de documentos do comprador, vendedor e imóvel separados por etapa', type: 'ajuda' },
          { href: '/ajuda/custos-para-comprar-imovel-em-osasco', label: 'Custos de compra em Osasco: ITBI, escritura e registro', description: 'Cálculo detalhado de todos os custos paralelos com a alíquota de ITBI 3% atualizada', type: 'ajuda' },
          { href: '/ajuda/cartorios-de-imoveis-em-osasco', label: 'Cartórios de imóveis em Osasco', description: 'Endereços, telefones e área de competência de cada cartório por bairro', type: 'ajuda' },
        ],
      },
      {
        heading: 'Documentação: o checklist tripartite (comprador, vendedor e imóvel)',
        paragraphs: [
          'A maioria dos negócios que travam ou caem em Osasco não cai por falta de dinheiro — cai por documentação que não fecha. Vejo isso pelo menos uma vez por mês na prática. Saber o que cada parte precisa apresentar evita 80% dos problemas.',
          'Documentos do comprador (e cônjuge se houver): RG e CPF originais, certidão de nascimento ou casamento atualizada (até 90 dias), comprovante de endereço recente (até 60 dias), comprovação de renda — para CLT são os últimos 3 contracheques mais CTPS digital; para autônomo/MEI são DECORE de contador, IRPF dos últimos 2 anos e extratos bancários dos últimos 6 a 12 meses; para empresário, contrato social mais pró-labore comprovado. Se houver dependentes, comprovante de filiação.',
          'Documentos do vendedor (e cônjuge se houver): mesmos documentos pessoais do comprador, mais certidão de quitação de tributos federais (Receita Federal), certidão negativa de débitos trabalhistas (TST) e certidões dos cartórios distribuidores cíveis (Justiça Estadual e Federal). Essas certidões protegem o comprador contra fraude à execução — se o vendedor estiver com processo trabalhista ou execução fiscal, o juiz pode determinar a penhora do imóvel mesmo depois da venda. Já vi famílias perderem imóveis recém-comprados em Osasco exatamente por esse buraco.',
          'Documentos do imóvel: matrícula atualizada do Cartório de Registro de Imóveis (até 30 dias antes da escritura), certidão de ônus reais (geralmente no mesmo documento da matrícula), IPTU dos últimos 5 anos quitado (a Prefeitura de Osasco fornece extrato no portal online), planta aprovada na prefeitura se o imóvel foi reformado, habite-se se for imóvel novo, e — para apartamentos — declaração de quitação de condomínio assinada pelo síndico em papel timbrado do edifício.',
          'Especial atenção em Osasco: imóveis em loteamentos antigos do Centro e Bonfim podem ter pendências de regularização junto à Prefeitura. Confirme se o desdobro está registrado e se há averbação de construção na matrícula. Sem averbação, o banco recusa o financiamento.',
          'Imóveis recebidos por herança: exigem inventário concluído com partilha registrada na matrícula. Se ainda está em andamento, o financiamento bancário fica inviável até a conclusão. Quem aceitar comprar imóvel "em inventário" assume risco alto — só vale com desconto expressivo e contrato muito bem feito.',
        ],
        links: [
          { href: '/ajuda/documentos-para-comprar-imovel', label: 'Checklist completo de documentos por etapa', description: 'Lista detalhada com modelo de certidões e onde obter cada uma', type: 'ajuda' },
        ],
      },
      {
        heading: 'Financiamento imobiliário: opções para Osasco em 2026',
        paragraphs: [
          'Mais de 80% das compras em Osasco em 2025 foram financiadas. Conhecer as opções antes de visitar imóveis evita escolher um imóvel que não cabe no programa errado.',
          'Minha Casa Minha Vida (MCMV) — programa do governo federal operado pela Caixa. Em 2026, opera em quatro faixas: Faixas 1 a 3 para renda familiar até R$ 9.600/mês e imóvel até R$ 400.000 (juros de 4% a 7,66% a.a. dependendo da faixa de renda); Faixa 4 (nova em 2026) para renda entre R$ 9.600 e R$ 13.000 com imóvel de até R$ 600.000 (juros a partir de 8,49% a.a.). Subsídio direto na entrada para Faixas 1 e 2, e financiamento de até 90% do valor para essas faixas.',
          'SBPE (Sistema Brasileiro de Poupança e Empréstimo) — financiamento de mercado para quem não se enquadra no MCMV ou quer imóvel acima de R$ 600.000. Caixa parte de 9,9% a.a. com relacionamento; Itaú, Bradesco e Santander entre 10,49% e 12,49% a.a. dependendo de cesta de produtos. Inter entrou em 2024 com taxas competitivas para correntistas. Financiamento de até 80% do valor.',
          'Crédito Associativo — operado por cooperativas como Sicredi e Cooperforte. Taxa intermediária (cerca de 8,5% a.a. em 2026), exige adesão à cooperativa e o imóvel precisa ser de incorporadora conveniada. Comum em lançamentos novos em Osasco e Barueri.',
          'Financiamento direto com a construtora — comum em empreendimentos na planta. Prazos costumam terminar na entrega das chaves (geralmente 24-36 meses), com juros menores que o SBPE durante a obra. Atenção à cláusula de correção monetária (INCC durante a obra, depois normalmente IPCA) e às condições de "reforço" na entrega.',
          'Use o simulador para calcular parcela inicial SAC, total pago em juros, ITBI, escritura/registro e elegibilidade ao MCMV de uma vez só. Leve o resultado impresso para a primeira conversa com o banco — isso acelera a análise de crédito porque o gerente já entende o seu perfil financeiro.',
        ],
        links: [
          { href: '/simulador', label: 'Simular financiamento imobiliário com taxas 2026', description: 'Calcule parcelas SAC, ITBI, custos de cartório e elegibilidade ao MCMV em um clique', type: 'tool' },
          { href: '/guia/financiamento-imobiliario-osasco', label: 'Guia completo de financiamento em Osasco', description: 'Comparativo entre Caixa, Itaú, Bradesco e Santander; uso do FGTS; CET; SAC vs PRICE', type: 'blog' },
          { href: '/blog/fgts-compra-imovel-como-usar', label: 'Como usar o FGTS para comprar imóvel em 2026', description: 'Regras, limites e passo a passo para usar o saldo do FGTS na entrada e em amortizações', type: 'blog' },
          { href: '/blog/minha-casa-minha-vida-2026-faixas-subsidio', label: 'Minha Casa Minha Vida 2026: faixas e subsídios', description: 'Regras atualizadas, teto de renda, teto de imóvel e subsídio por faixa', type: 'blog' },
          { href: '/mcmv-osasco', label: 'Landing completa do MCMV em Osasco', description: 'Programa específico para Osasco com bairros elegíveis e FAQs do programa', type: 'tool' },
        ],
      },
      {
        heading: 'ITBI, escritura, registro e demais custos paralelos',
        paragraphs: [
          'Quem não calcula os custos paralelos antes de assinar costuma se assustar com uma conta de 6% a 8% do valor do imóvel que precisa sair do bolso, sem ser financiada. Em 2026, com o ITBI de Osasco em 3%, esse percentual subiu em relação aos anos anteriores.',
          'ITBI (Imposto de Transmissão de Bens Imóveis) — imposto municipal cobrado a cada transferência de propriedade. Em Osasco, alíquota de 3% sobre o valor de avaliação fiscal (o maior entre o valor declarado na escritura e o valor venal atualizado da Prefeitura), conforme a Lei Complementar 227/2026. Para um imóvel de R$ 300.000, são R$ 9.000. Pago pelo comprador via guia da Prefeitura de Osasco antes da lavratura da escritura.',
          'Escritura pública — lavrada no Tabelionato de Notas (não no Cartório de Registro de Imóveis). Custo calculado por tabela do Estado de SP em função do valor do imóvel; para R$ 300.000, fica entre R$ 3.000 e R$ 4.000. Para imóveis financiados, não há escritura pública separada — o contrato de financiamento bancário já tem força de escritura.',
          'Registro no Cartório de Registro de Imóveis — passo que torna o comprador o proprietário legal. Tabela estadual também por valor; para R$ 300.000, custo entre R$ 2.500 e R$ 3.500. Sem o registro, o imóvel não é seu juridicamente, mesmo que você tenha as chaves.',
          'Avaliação bancária — se houver financiamento, o banco cobra a vistoria técnica do imóvel: R$ 3.500 na Caixa, R$ 3.000 a R$ 4.500 nos privados. Pago pelo comprador no início do processo.',
          'Honorários de corretor — quando há intermediação, geralmente devidos pelo vendedor (entre 5% e 8% do valor). Para o comprador, esse custo está embutido no preço pedido. Quando há corretor representando especificamente o comprador (compra assistida), os honorários podem ser combinados em separado.',
          'Resumo prático: para um imóvel de R$ 300.000 financiado a 80%, reserve R$ 80.000 em recursos próprios para o ato (entrada de R$ 60.000 + R$ 20.000 de custos paralelos). Para imóvel à vista, R$ 320.000 a R$ 325.000 (preço + custos). Regra rápida: 6% a 8% do valor do imóvel para custos paralelos.',
        ],
        links: [
          { href: '/guia/custos-compra-imovel', label: 'Guia detalhado dos custos de compra em Osasco', description: 'Cálculo passo a passo de ITBI, cartório, corretor e financiamento', type: 'blog' },
          { href: '/blog/itbi-osasco-barueri-carapicuiba-sao-paulo-2026', label: 'ITBI em Osasco, Barueri e Carapicuíba: como calcular e onde pagar', description: 'Passo a passo para emitir a guia e evitar erros no cálculo nas três cidades', type: 'blog' },
          { href: '/ajuda/cartorios-de-imoveis-em-osasco', label: 'Cartórios de imóveis em Osasco', description: 'Qual cartório registrar conforme o bairro do imóvel', type: 'ajuda' },
        ],
      },
      {
        heading: 'Como negociar e fechar abaixo do preço pedido em Osasco',
        paragraphs: [
          'Na minha experiência atendendo Osasco, o preço pedido raramente é o preço final. Os imóveis fecharam em 2025 com desconto médio de 6% a 9% sobre o anúncio inicial — e em alguns casos cheguei a fechar negócios com desconto de 14% a 17%. A diferença entre quem paga o preço cheio e quem negocia bem é técnica e timing, não sorte.',
          'Identifique imóveis "frios" — aqueles que estão anunciados há muito tempo. Sinais: anúncio com mais de 90 dias no portal, fotos antigas, redução de preço já feita pelo proprietário, vendedor que mora em outra cidade ou herdeiros tentando vender. Esses são os imóveis com maior margem para desconto. Em portais como o nosso, dá para filtrar por tempo de anúncio e ver historicamente quanto cada imóvel já foi reduzido.',
          'Use comparáveis reais como ferramenta de ancoragem: na proposta, cite 3 imóveis equivalentes vendidos no mesmo bairro nos últimos 6 meses com seus respectivos valores e R$/m². Isso muda a conversa: deixa de ser "ofereço menos porque quero pagar menos" e vira "o mercado está pagando X — sua proposta está acima do mercado". Vendedores informados respondem melhor a dados que a apelos emocionais.',
          'Ofereça pagamento mais ágil em troca de desconto: vendedor com pressa (mudança de cidade, divórcio, sucessão) valoriza muito ter a escritura em 30 dias em vez de 90 dias. Se você já tem carta de crédito aprovada e documentação pronta, isso vira moeda na negociação. Já vi 5% de desconto saírem só por essa carta na mesa.',
          'Aponte custos reais de reforma com base em vistoria técnica: piso danificado, esquadrias velhas, hidráulica antiga, ausência de antena coletiva, problemas de infiltração. Cada item tem um custo orçado de empreiteiro — leve esses orçamentos para a negociação como abatimento. Não é "imóvel feio merece menos"; é "preciso investir R$ 18.000 em reforma — vamos descontar isso do valor".',
          'Saiba quando NÃO negociar mais: em imóvel disputado por mais de um interessado, em lançamento novo da construtora (espaço de negociação está nas condições de pagamento, não no preço), e quando o vendedor já mostrou que tem alternativa real. Insistir em desconto nesses cenários afasta o negócio.',
          'Faça a proposta sempre por escrito, ainda que informalmente por mensagem. Proposta verbal não tem valor jurídico e abre espaço para o vendedor mudar de ideia sem custo. Por escrito, mesmo em conversa de WhatsApp, vira documento.',
        ],
        links: [
          { href: '/blog/quanto-custa-contratar-corretor-imoveis-2026', label: 'Por que um corretor representando o comprador vale a comissão', description: 'A negociação assistida por corretor experiente costuma render desconto bem superior à taxa de honorários', type: 'blog' },
          { href: '/imoveis?tipo=venda&cidade=Osasco', label: 'Ver imóveis à venda em Osasco', description: 'Filtros por bairro, faixa de preço e tempo de anúncio', type: 'listing' },
        ],
      },
      {
        heading: 'Os 7 erros mais comuns ao comprar em Osasco — e como evitar',
        paragraphs: [
          'Erro 1 — Olhar só o preço do imóvel, esquecer dos custos paralelos: ITBI 3%, escritura, registro, avaliação bancária e mudança somam 6% a 8% do valor do imóvel. Reserve esse dinheiro ANTES de fechar a proposta, separado da entrada. Quem não separa atrasa o processo ou recorre a empréstimo pessoal caro para fechar.',
          'Erro 2 — Comprar antes de fazer análise prévia de crédito: o sonho desaparece quando o banco reprova ou aprova um valor menor do que você esperava. Faça a análise prévia ANTES de visitar imóveis e ANTES de assinar promessa. A carta de crédito vale 60 a 90 dias e pode ser renovada.',
          'Erro 3 — Escolher o bairro sem visitar em horários reais: bairros que parecem perfeitos no sábado à tarde podem ser caóticos no trânsito da segunda às 8h, ou inseguros à noite. Visite 3 vezes em horários diferentes antes de fechar.',
          'Erro 4 — Pular a checagem de certidões do vendedor: certidões trabalhistas e cíveis do vendedor protegem contra fraude à execução. Já vi famílias perderem imóveis comprados há 2-3 anos porque o vendedor tinha processo trabalhista oculto. Custo das certidões: cerca de R$ 200 — barato pelo seguro que dá.',
          'Erro 5 — Assinar promessa sem cláusula de aprovação de financiamento: se o banco avalia abaixo ou reprova, você pode perder o sinal de 10% a 20% do valor. A cláusula "condicionado à aprovação do financiamento pelo valor de compra" é proteção básica que vendedores aceitam sem problema quando solicitada por escrito.',
          'Erro 6 — Não negociar porque "tem medo de perder o imóvel": em Osasco, 85% dos imóveis fecham com algum desconto sobre o anúncio. Recusa frontal de negociação é rara — mas só acontece quem tenta. Apresente proposta inicial 7% a 10% abaixo do pedido com fundamentação em comparáveis e veja o que volta.',
          'Erro 7 — Apaixonar-se pelo primeiro imóvel: visitar só um imóvel ou parar de comparar depois do segundo é receita para pagar caro. Visite no mínimo 5 imóveis equivalentes em pelo menos 2 bairros antes de fazer proposta firme. Cada visita adicional dá referência de mercado e de poder de barganha.',
          'Bônus — Não exigir vistoria final antes da entrega das chaves: combine no contrato uma vistoria 7 dias antes da entrega para checar condição real (mesma condição da visita inicial), eletrodomésticos prometidos, ausência de móveis abandonados pelo vendedor. Sem essa vistoria, "imprevistos" viram problema seu depois.',
        ],
        links: [
          { href: '/blog/quanto-custa-contratar-corretor-imoveis-2026', label: 'Como um corretor pode evitar esses erros na sua compra', description: 'Os 7 erros acima são exatamente o que um corretor experiente filtra para você', type: 'blog' },
          { href: '/ajuda/documentos-para-comprar-imovel', label: 'Checklist de certidões e documentos para conferência', description: 'Lista que protege contra os erros 4 e 5', type: 'ajuda' },
        ],
      },
      {
        heading: 'Caso prático: comprar 2 quartos em Osasco com renda de R$ 7 mil',
        paragraphs: [
          'Para tornar tudo concreto, vejamos um cenário comum em Osasco: casal com renda total de R$ 7.000/mês (cônjuge 1: R$ 4.500 CLT, cônjuge 2: R$ 2.500 CLT), R$ 40.000 em poupança, R$ 35.000 de FGTS combinado, sem outras dívidas, querendo comprar um apartamento de 2 quartos com vaga em Jaguaribe por R$ 310.000.',
          'Enquadramento MCMV: renda dentro da Faixa 3 (R$ 5.000-9.600), imóvel dentro do teto (R$ 400 mil). Taxa aplicável: 7,66% a.a. Prazo: 360 meses (30 anos). Financiamento de 90% do valor pelo programa.',
          'Composição da entrada: R$ 40.000 dinheiro + R$ 31.000 FGTS = R$ 71.000. Como o MCMV permite financiar 90%, a entrada exigida cai para R$ 31.000. Sobram R$ 40.000 da poupança + R$ 4.000 de FGTS para os custos paralelos.',
          'Valor financiado: R$ 279.000. Parcela inicial SAC: aproximadamente R$ 2.560. Capacidade de pagamento usada: 36,6% da renda — acima do limite de 30% que a Caixa aceita. Soluções: (a) aumentar prazo para 420 meses, baixando a primeira parcela para cerca de R$ 2.395 = 34,2% da renda — ainda apertado; (b) negociar o imóvel para R$ 285.000, reduzindo parcela para R$ 2.350 = 33,6% — ainda apertado; (c) combinar prazo de 420 meses E desconto de 6% (R$ 291.400) — parcela inicial R$ 2.210 = 31,6% da renda. Caixa aceita esse cenário com margem mínima.',
          'Custos no ato: entrada R$ 31.000 + ITBI 3% sobre R$ 291.400 = R$ 8.742 + escritura/registro R$ 5.800 + avaliação Caixa R$ 3.500 = R$ 49.042. O casal cobre com folga: usaram R$ 31.000 da poupança como entrada, R$ 18.000 da poupança restante para custos, e ainda têm reserva.',
          'Resultado final: imóvel R$ 291.400, parcela inicial R$ 2.210 (31,6% da renda), 420 meses, taxa 7,66% a.a. via MCMV Faixa 3. Total pago em juros ao longo do contrato: aproximadamente R$ 295.000. Quitação antecipada possível via amortizações com FGTS a cada 2 anos, reduzindo o prazo real para 22-25 anos sem aumentar parcela.',
          'Lição prática: ter "entrada" não é suficiente — precisa entrar com 5% a 7% do valor do imóvel a mais para custos paralelos. Negociar 6% de desconto + escolher o programa certo + alongar prazo dentro do limite de capacidade pode tornar viável uma compra que parecia inviável no preço pedido inicial. Repita esse cálculo com seus números reais no simulador.',
        ],
        links: [
          { href: '/simulador', label: 'Refazer esse cálculo com seus números no simulador', description: 'Ajuste valor do imóvel, entrada, FGTS, renda e prazo para ver o seu caso real', type: 'tool' },
          { href: '/bairros/jaguaribe', label: 'Guia do Jaguaribe', description: 'Faixas de preço atualizadas, escolas, transporte e ofertas no bairro', type: 'bairro' },
          { href: '/guia/financiamento-imobiliario-osasco', label: 'Guia completo de financiamento em Osasco', description: 'Como escolher entre Caixa, Itaú e Bradesco e usar FGTS para amortizar', type: 'blog' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Qual o valor mínimo de entrada para comprar imóvel em Osasco em 2026?',
        answer: 'No financiamento SBPE (mercado livre), a entrada mínima é de 20% do valor do imóvel. Para um imóvel de R$ 300.000, são R$ 60.000. No MCMV Faixas 1 e 2, com subsídio do governo, a entrada efetiva cai para cerca de 10% do valor. Atenção: além da entrada, reserve mais 6% a 8% do valor do imóvel para custos paralelos (ITBI de 3%, escritura, registro e avaliação bancária) — para R$ 300.000, isso significa entre R$ 78.000 e R$ 84.000 de recursos próprios no ato, dependendo do programa.',
      },
      {
        question: 'Quanto tempo leva para comprar um imóvel em Osasco do começo ao fim?',
        answer: 'O ciclo completo com financiamento via Caixa leva entre 60 e 90 dias úteis: 5-10 dias para análise prévia de crédito, 30-45 dias para aprovação final e avaliação do imóvel, mais 15-30 dias para escritura, ITBI e registro em cartório. Em bancos privados (Itaú, Santander), o prazo é menor: 40 a 70 dias. Para compra à vista, o ciclo cai para 20 a 35 dias. Em períodos de pico do MCMV (geralmente março a junho), os prazos da Caixa podem dobrar.',
      },
      {
        question: 'Vale a pena comprar imóvel em Osasco para investir em 2026?',
        answer: 'Sim, especialmente em studios e apartamentos de 1-2 quartos perto da CPTM (Centro, Jaguaribe, Bonfim, Presidente Altino). A taxa de vacância residencial em Osasco é de 4,8% — uma das menores da Grande SP — e a taxa de retorno bruto (aluguel mensal / preço do imóvel) gira entre 0,5% e 0,7% ao mês, competindo com renda fixa quando incluída a valorização do imóvel. A valorização nos últimos 10 anos acompanhou ou superou o IGP-M nos bairros com novos lançamentos (Presidente Altino, Aldeia, Centro próximo da estação). Cidade de Deus e Padroeira têm yields acima da média pela demanda de famílias MCMV.',
      },
      {
        question: 'Posso comprar imóvel em Osasco sendo autônomo ou MEI?',
        answer: 'Sim. Caixa, Itaú, Bradesco e Santander aceitam autônomos e MEIs com comprovação por DECORE de contador, IRPF dos últimos 2 anos completos e extratos bancários dos últimos 6 a 12 meses. A análise costuma ser mais criteriosa que para CLT: o banco aplica um redutor de 25% a 30% sobre a renda declarada para chegar à renda comprovada. MEI consolidado há mais de 2 anos com faturamento regular tem aprovação parecida com CLT. Profissionais liberais (médico, advogado, engenheiro) costumam ter facilidade adicional em bancos privados que fazem operações específicas para a categoria.',
      },
      {
        question: 'Comprar imóvel na planta ou pronto em Osasco — qual vale mais a pena?',
        answer: 'Depende do horizonte e da tolerância a risco. Imóvel na planta em Osasco custa em média 15% a 22% menos que pronto equivalente — mas exige pagamento da entrada durante a obra (geralmente 36 meses), está sujeito a atrasos de entrega e a INCC ou IPCA na correção das parcelas. Faz sentido para quem tem renda crescente, prazo de espera de 2-3 anos e tolerância a alguma incerteza. Imóvel pronto custa mais, mas você tem chave imediata, condomínio funcionando e nenhum risco de atraso. Para quem precisa morar logo ou para investidor que quer começar a alugar rápido, pronto compensa o preço extra. Em Osasco, lançamentos recentes têm sido mais frequentes em Presidente Altino, Quitaúna e expansão do Centro próxima à estação.',
      },
      {
        question: 'Posso comprar imóvel em Osasco morando em outra cidade ou estado?',
        answer: 'Sim. O financiamento bancário não exige que o comprador seja residente em Osasco. A restrição do MCMV é só não ter outro imóvel financiado pelo SFH em qualquer cidade do Brasil. Para usar FGTS na entrada, o requisito é não ter outro imóvel registrado na cidade onde mora ou trabalha — então quem mora em São Paulo capital pode usar FGTS para comprar em Osasco sem problema. Procuração com poderes específicos permite que terceiro assine documentos por você se for inviável vir presencialmente. Várias famílias do Rio, Curitiba e Minas compram em Osasco como investimento por causa do retorno acima da média de aluguel.',
      },
      {
        question: 'Como verificar se um imóvel em Osasco está livre de pendências antes de comprar?',
        answer: 'Você precisa fazer três checagens independentes. (1) Matrícula atualizada do imóvel no Cartório de Registro de Imóveis competente (até 30 dias antes da escritura) — mostra ônus reais, alienações, penhoras e ações reais. (2) IPTU dos últimos 5 anos — consultável no portal da Prefeitura de Osasco; débitos não quitados podem virar dívida do novo proprietário. (3) Certidões cíveis e trabalhistas do vendedor nos cartórios distribuidores (Justiça Estadual, Federal e do Trabalho) — protegem contra fraude à execução em processos pendentes. Para apartamentos, exija também a declaração de quitação de condomínio assinada pelo síndico. O custo total dessas verificações é de cerca de R$ 250 e elas protegem você contra os problemas mais caros que podem aparecer depois.',
      },
      {
        question: 'Vale a pena comprar imóvel de leilão em Osasco?',
        answer: 'Pode valer, mas exige due diligence extra e capital disponível à vista. Imóveis de leilão judicial em Osasco (Vara da Fazenda Pública e Varas Cíveis) costumam fechar entre 25% e 45% abaixo do valor de mercado, mas o pagamento é à vista em 24 a 48 horas após a arrematação — não há financiamento bancário para leilão judicial. Já leilões extrajudiciais da própria Caixa (decorrentes de inadimplência em financiamentos anteriores) podem ser financiados pela Caixa em até 80% do valor da arrematação. Os riscos: imóvel geralmente não pode ser visitado antes do leilão, pode haver ocupação por antigo morador, dívidas de IPTU e condomínio acumuladas. Edital sempre traz a relação de débitos — leia integralmente antes de dar lance. Vale para investidor experiente, não para quem está comprando primeiro imóvel para morar.',
      },
    ],
    ctaLabel: 'Ver imóveis à venda em Osasco',
    ctaHref: '/imoveis?tipo=venda&cidade=Osasco',
    publishedAt: '2026-05-01',
    updatedAt: '2026-05-20',
  },

  'financiamento-imobiliario-osasco': {
    slug: 'financiamento-imobiliario-osasco',
    titulo: 'Financiamento Imobiliário em Osasco: Guia Completo 2026',
    subtitulo: 'Programas, taxas, simulação e passo a passo',
    descricaoMeta:
      'Guia completo de financiamento imobiliário em Osasco em 2026: programas (MCMV 4 faixas, SBPE, Associativo), comparativo entre Caixa, Itaú, Bradesco e Santander, uso do FGTS, CET, análise de crédito, passo a passo e simulador.',
    intro:
      'Mais de 80% das compras de imóveis em Osasco em 2025 foram financiadas — e o número segue subindo em 2026 com a ampliação do Minha Casa Minha Vida e a queda gradual da Selic. Mas o financiamento errado pode custar dezenas de milhares de reais em juros ao longo de 30 anos. Este guia reúne tudo o que você precisa para escolher o programa certo, calcular o custo real e fechar a operação sem surpresas: comparativo entre os 5 principais bancos que operam em Osasco, regras atualizadas do MCMV pelas portarias de 2026, como usar o FGTS estrategicamente, o que os bancos olham na análise de crédito, e os erros mais comuns que vejo na prática como corretor há mais de 10 anos atendendo Osasco e região.',
    sections: [
      {
        heading: 'Programas de financiamento disponíveis em Osasco em 2026',
        paragraphs: [
          'Três programas principais operam em Osasco: Minha Casa Minha Vida (MCMV), SBPE (Sistema Brasileiro de Poupança e Empréstimo) e Crédito Associativo via cooperativas. Cada um tem público-alvo distinto, faixa de imóveis e taxa de juros muito diferentes — escolher o errado significa pagar 4 a 5 pontos percentuais a mais ao ano por 30 anos.',
          'O MCMV é o mais vantajoso para quem se enquadra: juros de 4% a 7,66% ao ano nas Faixas 1-3 (contra 11,49% no mercado livre), além de subsídio direto na entrada para as faixas 1 e 2. As regras atualizadas em 2026 ampliaram bastante o programa: as Faixas 1-3 cobrem renda até R$ 9.600/mês e imóvel até R$ 400.000, e a nova Faixa 4 atende renda entre R$ 9.600 e R$ 13.000 com imóvel de até R$ 600.000. Para imóveis em Osasco, isso significa que mesmo quem ganha R$ 13 mil em casal e busca apartamento de R$ 500 mil em Vila Yara ou Aldeia agora pode entrar no programa — algo que não era possível antes da reforma.',
          'Para quem fica fora do MCMV — ou quer um imóvel acima de R$ 600.000 — o SBPE com relacionamento bancário parte de 9,9% ao ano na Caixa e de 11% a 12% nos bancos privados. O Crédito Associativo, operado por cooperativas como o Sicredi e a Cooperforte, fica entre os dois: cerca de 8,5% ao ano, mas exige adesão à cooperativa (taxa de associação de R$ 50 a R$ 200) e o imóvel precisa ser de incorporadora conveniada.',
          'Existe ainda o financiamento direto com a construtora, comum em empreendimentos novos na planta em Osasco e Barueri. Costuma ter prazos menores (até a entrega das chaves) e juros menores que o SBPE, mas exige reforço de FGTS na entrega — vale checar com cuidado o contrato antes de assinar, porque alguns têm cláusulas de correção monetária bem mais caras que o INCC.',
        ],
        links: [
          { href: '/simulador', label: 'Simular financiamento com as taxas de 2026', description: 'Compare parcelas SAC, total de juros e elegibilidade ao MCMV', type: 'tool' },
          { href: '/mcmv-osasco', label: 'Landing completa do MCMV em Osasco', description: 'Faixas, bairros, passo a passo e FAQs específicas do programa', type: 'tool' },
          { href: '/blog/minha-casa-minha-vida-2026-faixas-subsidio', label: 'MCMV 2026: faixas, subsídios e regras completas', description: 'Entenda os tetos de renda, os tetos de imóvel e o valor máximo de subsídio por faixa', type: 'blog' },
        ],
      },
      {
        heading: 'Comparativo entre Caixa, Itaú, Bradesco, Santander e Inter para Osasco',
        paragraphs: [
          'A Caixa é dominante no MCMV (operadora exclusiva da Faixa 1) e tem rede capilar em Osasco com agências no Centro, Cidade de Deus, Vila Yara e Presidente Altino. Taxas vão de 4% a 9,9% a.a. dependendo do programa e do relacionamento. O ponto fraco da Caixa é a velocidade: análise de crédito leva 15 a 30 dias úteis em condições normais, podendo passar de 60 dias em períodos de pico (geralmente entre março e junho).',
          'O Itaú costuma ser o mais ágil dos privados em Osasco — análise de crédito em 7 a 14 dias quando o cliente já é correntista. Taxa SBPE varia de 10,49% a 12,49% a.a. dependendo de cesta de produtos (conta salário, seguros, previdência). Para quem já tem relacionamento Itaú, vale pedir simulação de portabilidade quando estiver com financiamento ativo na Caixa.',
          'O Bradesco costuma ser competitivo em imóveis acima de R$ 700.000 — faixa em que a Caixa fica menos vantajosa. Taxa SBPE entre 10,75% e 12% a.a. Tem condições especiais para profissionais liberais com receita comprovada via CNPJ.',
          'O Santander é o que mais ofereceu campanhas promocionais em 2025/2026 para Osasco e Barueri, com taxas a partir de 9,99% a.a. para clientes Van Gogh ou Select. A análise de crédito é mais rigorosa para autônomos.',
          'O Inter entrou forte no financiamento imobiliário em 2024 e oferece taxas competitivas para correntistas (a partir de 10,49% a.a. em 2026), com simulação totalmente digital e sem agência física. A pegadinha: a aprovação final ainda exige documentação física e a avaliação do imóvel costuma demorar mais que nos bancos tradicionais por terem menos avaliadores credenciados na região.',
          'Minha recomendação prática para Osasco: simule em pelo menos 3 bancos (Caixa obrigatório se MCMV-elegível, mais 2 privados), compare CET e não só a taxa nominal, e priorize o banco onde já recebe salário — o desconto por relacionamento pode chegar a 1,5 ponto percentual ao ano.',
        ],
        links: [
          { href: '/blog/documentos-para-financiar-imovel-2026', label: 'Documentação por banco: Caixa, Itaú, Bradesco e Santander', description: 'Diferenças no checklist e dicas para acelerar a aprovação em cada um', type: 'blog' },
        ],
      },
      {
        heading: 'Quanto você precisa ter antes de financiar',
        paragraphs: [
          'Os bancos financiam em geral até 80% do valor do imóvel pelo SBPE, e até 90% pelo MCMV nas Faixas 1 e 2 (com subsídio do governo). Os 20% (ou 10%) restantes mais os custos de cartório e ITBI precisam vir do seu bolso ou do FGTS — e essa é a barreira de entrada que pega a maioria dos compradores de primeira viagem desprevenidos.',
          'Para um imóvel de R$ 300.000 financiado a 80%: entrada de R$ 60.000 + ITBI de R$ 9.000 (3% em Osasco conforme LC 227/2026) + escritura/registro em torno de R$ 7.500 + avaliação bancária de R$ 3.500 (Caixa) = R$ 80.000 necessários no ato, antes do financiamento começar. Isso é 26,7% do valor do imóvel — número que costuma chocar quem só pensou na entrada.',
          'A capacidade de pagamento é limitada por todos os bancos a 30% da renda familiar bruta. Para uma parcela inicial de R$ 2.000 no sistema SAC, a renda mínima exigida é R$ 6.667/mês. Se você tem dependentes, dívidas registradas no SCR (Sistema de Informações de Crédito do Bacen) ou já tem outro financiamento ativo, esse percentual cai — alguns bancos reduzem para 25% ou até 20% nessas condições.',
          'Antes de simular: rode uma consulta gratuita ao seu SCR no site do Bacen (registrato.bcb.gov.br) e veja todos os créditos em seu nome. Surpresas como cartões esquecidos ou cheque especial usado podem reduzir significativamente a capacidade de financiamento aprovada.',
        ],
        links: [
          { href: '/ajuda/custos-para-comprar-imovel-em-osasco', label: 'Custos totais de compra em Osasco', description: 'Cálculo detalhado de ITBI (3% em Osasco), escritura e registro', type: 'ajuda' },
          { href: '/ajuda/itbi-osasco', label: 'ITBI de Osasco: cálculo e isenção', description: 'A alíquota de 3%, a base de cálculo e quando há redução pelo MCMV ou SFH', type: 'ajuda' },
          { href: '/ajuda/iptu-osasco', label: 'IPTU de Osasco: cálculo, parcelamento e isenção', description: 'Como funciona o IPTU e por que conferir débitos do imóvel antes de comprar', type: 'ajuda' },
          { href: '/blog/fgts-compra-imovel-como-usar', label: 'Como usar o FGTS para compor a entrada', description: 'Regras de elegibilidade, modos de uso e limites por programa', type: 'blog' },
        ],
      },
      {
        heading: 'Como usar o FGTS na entrada e durante o contrato',
        paragraphs: [
          'O FGTS é o melhor amigo de quem está comprando o primeiro imóvel em Osasco. Pode ser usado de quatro formas no financiamento, e usar bem (na ordem certa) economiza dezenas de milhares de reais em juros ao longo do contrato.',
          'Uso 1 — compor a entrada: o saldo do FGTS do titular (e do cônjuge se for compra conjunta) pode somar à entrada própria. Para um imóvel de R$ 300.000 com entrada exigida de R$ 60.000, se você tem R$ 25.000 de FGTS, só precisa colocar R$ 35.000 de dinheiro próprio. Requisitos: 3 anos de FGTS (não precisam ser consecutivos), imóvel residencial urbano, comprador sem outro imóvel registrado na cidade onde mora ou trabalha, e valor do imóvel dentro do teto SFH (R$ 1,5 milhão).',
          'Uso 2 — amortização do saldo devedor: a cada 2 anos você pode usar o saldo acumulado para abater diretamente o valor que ainda deve. Cada R$ 10.000 de FGTS usado para amortizar abate cerca de R$ 25.000 a R$ 30.000 do total pago no contrato (porque elimina juros sobre juros até o final do prazo).',
          'Uso 3 — pagamento parcial das parcelas: o FGTS pode ser usado para pagar até 80% do valor da parcela mensal por até 12 meses consecutivos. Útil em períodos de aperto financeiro ou desemprego.',
          'Uso 4 — quitação total: se o saldo do FGTS for igual ou maior que o saldo devedor, dá para quitar o financiamento integralmente. Vale sempre fazer a conta: quitar antecipadamente um financiamento Caixa SBPE a 9,9% a.a. usando FGTS (que rende ~3% a.a.) é matematicamente uma das melhores aplicações disponíveis para a maioria das famílias.',
          'Estratégia para Osasco: use o FGTS PRIMEIRO na composição da entrada (porque reduz o valor financiado e portanto a parcela inicial), e DEPOIS, a cada 2 anos, em amortizações. Combinar essa estratégia com pagamentos antecipados extras pode encurtar um financiamento de 30 anos para 15-18 anos sem aumentar a parcela mensal.',
        ],
        links: [
          { href: '/blog/fgts-compra-imovel-como-usar', label: 'FGTS para compra de imóvel: regras detalhadas', description: 'Documentação, prazos de liberação e casos especiais', type: 'blog' },
          { href: '/simulador', label: 'Simular financiamento com FGTS na entrada', description: 'Veja o impacto na parcela e no total pago de juros', type: 'tool' },
        ],
      },
      {
        heading: 'Passo a passo do financiamento imobiliário em Osasco',
        paragraphs: [
          '1. Simule o financiamento antes de escolher o imóvel: saiba exatamente qual parcela máxima você pode pagar (30% da renda) e qual o valor máximo de imóvel que isso financia. Sem essa conta, você corre o risco de se apaixonar por imóveis fora da sua capacidade ou de ofertar abaixo do que poderia pagar.',
          '2. Reúna a documentação pessoal: RG, CPF, comprovante de renda (últimos 3 contracheques para CLT, DECORE ou IRPF dos 2 últimos anos para autônomo/MEI), extratos bancários dos últimos 3 meses, certidão de estado civil atualizada (até 90 dias) e comprovante de residência recente. Cônjuge participante: mesma documentação.',
          '3. Faça a análise de crédito no banco: pode ser feita antes mesmo de escolher o imóvel. A aprovação preliminar (carta de crédito) dá segurança na negociação porque você prova ao vendedor que tem condições reais de fechar. Em Osasco, a Caixa emite carta de crédito em 5 a 10 dias úteis para clientes correntistas com renda CLT.',
          '4. Escolha o imóvel e assine a proposta: assim que o vendedor aceitar, o banco vai pedir a documentação do imóvel (matrícula atualizada com até 30 dias, IPTU em dia, habite-se se for novo, planta aprovada na prefeitura, declaração de quitação de condomínio se for apartamento) para fazer a avaliação técnica.',
          '5. Avaliação bancária: um engenheiro/arquiteto credenciado pelo banco visita o imóvel. Esse é um momento crítico — se a avaliação vier abaixo do preço de venda, o banco financia em cima do valor menor e você precisa cobrir a diferença em dinheiro. Tenha um plano B: ou comprovar o valor com 3 imóveis comparáveis vendidos no bairro nos últimos 6 meses, ou renegociar com o vendedor.',
          '6. Assine o contrato de financiamento: geralmente feito no próprio banco ou cartório conveniado. A Caixa opera em cartórios credenciados em Osasco (1º e 2º Cartórios de Registro de Imóveis). Leve todos os originais e cópias autenticadas pedidos previamente.',
          '7. Registre o contrato no Cartório de Registro de Imóveis: prazo de 30 dias após a assinatura. O imóvel fica em alienação fiduciária ao banco até a quitação do financiamento, o que significa que se você parar de pagar por 3-4 meses, o banco retoma o bem em processo bem mais rápido que o antigo regime de hipoteca.',
          'O ciclo completo, com documentação organizada, leva de 60 a 90 dias na Caixa e de 30 a 60 dias nos bancos privados (Itaú, Santander) para imóveis usados; novos direto da construtora podem ser mais rápidos quando o banco já tem convênio com o empreendimento.',
        ],
        links: [
          { href: '/blog/documentos-para-financiar-imovel-2026', label: 'Checklist de documentos para aprovação do financiamento', description: 'Lista completa separada por banco: Caixa, Itaú, Bradesco e Santander', type: 'blog' },
          { href: '/ajuda/cartorios-de-imoveis-em-osasco', label: 'Cartórios de imóveis em Osasco', description: 'Endereços e áreas de abrangência para registro do contrato', type: 'ajuda' },
        ],
      },
      {
        heading: 'CET (Custo Efetivo Total): por que olhar isso, não só a taxa de juros',
        paragraphs: [
          'A taxa nominal de juros é só uma parte do que você vai pagar de fato. O CET — Custo Efetivo Total — inclui todos os encargos do financiamento: juros nominais, seguro habitacional obrigatório (MIP — Morte e Invalidez Permanente, e DFI — Danos Físicos ao Imóvel), tarifa de administração mensal, IOF e custos de avaliação. Por lei (Resolução CMN 3.517/2007), todo banco é obrigado a apresentar o CET na simulação.',
          'A diferença pode ser brutal. Uma taxa nominal de 9,9% a.a. na Caixa pode resultar num CET de 11,2% a 12,5% a.a. dependendo da idade do tomador (que afeta o MIP) e do estado de conservação do imóvel (que afeta o DFI). Em bancos privados, a diferença entre nominal e CET costuma ser maior porque a tarifa de administração mensal é mais alta.',
          'Como comparar bancos honestamente em Osasco: peça a planilha completa com CET para o MESMO valor de imóvel, MESMO prazo e MESMO sistema de amortização (SAC ou PRICE) em cada banco. Anote: parcela inicial, parcela final, total de juros pago, total de seguros pago, CET. O banco com menor CET ganha — mesmo que tenha taxa nominal maior.',
          'Atenção a um truque comum: alguns bancos oferecem taxa nominal artificialmente baixa em troca de cesta de produtos (conta corrente paga, seguros, previdência, cartão). Calcule o custo dessa cesta mensal e some à parcela do financiamento para ter o custo real.',
        ],
        links: [
          { href: '/simulador', label: 'Simulador com CET estimado por banco', description: 'Compare propostas considerando o custo total, não só a taxa nominal', type: 'tool' },
        ],
      },
      {
        heading: 'Sistema SAC: como funcionam as parcelas',
        paragraphs: [
          'O sistema de amortização padrão nos financiamentos brasileiros é o SAC (Sistema de Amortização Constante). As parcelas começam maiores e vão caindo todo mês, porque a amortização do principal é constante enquanto os juros incidem sobre o saldo devedor — que diminui a cada pagamento. Para um financiamento de R$ 240.000 em 360 meses a 9,9% a.a., a primeira parcela fica em torno de R$ 2.650 e a última em torno de R$ 670.',
          'No PRICE (parcelas fixas), as parcelas são iguais do início ao fim, mas o saldo devedor cai mais lentamente — você paga mais juros no total. Para o mesmo financiamento de R$ 240.000 a 9,9% a.a. em 360 meses no PRICE, a parcela seria fixa em torno de R$ 2.090, mas o total de juros pago no contrato é cerca de 30% maior que no SAC.',
          'A maioria dos programas habitacionais usa o SAC porque protege o tomador de crédito a longo prazo: à medida que sua renda costuma crescer (inflação, promoções, evolução de carreira), a parcela cai. No PRICE, a parcela continua igual mesmo 20 anos depois.',
          'Quando o PRICE faz sentido: quando você tem renda fixa pouco volátil, prefere previsibilidade total e não pretende quitar antecipadamente. Para aposentados ou servidores públicos, o PRICE pode ser uma escolha racional.',
          'Use o simulador para comparar o custo total entre os dois sistemas com o seu perfil de renda, prazo e capacidade de quitação antecipada.',
        ],
        links: [
          { href: '/simulador', label: 'Comparar SAC e PRICE no simulador', description: 'Veja parcelas, total de juros e saldo devedor mês a mês', type: 'tool' },
        ],
      },
      {
        heading: 'Caso prático: comprar em Osasco com renda de R$ 6.000/mês',
        paragraphs: [
          'Para tornar concreto, vejamos uma situação real comum em Osasco: casal com renda total de R$ 6.000/mês (cônjuge 1: R$ 4.000 CLT, cônjuge 2: R$ 2.000 autônomo), R$ 35.000 em poupança, R$ 25.000 de FGTS combinado, sem outras dívidas, querendo comprar um apartamento de 2 quartos em Cidade de Deus por R$ 280.000.',
          'Enquadramento MCMV: renda dentro da Faixa 3 (R$ 5.000-9.600), imóvel dentro do teto (R$ 400 mil). Taxa aplicável: 7,66% a.a. Prazo: 360 meses (30 anos).',
          'Composição da entrada: R$ 35.000 dinheiro + R$ 25.000 FGTS = R$ 60.000 = 21,4% do valor. Acima do mínimo exigido (20%). Valor financiado: R$ 220.000.',
          'Parcela inicial SAC: aproximadamente R$ 2.020. Capacidade de pagamento usada: 33,7% da renda — um pouco acima do limite de 30% que a Caixa costuma aceitar. Solução: aumentar prazo para 420 meses (35 anos) baixa a primeira parcela para cerca de R$ 1.895 = 31,6% da renda. Ainda apertado. Solução alternativa: comprar imóvel um pouco mais barato (R$ 250.000), o que reduz parcela inicial para R$ 1.700 = 28,3% da renda e fica dentro do limite com folga.',
          'Custos no ato: entrada R$ 60.000 + ITBI 3% (R$ 8.400) + escritura/registro (~R$ 6.500) + avaliação Caixa (R$ 3.000) = R$ 77.900. Como o casal tem R$ 35.000 em poupança e R$ 25.000 de FGTS (que vai para a entrada), faltam R$ 17.900 para cobrir os custos paralelos — esse é o dinheiro extra que precisa estar separado antes de assinar.',
          'Lição prática: ter "entrada" não é suficiente. Reserve sempre 5% a 7% do valor do imóvel a mais para os custos paralelos. No exemplo acima, comprar um imóvel R$ 30.000 mais barato resolveria o aperto de capacidade de pagamento E daria folga nos custos paralelos.',
        ],
        links: [
          { href: '/simulador', label: 'Refazer essa simulação com seus números', description: 'Ajuste valor do imóvel, entrada, FGTS e renda para ver o seu caso', type: 'tool' },
          { href: '/bairros/cidade-de-deus', label: 'Guia do bairro Cidade de Deus em Osasco', description: 'Preço médio por m², infraestrutura e perfil dos imóveis MCMV', type: 'bairro' },
        ],
      },
      {
        heading: 'Erros mais comuns no financiamento — e como evitar',
        paragraphs: [
          'Erro 1 — escolher pelo menor valor de parcela inicial ignorando o CET: o banco com menor parcela quase sempre é o que tem maior CET por causa de seguros e tarifas embutidas. Sempre compare o custo total do contrato e não a parcela mensal isolada.',
          'Erro 2 — esquecer dos custos paralelos: muita gente junta a entrada e descobre na hora da assinatura que ainda precisa de mais 7-10% para ITBI, cartório e avaliação. Resultado: financiamento atrasa ou o negócio cai.',
          'Erro 3 — não pesquisar a portabilidade: depois de 12 meses pagando, você pode pedir portabilidade do financiamento para outro banco com taxa menor. Em 2025, a queda da Selic abriu janela para portabilidades que economizam R$ 30 a R$ 80 mil em contratos longos. O banco atual é obrigado por lei a fazer contra-proposta, e quase sempre faz.',
          'Erro 4 — financiar sem reserva de emergência: parcela mensal apertada + zero de reserva é receita para perder o imóvel se algo der errado (desemprego, doença, separação). Mantenha pelo menos 6 meses de parcelas em reserva líquida antes de fechar.',
          'Erro 5 — ignorar a avaliação bancária na negociação: o vendedor pediu R$ 320.000, você fechou em R$ 300.000, mas o banco avaliou em R$ 280.000. Financia 80% de R$ 280.000 = R$ 224.000. Você ia colocar R$ 60.000 de entrada, mas agora precisa de R$ 76.000. Sempre tenha cláusula de "condicionado à aprovação do financiamento pelo valor de compra" no contrato de promessa de compra e venda.',
          'Erro 6 — não comparar SAC vs PRICE: muita gente assina PRICE achando que a parcela "estável" é melhor, sem perceber que pagará 25-35% a mais no total. O SAC é quase sempre mais vantajoso para quem pretende quitar antecipadamente ou amortizar com FGTS.',
        ],
        links: [
          { href: '/blog/quanto-custa-contratar-corretor-imoveis-2026', label: 'Por que vale ter assessoria de corretor na compra', description: 'O corretor pode evitar todos os 6 erros acima', type: 'blog' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Qual banco tem as melhores taxas de financiamento em Osasco?',
        answer: 'Para imóveis dentro do teto do MCMV (até R$ 400.000 nas Faixas 1-3, até R$ 600.000 na Faixa 4), a Caixa Econômica Federal tem as melhores taxas: de 4% a.a. (Faixa 1) até 9,9% a.a. (SBPE com relacionamento). Para imóveis acima desses tetos, vale cotar nos bancos privados — Itaú, Bradesco e Santander costumam oferecer taxas competitivas para clientes com bom relacionamento (conta salário, seguros). Em 2026 o Inter também entrou nessa disputa com taxas a partir de 10,49% a.a. para correntistas. Minha recomendação prática: simule em pelo menos 3 bancos e compare CET, não só a taxa nominal.',
      },
      {
        question: 'O FGTS pode ser usado para dar entrada em Osasco?',
        answer: 'Sim, desde que o imóvel seja residencial urbano, o comprador não tenha outro imóvel registrado na cidade onde mora ou trabalha, e a renda esteja dentro dos limites do SFH (financiamento de até R$ 1,5 milhão). Requisitos adicionais: ter pelo menos 3 anos de contribuição ao FGTS (consecutivos ou não), não ter usado FGTS para comprar outro imóvel nos últimos 3 anos, e estar com a CTPS regular. O FGTS pode ser usado também para amortizar saldo devedor (a cada 2 anos), pagar parcelas em períodos de aperto e quitar o financiamento integralmente.',
      },
      {
        question: 'Quanto tempo leva a aprovação do financiamento na Caixa?',
        answer: 'Com documentação completa, a aprovação na Caixa leva entre 30 e 45 dias úteis para imóveis novos (direto da construtora) e 20 a 30 dias úteis para imóveis usados. O processo inclui análise de crédito (5-10 dias), vistoria e avaliação do imóvel (5-15 dias) e emissão e assinatura do contrato (5-10 dias). Em períodos de pico (geralmente março a junho, quando o orçamento federal do MCMV está sendo executado) o prazo pode dobrar. Bancos privados como Itaú e Santander costumam ser mais rápidos: 20 a 30 dias para correntistas.',
      },
      {
        question: 'Posso financiar um imóvel em Osasco morando em outra cidade?',
        answer: 'Sim. O financiamento imobiliário não exige que o comprador more na mesma cidade do imóvel. A restrição do MCMV é diferente: você não pode ter outro imóvel financiado pelo SFH em qualquer cidade do Brasil, e não pode ter comprado imóvel com recursos do FGTS nos últimos 3 anos. Para usar FGTS na entrada, o requisito é não ter outro imóvel na cidade onde mora ou trabalha — então quem mora em São Paulo capital pode usar FGTS para comprar em Osasco sem problema.',
      },
      {
        question: 'O que é CET e por que ele é tão importante?',
        answer: 'CET (Custo Efetivo Total) é a taxa que inclui todos os encargos do financiamento, não só os juros: seguro habitacional obrigatório (MIP+DFI), tarifa de administração mensal, IOF, custos de avaliação. Por lei, todo banco é obrigado a apresentar o CET na simulação (Resolução CMN 3.517/2007). Uma taxa nominal de 9,9% a.a. pode resultar num CET de 11,2% a 12,5% a.a. dependendo da idade do tomador e do estado do imóvel. Sempre compare bancos pelo CET, nunca pela taxa nominal — é o único jeito honesto de saber quem é o mais barato de verdade.',
      },
      {
        question: 'Vale a pena fazer portabilidade do financiamento?',
        answer: 'Sim, especialmente se você assinou seu financiamento antes de 2024 e a Selic caiu desde então. A portabilidade permite transferir o saldo devedor para outro banco com taxa menor, mantendo o mesmo prazo. Por lei, o banco atual é obrigado a fazer contra-proposta — e quase sempre baixa a taxa para não perder o cliente. Em 2026, com a Selic em queda gradual, muitos contratos da Caixa fechados em 2023 a 11,49% a.a. podem ser renegociados para 9,9% a.a., economizando R$ 30 a R$ 80 mil em um contrato de 30 anos. Exige pelo menos 12 meses de pagamento no banco original e o imóvel já estar registrado.',
      },
      {
        question: 'Qual a diferença entre SAC e PRICE para financiamento em Osasco?',
        answer: 'SAC (Sistema de Amortização Constante) tem parcelas decrescentes — a primeira é a maior, a última é a menor. Você amortiza o mesmo valor de principal todo mês, e os juros (que incidem sobre o saldo devedor) caem progressivamente. PRICE tem parcelas iguais do início ao fim, mas amortiza pouco no começo e muito no final, resultando em mais juros pagos no total. Para um financiamento de R$ 240.000 a 9,9% a.a. em 360 meses: SAC paga ~R$ 240.000 a R$ 280.000 de juros totais; PRICE paga ~R$ 310.000 a R$ 360.000. A maioria dos programas habitacionais usa SAC. PRICE só faz sentido para quem prioriza previsibilidade total e não pretende amortizar.',
      },
      {
        question: 'Posso financiar imóvel de leilão em Osasco?',
        answer: 'Imóveis de leilão judicial geralmente NÃO podem ser financiados — exigem pagamento à vista, em prazo de 24 a 48 horas após a arrematação. Já os leilões extrajudiciais (geralmente da própria Caixa, decorrentes de inadimplência em financiamentos anteriores) podem ser financiados pela própria Caixa em até 80% do valor da arrematação, com taxas de mercado. É uma das formas de comprar abaixo do valor de mercado em Osasco, mas exige due diligence extra: verificar débitos de IPTU, condomínio, e estado real do imóvel (que geralmente não pode ser visitado antes do leilão).',
      },
    ],
    ctaLabel: 'Simular meu financiamento',
    ctaHref: '/simulador',
    publishedAt: '2026-05-01',
    updatedAt: '2026-05-20',
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
    publishedAt: '2026-05-01',
    updatedAt: '2026-05-15',
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
    publishedAt: '2026-05-01',
    updatedAt: '2026-05-15',
  },

  'comprar-apartamento-na-planta-osasco': {
    slug: 'comprar-apartamento-na-planta-osasco',
    titulo: 'Vale a Pena Comprar Apartamento na Planta em Osasco? Guia 2026',
    subtitulo: 'Vantagens, riscos, como funciona o pagamento e o financiamento, e o checklist antes de assinar',
    descricaoMeta:
      'Comprar apartamento na planta em Osasco em 2026 vale a pena? Veja vantagens (preço de lançamento, valorização na obra, entrada parcelada, MCMV), os riscos e como se proteger pela Lei do Distrato, como funciona o financiamento na entrega e o checklist antes de assinar o contrato.',
    intro:
      'A maior parte dos lançamentos em Osasco hoje é vendida na planta ou em construção — e essa é justamente a dúvida que mais recebo de quem está comprando o primeiro imóvel: "vale a pena comprar na planta ou é melhor esperar ficar pronto?". A resposta honesta é: depende do seu perfil, do seu prazo e, principalmente, de quem é a construtora. Comprar na planta pode significar pagar 15% a 30% menos do que o mesmo apartamento custará pronto, com a entrada parcelada em dezenas de meses sem juros — mas também envolve esperar a obra, conviver com o risco de atraso e fazer o financiamento só na entrega das chaves. Este guia explica, sem romantizar nem assustar, como funciona a compra na planta em Osasco em 2026: as vantagens reais, os riscos e como a lei te protege, como é o pagamento durante a obra e o financiamento na entrega, o que muda no Minha Casa Minha Vida, e o checklist que eu uso com meus clientes antes de assinar qualquer contrato.',
    sections: [
      {
        heading: 'Planta, em construção e pronto: o que muda',
        paragraphs: [
          'Os três estágios não são a mesma coisa, e o preço reflete isso. "Na planta" é a fase de lançamento: a obra ainda não começou ou está no início, você compra olhando o memorial descritivo, o apartamento decorado e a maquete. "Em construção" é a obra em andamento — você já consegue visitar o canteiro e ver a evolução, e o preço normalmente já subiu em relação ao lançamento. "Pronto para morar" é a unidade com Habite-se emitido, pronta para escriturar e financiar imediatamente.',
          'A lógica de preço é simples: quanto mais cedo você entra, menor o preço e maior o desconto em relação ao valor final — porque você está, na prática, financiando parte da obra e assumindo parte do risco junto com a construtora. Quem compra no lançamento costuma pagar bem menos do que quem compra a mesma unidade já pronta, dois ou três anos depois.',
          'Em Osasco, a maioria dos empreendimentos que acompanho está nas fases de planta e construção, concentrados em bairros como Centro, Jaguaribe, Rochdale, Presidente Altino e Bela Vista. É por isso que entender bem essa modalidade é decisivo para comprar bem na cidade hoje.',
        ],
        links: [
          { href: '/empreendimentos/em-construcao', label: 'Lançamentos em construção em Osasco', description: 'Empreendimentos com obra em andamento, plantas e valores', type: 'listing' },
          { href: '/empreendimentos/pronto-para-morar', label: 'Prontos para morar', description: 'Unidades com Habite-se, prontas para escriturar e financiar', type: 'listing' },
        ],
      },
      {
        heading: 'As vantagens reais de comprar na planta',
        paragraphs: [
          'Preço de lançamento: é o menor preço que aquele apartamento terá. A cada fase da obra (e a cada nova tabela da construtora) o valor sobe. Quem entra no lançamento tende a comprar abaixo do que o imóvel valerá pronto.',
          'Entrada parcelada e diluída: talvez a maior vantagem para quem não tem o valor à vista. Em vez de juntar 20% de entrada de uma vez, você dilui esse valor ao longo da obra — em parcelas mensais, reforços (semestrais/anuais) e uma parcela das chaves. Isso torna a compra viável para muita gente que não conseguiria entrar num imóvel pronto.',
          'Valorização durante a obra: como você comprou no preço de lançamento, a valorização natural ao longo da construção fica para você. Não é garantida, mas em bairros em desenvolvimento de Osasco é um padrão recorrente.',
          'Personalização e unidade nova: você costuma poder escolher entre opções de acabamento e plantas, recebe um imóvel zero, com garantia da construtora e padrões construtivos atuais (isolamento, infraestrutura para ar-condicionado, áreas de lazer completas).',
          'Compatibilidade com o Minha Casa Minha Vida: muitos lançamentos em Osasco são desenhados para caber nos tetos do MCMV, o que combina o preço de lançamento com juros subsidiados e subsídio do programa — uma das formas mais baratas de comprar o primeiro imóvel.',
        ],
        links: [
          { href: '/simulador', label: 'Simular financiamento e MCMV', description: 'Veja parcela estimada, elegibilidade ao MCMV e subsídio para cada faixa', type: 'tool' },
          { href: '/guia/financiamento-imobiliario-osasco', label: 'Guia de financiamento imobiliário', description: 'Programas, taxas e passo a passo do financiamento em Osasco', type: 'ajuda' },
        ],
      },
      {
        heading: 'Os riscos — e como a lei te protege',
        paragraphs: [
          'Atraso na entrega: é o risco mais comum. Por lei, o contrato pode prever um prazo de tolerância de até 180 dias além da data prevista, sem que isso configure descumprimento. Passado esse prazo de carência, o comprador pode pedir rescisão com devolução integral dos valores pagos, ou manter o contrato e exigir multa pelo atraso. Sempre confira a cláusula de tolerância e a penalidade por atraso antes de assinar.',
          'Desistência (distrato): se você precisar desistir da compra, a Lei do Distrato (Lei 13.786/2018) define quanto a construtora pode reter. Em empreendimentos com patrimônio de afetação, a retenção pode chegar a 50% do valor pago; nos demais, até 25%. Não é o cenário ideal, mas a lei trouxe previsibilidade — você sabe exatamente a regra antes de assinar.',
          'Saúde da construtora: este é o ponto que mais importa. Atraso e abandono de obra quase sempre vêm de construtora descapitalizada. Antes de comprar, verifique o histórico de entregas da incorporadora, se as obras anteriores foram entregues no prazo, e se o empreendimento tem registro de incorporação averbado na matrícula (exigência do art. 32 da Lei 4.591/64) — sem esse registro, a construtora nem pode vender unidades legalmente.',
          'Risco de financiamento na entrega: você só vai financiar o saldo quando as chaves saírem. Se sua renda ou seu perfil de crédito piorarem durante a obra, pode ter dificuldade de aprovar o financiamento no fim. Por isso é prudente manter o nome limpo e a renda comprovável estável durante todo o período da obra.',
        ],
      },
      {
        heading: 'Como funciona o pagamento e o financiamento na planta',
        paragraphs: [
          'Durante a obra, você paga diretamente à construtora, não ao banco. O fluxo típico tem quatro componentes: a entrada (ato), as parcelas mensais, os reforços (parcelas maiores semestrais ou anuais) e a parcela das chaves, paga na entrega. Esse conjunto costuma somar algo em torno de 20% a 30% do valor do imóvel — é a parte que você quita ao longo da construção.',
          'O saldo restante (os 70% a 80%) é o que você financia no banco quando o imóvel fica pronto e é individualizado. É nesse momento que entra a Caixa (SBPE ou MCMV), o uso do FGTS para abater o saldo ou compor a entrada, e a definição da taxa e do prazo do financiamento.',
          'Atenção a um detalhe que pega muita gente: as parcelas pagas à construtora durante a obra costumam ser corrigidas mensalmente pelo INCC (índice da construção civil) até a entrega das chaves, e pelo IPCA depois. Some essa correção ao planejar o orçamento — ela é normal e prevista em contrato, mas precisa entrar na conta.',
          'Use o simulador do site para estimar a parcela do financiamento na entrega e verificar a elegibilidade ao MCMV antes mesmo de escolher a unidade. Saber a parcela final é o que evita comprar algo que não vai fechar lá na frente.',
        ],
        links: [
          { href: '/simulador', label: 'Simular a parcela na entrega', description: 'Calcule a parcela do financiamento, ITBI e custos de cartório', type: 'tool' },
          { href: '/guia/custos-compra-imovel', label: 'Custos de compra além do preço', description: 'ITBI 3%, cartório e tarifas — quanto separar além do valor do imóvel', type: 'ajuda' },
        ],
      },
      {
        heading: 'Minha Casa Minha Vida na planta em Osasco',
        paragraphs: [
          'Boa parte dos lançamentos de Osasco é desenhada para caber no MCMV — e comprar na planta dentro do programa combina dois benefícios: o preço de lançamento e os juros subsidiados. Em 2026, o programa atende renda familiar de até R$ 13.000/mês, com tetos de imóvel de R$ 400 mil na Faixa 3 e R$ 600 mil na Faixa 4.',
          'Na planta, o enquadramento no MCMV é avaliado no momento do financiamento (na entrega), considerando sua renda e o valor do imóvel naquele momento. Por isso vale confirmar, ainda no lançamento, se a unidade e o seu perfil tendem a se enquadrar — e usar o FGTS, que pode compor a entrada ou abater o saldo financiado.',
          'Como as faixas e os tetos mudam ano a ano, trate qualquer simulação como estimativa e confirme as condições vigentes na contratação. O simulador do site usa as faixas de 2026; eu confirmo caso a caso com a Caixa antes de qualquer assinatura.',
        ],
        links: [
          { href: '/guia/comprar-imovel-osasco', label: 'Guia completo de compra em Osasco', description: 'Passo a passo, documentação, negociação e os erros mais comuns', type: 'ajuda' },
        ],
      },
      {
        heading: 'Checklist antes de assinar o contrato',
        paragraphs: [
          'Confirme o registro de incorporação averbado na matrícula do terreno (art. 32 da Lei 4.591/64) — é o que autoriza a venda das unidades e protege o comprador. Peça o memorial descritivo e confira o padrão de acabamento prometido, item por item. Verifique a cláusula de prazo de entrega e a tolerância de 180 dias, além da multa por atraso.',
          'Levante o histórico da construtora: empreendimentos anteriores entregues, prazos cumpridos, reclamações. Leia a tabela de pagamento inteira, incluindo reforços, parcela das chaves e a correção pelo INCC durante a obra. Confira as regras de distrato no contrato (percentual de retenção e se há patrimônio de afetação).',
          'Por fim, simule a parcela do financiamento na entrega e confirme a folga no seu orçamento — a parcela não deve passar de 30% da renda familiar. Esse é o erro que mais vejo: gente que fecha animada com a entrada diluída e esquece de checar se a parcela final, lá na entrega, cabe no bolso.',
          'Comprar na planta com a construtora certa e o contrato bem lido é uma das formas mais inteligentes de comprar em Osasco hoje. Comprar sem verificar esses pontos é onde mora o risco. Se quiser, eu reviso o contrato e a construtora com você antes de assinar — é parte do meu atendimento, sem custo.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Comprar na planta é mais barato do que comprar pronto?',
        answer: 'Em geral sim. O preço de lançamento é o menor que aquele apartamento terá, e sobe a cada fase da obra. A contrapartida é esperar a entrega e assumir parte do risco da construção. Quem compra no lançamento normalmente paga menos do que quem compra a mesma unidade pronta.',
      },
      {
        question: 'Como pago um imóvel na planta antes da entrega?',
        answer: 'Durante a obra você paga diretamente à construtora: entrada (ato), parcelas mensais, reforços semestrais ou anuais e a parcela das chaves — somando algo em torno de 20% a 30% do valor. O saldo restante você financia no banco quando o imóvel fica pronto. As parcelas da obra são corrigidas pelo INCC até a entrega.',
      },
      {
        question: 'O que acontece se a obra atrasar?',
        answer: 'O contrato pode prever uma tolerância de até 180 dias além da data prevista. Passado esse prazo, você pode pedir a rescisão com devolução integral dos valores pagos ou manter o contrato e exigir multa pelo atraso, conforme a Lei do Distrato (13.786/2018).',
      },
      {
        question: 'Posso usar FGTS e Minha Casa Minha Vida para comprar na planta?',
        answer: 'Sim. O FGTS pode compor a entrada ou abater o saldo financiado, e muitos lançamentos em Osasco são desenhados para caber no MCMV. O enquadramento é avaliado no financiamento, na entrega das chaves, considerando sua renda e o valor do imóvel. Use o simulador para estimar a elegibilidade.',
      },
      {
        question: 'Como sei se a construtora é confiável?',
        answer: 'Verifique o histórico de entregas (obras anteriores entregues no prazo), reclamações de clientes, e confirme se o empreendimento tem o registro de incorporação averbado na matrícula. Sem esse registro, a venda de unidades nem é permitida por lei.',
      },
    ],
    ctaLabel: 'Ver lançamentos e plantas em Osasco',
    ctaHref: '/empreendimentos/em-construcao',
    publishedAt: '2026-06-02',
    updatedAt: '2026-06-02',
  },
}

export function getGuiaBySlug(slug: string): GuiaData | undefined {
  return GUIAS[slug]
}

export const GUIA_SLUGS = Object.keys(GUIAS)
