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
          'A maioria das compras em Osasco é financiada. As principais opções em 2026 são o Minha Casa Minha Vida (Faixas 1-3 para imóveis até R$ 400.000 com renda familiar até R$ 9.600 e Faixa 4 para imóveis até R$ 600.000 com renda até R$ 13.000) e o SBPE (mercado livre, para imóveis acima desses tetos ou compradores acima do teto de renda do MCMV).',
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
    publishedAt: '2026-05-01',
    updatedAt: '2026-05-15',
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
}

export function getGuiaBySlug(slug: string): GuiaData | undefined {
  return GUIAS[slug]
}

export const GUIA_SLUGS = Object.keys(GUIAS)
