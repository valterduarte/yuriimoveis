export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; text: string; link?: { href: string; label: string } }
  | { type: 'disclaimer'; text: string }

export interface Cartorio {
  nome: string
  tipo: 'registro-imoveis' | 'tabeliao-notas' | 'registro-civil'
  endereco: string
  bairro?: string
  cidade: string
  uf: string
  telefone: string
}

interface AjudaFAQ {
  pergunta: string
  resposta: string
}

export interface AjudaArtigo {
  slug: string
  titulo: string
  h1: string
  h1Destaque: string
  descricaoMeta: string
  resumo: string
  atualizadoEm: string
  blocks: ArticleBlock[]
  cartorios?: Cartorio[]
  faq?: AjudaFAQ[]
}

export function fullH1(artigo: AjudaArtigo): string {
  return `${artigo.h1} ${artigo.h1Destaque}`
}

export const AJUDA_ARTIGOS: AjudaArtigo[] = [
  {
    slug: 'documentos-para-comprar-imovel',
    titulo: 'Documentos para Comprar Imóvel em Osasco — Lista Completa',
    h1: 'Documentos para',
    h1Destaque: 'Comprar um Imóvel',
    descricaoMeta:
      'Lista completa dos documentos exigidos para comprar um imóvel em Osasco e região: comprador, vendedor, imóvel urbano e rural. Atualizado para 2026.',
    resumo:
      'Saiba exatamente quais documentos comprador, vendedor e imóvel precisam apresentar para fechar a compra com segurança jurídica em Osasco e Grande SP.',
    atualizadoEm: '2026-04-13',
    blocks: [
      {
        type: 'p',
        text: 'Comprar um imóvel envolve apresentar uma série de documentos do comprador, do vendedor e do próprio bem. A lista abaixo é o checklist que utilizo com meus clientes em Osasco e região da Grande São Paulo. Tê-la em mãos antes da assinatura agiliza o processo no cartório e evita surpresas no dia da escritura.',
      },

      { type: 'h2', text: 'Documentos do comprador (pessoa física)' },
      {
        type: 'ul',
        items: [
          'RG e CPF originais (ou cópias autenticadas)',
          'Comprovante de residência atualizado (últimos 90 dias)',
          'Certidão de nascimento (se solteiro) ou de casamento (se casado, com averbações)',
          'Pacto antenupcial registrado, quando houver',
          'Comprovante de profissão e renda (3 últimos contracheques ou IRPF do último exercício)',
          'Extratos bancários e comprovação de origem dos recursos',
        ],
      },

      { type: 'h2', text: 'Documentos do comprador (pessoa jurídica)' },
      {
        type: 'ul',
        items: [
          'Contrato social ou estatuto consolidado, com últimas alterações',
          'CNPJ atualizado',
          'Ata de eleição da diretoria, quando aplicável',
          'Certidão simplificada da Junta Comercial (validade máxima de 30 dias)',
          'RG e CPF dos sócios administradores',
          'Certidão Negativa de Débitos do INSS, FGTS e Receita Federal',
        ],
      },

      { type: 'h2', text: 'Documentos do vendedor' },
      {
        type: 'p',
        text: 'O vendedor é quem precisa comprovar que está apto a transferir o imóvel sem qualquer ônus ou pendência judicial. Se algum item estiver irregular, a escritura não é lavrada.',
      },
      {
        type: 'ul',
        items: [
          'RG, CPF e certidão de estado civil',
          'Pacto antenupcial registrado, quando houver',
          'Certidões dos distribuidores cíveis, da Justiça Federal e do Trabalho (Osasco e domicílios anteriores dos últimos 10 anos)',
          'Certidão Negativa de Protestos dos últimos 5 anos',
          'Certidão Negativa de Débitos junto à Receita Federal',
          'Para pessoa jurídica: Certidão Negativa do INSS e da Receita',
        ],
      },

      { type: 'h2', text: 'Documentos do imóvel (urbano)' },
      {
        type: 'ul',
        items: [
          'Matrícula atualizada do Cartório de Registro de Imóveis (validade máxima de 30 dias)',
          'Certidão Negativa de Ônus e Alienações',
          'Carnê do IPTU do exercício corrente ou Certidão de Valor Venal emitida pela Prefeitura de Osasco',
          'Certidão Negativa de Débitos Municipais (tributos imobiliários)',
          'Declaração de quitação de condomínio assinada pelo síndico, quando aplicável',
          'Habite-se, em casos de imóveis novos ou reformados',
          'Última conta de água, luz e gás quitadas',
        ],
      },

      { type: 'h2', text: 'Documentos do imóvel (rural)' },
      {
        type: 'ul',
        items: [
          'CCIR — Certificado de Cadastro de Imóvel Rural',
          'ITRs pagos dos últimos 5 anos',
          'CAR — Cadastro Ambiental Rural',
          'Georreferenciamento, quando exigido pelo INCRA',
        ],
      },

      { type: 'h2', text: 'Quando há procuração' },
      {
        type: 'p',
        text: 'Se uma das partes for representada por procurador, a procuração precisa ser pública (lavrada em tabelião) e específica para a venda do imóvel. Procurações com mais de 90 dias costumam exigir certidão de não revogação.',
      },

      {
        type: 'callout',
        text: 'Vai financiar pelo banco? A lista muda um pouco: veja o checklist específico para aprovação de financiamento imobiliário na Caixa e nos demais bancos.',
        link: {
          href: '/blog/documentos-para-financiar-imovel-2026',
          label: 'Documentos para financiar imóvel em 2026 →',
        },
      },
      {
        type: 'callout',
        text: 'Cada negociação tem suas particularidades. Antes de iniciar a compra, faço uma análise gratuita da documentação completa para garantir segurança jurídica do começo ao fim.',
      },
    ],
    faq: [
      {
        pergunta: 'Quais documentos são obrigatórios para comprar um imóvel em Osasco?',
        resposta:
          'Comprador precisa de RG, CPF, comprovante de residência, certidão de estado civil e comprovação de renda. Vendedor apresenta certidões pessoais negativas e o imóvel exige matrícula atualizada, IPTU quitado e certidão negativa de débitos municipais.',
      },
      {
        pergunta: 'Por quanto tempo as certidões valem?',
        resposta:
          'A maioria das certidões tem validade de 30 dias a partir da emissão. A matrícula do imóvel e as certidões de ônus precisam ser obtidas próximas à data da escritura.',
      },
      {
        pergunta: 'Quem paga as certidões: comprador ou vendedor?',
        resposta:
          'Por costume em Osasco, o vendedor arca com as certidões pessoais e do imóvel, enquanto o comprador paga ITBI, escritura e registro. O contrato pode ajustar essa divisão.',
      },
    ],
  },

  {
    slug: 'custos-para-comprar-imovel-em-osasco',
    titulo: 'Quanto Custa Comprar Imóvel em Osasco em 2026? + Calculadora',
    h1: 'Custos para Comprar um Imóvel em',
    h1Destaque: 'Osasco',
    descricaoMeta:
      'Calcule ITBI (3%), escritura, registro e cartório em Osasco em 2026. Exemplo de imóvel de R$ 300 mil: total de R$ 18-20 mil. Atualizado pela LC 227/2026.',
    resumo:
      'Comprar imóvel em Osasco custa de 5% a 7% além do valor anunciado: ITBI de 3% pela LC 227/2026, escritura, registro e tarifas bancárias. Veja como planejar.',
    atualizadoEm: '2026-05-14',
    blocks: [
      {
        type: 'p',
        text: 'Além do valor do imóvel, comprar uma casa ou apartamento em Osasco envolve impostos, taxas de cartório e despesas com documentação. Com a Lei Complementar 227/2026 que ajustou o ITBI de Osasco para 3%, esses custos somam de 5% a 7%* do valor do imóvel. Conhecer cada item ajuda a planejar o orçamento e evita correr atrás de dinheiro na hora da escritura.',
      },

      {
        type: 'disclaimer',
        text: '⚠️ AVISO IMPORTANTE: Os percentuais e valores indicados nesta página são estimativas baseadas em práticas de mercado e legislação vigente, com finalidade exclusivamente informativa. Alíquotas, emolumentos e tarifas são definidos pelos órgãos competentes (Prefeitura de Osasco, Tribunal de Justiça de São Paulo e instituições financeiras) e podem ser alterados sem aviso prévio. Antes de qualquer negociação, confirme os valores diretamente nas fontes oficiais ou solicite uma simulação personalizada. O Corretor Yuri Imóveis não se responsabiliza por divergências, alterações posteriores ou eventuais prejuízos decorrentes do uso dessas informações sem a devida verificação.',
      },

      { type: 'h2', text: 'ITBI — Imposto de Transmissão de Bens Imóveis' },
      {
        type: 'p',
        text: 'O ITBI é o imposto cobrado pela Prefeitura de Osasco sempre que um imóvel muda de dono. Em Osasco, a alíquota é de 3%* sobre o maior valor entre o preço de venda e o valor venal de referência, conforme a Lei Complementar 227/2026 que substituiu a alíquota anterior de 2%. O pagamento é feito antes da lavratura da escritura — sem o ITBI quitado, o cartório não realiza a transferência.',
      },
      {
        type: 'ul',
        items: [
          'Alíquota em Osasco: 3%* sobre o valor do imóvel (LC 227/2026)',
          'Pago à Prefeitura Municipal de Osasco',
          'Obrigatório antes do registro em cartório',
          'Existem isenções parciais para imóveis no programa Minha Casa Minha Vida e primeiro imóvel financiado pelo SFH',
        ],
      },
      {
        type: 'callout',
        text: 'Quer entrar a fundo só no ITBI de Osasco — base de cálculo, exemplos, como emitir a guia e quando há isenção? Veja o guia completo do imposto.',
        link: {
          href: '/ajuda/itbi-osasco',
          label: 'Guia completo do ITBI de Osasco',
        },
      },
      {
        type: 'callout',
        text: 'Para comparar com Barueri, Carapicuíba e São Paulo, veja o panorama completo de ITBI da região metropolitana oeste.',
        link: {
          href: '/blog/itbi-osasco-barueri-carapicuiba-sao-paulo-2026',
          label: 'ITBI em Osasco, Barueri, Carapicuíba e São Paulo 2026 →',
        },
      },
      {
        type: 'callout',
        text: 'A alíquota oficial e atualizada do ITBI é definida pela Prefeitura de Osasco. Confirme o valor vigente antes de fechar a compra no portal de serviços de Finanças do município.',
        link: {
          href: 'http://sf.osasco.sp.gov.br/financas/',
          label: 'Portal de Finanças da Prefeitura de Osasco',
        },
      },

      { type: 'h2', text: 'Escritura pública' },
      {
        type: 'p',
        text: 'A escritura é lavrada em um tabelionato de notas (cartório de notas) e formaliza a transferência. O valor segue uma tabela progressiva de emolumentos definida pelo Tribunal de Justiça de São Paulo — quanto maior o valor do imóvel, maior a taxa. As faixas abaixo são estimativas aproximadas e servem apenas para planejamento; os valores oficiais são atualizados pelo TJ-SP no início de cada ano.',
      },
      {
        type: 'ul',
        items: [
          'Imóveis até R$ 200.000: aproximadamente R$ 1.500 a R$ 2.500*',
          'Imóveis de R$ 200.000 a R$ 500.000: aproximadamente R$ 2.500 a R$ 4.500*',
          'Imóveis acima de R$ 500.000: cálculo proporcional pela tabela do TJ-SP',
        ],
      },
      {
        type: 'callout',
        text: 'Os emolumentos de tabelionato em São Paulo são reajustados anualmente pela Corregedoria do TJ-SP. Antes de fechar a compra, consulte as normas extrajudiciais oficiais ou peça uma simulação direto ao cartório escolhido.',
        link: {
          href: 'https://www.tjsp.jus.br/Corregedoria/Comunicados/NormasExtrajudiciais',
          label: 'Normas extrajudiciais da Corregedoria do TJ-SP',
        },
      },
      {
        type: 'callout',
        text: 'Quando a compra é financiada (Caixa, Itaú, Bradesco, Santander), o contrato de financiamento substitui a escritura pública. Nesse caso, o comprador economiza essa taxa e paga apenas as tarifas do banco.',
      },

      { type: 'h2', text: 'Registro no Cartório de Imóveis' },
      {
        type: 'p',
        text: 'Depois da escritura, o documento precisa ser registrado no Cartório de Registro de Imóveis competente — em Osasco, o Oficial de Registro de Imóveis fica na Avenida Santo Antônio. Só após o registro o comprador é oficialmente o dono. A taxa também segue a tabela progressiva do TJ-SP e fica em torno de 1%* do valor do imóvel.',
      },

      { type: 'h2', text: 'Tarifas bancárias (financiamento)' },
      {
        type: 'p',
        text: 'Quem financia paga ainda algumas tarifas do banco: avaliação do imóvel (em média entre R$ 3.500 e R$ 4.500*), tarifa de abertura de crédito e seguros obrigatórios (MIP e DFI) embutidos nas parcelas. Na Caixa, dentro do Minha Casa Minha Vida, várias dessas tarifas são reduzidas ou subsidiadas, conforme o enquadramento do comprador.',
      },

      { type: 'h2', text: 'Resumo dos custos esperados*' },
      {
        type: 'ul',
        items: [
          'ITBI: 3% em Osasco (LC 227/2026)*',
          'Escritura ou contrato bancário: aproximadamente 0,5% a 1%*',
          'Registro de imóveis: cerca de 1%*',
          'Avaliação do imóvel (financiamento): tarifa fixa definida pelo banco',
          'Total estimado: 5% a 7% do valor do imóvel à vista*',
        ],
      },

      {
        type: 'callout',
        text: 'Faço a simulação personalizada de todos os custos antes da proposta, com base nos valores oficiais vigentes. Assim você sabe exatamente quanto vai precisar separar para fechar a compra sem surpresas.',
      },

      {
        type: 'disclaimer',
        text: '* Todos os valores e percentuais marcados com asterisco nesta página são estimativas com base em práticas de mercado e legislação em vigor na data de atualização do conteúdo. Não constituem oferta, garantia ou cotação oficial. Antes de qualquer negociação, confirme as alíquotas, emolumentos e tarifas atuais junto à Prefeitura de Osasco, ao Tribunal de Justiça de São Paulo e à instituição financeira escolhida. O Corretor Yuri Imóveis (CRECI-SP 235509) não se responsabiliza por divergências entre os valores indicados e os efetivamente cobrados pelos órgãos competentes.',
      },
    ],
    faq: [
      {
        pergunta: 'Quanto é o ITBI em Osasco?',
        resposta:
          'A alíquota do ITBI em Osasco é de 3% sobre o maior valor entre o preço de venda do imóvel e o valor venal de referência informado pela Prefeitura, conforme a Lei Complementar 227/2026 que substituiu o percentual anterior de 2%.',
      },
      {
        pergunta: 'Quanto custa a escritura em São Paulo?',
        resposta:
          'A escritura segue a tabela progressiva de emolumentos do TJ-SP. Para imóveis até R$ 500.000, fica entre R$ 1.500 e R$ 4.500, dependendo do valor exato.',
      },
      {
        pergunta: 'Quem financia precisa pagar escritura?',
        resposta:
          'Não. No financiamento bancário, o contrato firmado com o banco já tem força de escritura pública e dispensa o tabelionato de notas — só é necessário registrar o contrato no Cartório de Imóveis.',
      },
      {
        pergunta: 'Existe isenção de ITBI em Osasco?',
        resposta:
          'Há isenções parciais para imóveis enquadrados no Minha Casa Minha Vida e no Sistema Financeiro de Habitação (SFH), conforme legislação municipal. A Prefeitura de Osasco analisa cada caso na emissão da guia.',
      },
    ],
  },

  {
    slug: 'iptu-osasco',
    titulo: 'IPTU de Osasco 2026: Como Consultar, Calcular, Parcelar e Isenção',
    h1: 'IPTU de',
    h1Destaque: 'Osasco',
    descricaoMeta:
      'Guia do IPTU de Osasco em 2026: como é calculado pelo valor venal, emitir a 2ª via online, vencimentos, desconto da cota única, parcelamento em até 10x e regras de isenção.',
    resumo:
      'Entenda como o IPTU de Osasco é calculado pelo valor venal, como emitir a 2ª via, pagar com desconto, parcelar em até 10x e quem tem direito à isenção — e por que isso importa na compra do imóvel.',
    atualizadoEm: '2026-05-31',
    blocks: [
      {
        type: 'p',
        text: 'O IPTU (Imposto Predial e Territorial Urbano) é uma conta anual que todo proprietário de imóvel em Osasco paga à Prefeitura. Parece simples, mas é um item que vejo gerar dúvida e dor de cabeça nas duas pontas: quem já é dono precisa saber consultar, parcelar e checar se tem direito a isenção; e quem está comprando precisa confirmar que o imóvel está com o IPTU em dia — porque dívida de IPTU "gruda" no imóvel e passa para o novo dono. Reuni aqui, em linguagem direta, tudo o que oriento meus clientes em Osasco sobre esse imposto.',
      },

      {
        type: 'disclaimer',
        text: '⚠️ AVISO IMPORTANTE: As regras, prazos e percentuais citados nesta página têm finalidade exclusivamente informativa e se baseiam na legislação municipal e nas práticas da Prefeitura de Osasco vigentes na data de atualização. Alíquotas, valor venal, datas de vencimento, descontos e critérios de isenção são definidos pela Secretaria de Finanças de Osasco e podem mudar a cada exercício. Antes de pagar ou planejar qualquer operação, confirme os valores e prazos diretamente no portal oficial da Secretaria de Finanças de Osasco.',
      },

      { type: 'h2', text: 'O que é o IPTU e como ele é calculado em Osasco' },
      {
        type: 'p',
        text: 'O IPTU é o imposto municipal cobrado anualmente sobre a propriedade de imóveis urbanos — construídos (predial) ou apenas o terreno (territorial). Em Osasco, o cálculo parte do valor venal do imóvel (a avaliação que a Prefeitura faz do bem para fins fiscais) multiplicado por uma alíquota definida no Código Tributário do Município, que varia conforme o uso: imóvel residencial, não-residencial (comercial) ou terreno sem construção têm percentuais diferentes.',
      },
      {
        type: 'p',
        text: 'Uma boa notícia para 2026: a Câmara Municipal de Osasco aprovou, pela Lei Complementar 17/2025 (sancionada em dezembro de 2025), o congelamento da base do valor venal dos imóveis para fins de IPTU e da taxa de lixo nos exercícios de 2026 a 2028. Na prática, isso significa que a base de cálculo não sofre o reajuste de reavaliação imobiliária nesse período — o valor é apenas atualizado monetariamente pela UFMO (Unidade Fiscal do Município de Osasco), índice que corrige os tributos municipais pela inflação acumulada.',
      },
      {
        type: 'callout',
        text: 'O valor venal que serve de base para o seu IPTU é o mesmo ponto de partida usado para calcular o ITBI na compra do imóvel. Por isso, antes de fechar negócio, vale conferir os custos completos da transação.',
        link: {
          href: '/ajuda/custos-para-comprar-imovel-em-osasco',
          label: 'Custos para comprar imóvel em Osasco',
        },
      },

      { type: 'h2', text: 'Como consultar e emitir a 2ª via do IPTU de Osasco' },
      {
        type: 'p',
        text: 'Se você não recebeu o carnê pelos Correios ou perdeu o boleto, dá para emitir a segunda via pela internet, sem ir até a Prefeitura. O caminho é pelo portal da Secretaria de Finanças de Osasco:',
      },
      {
        type: 'ol',
        items: [
          'Acesse o portal da Secretaria de Finanças de Osasco (sf.osasco.sp.gov.br)',
          'No menu superior, clique em "Serviços Online"',
          'Selecione a opção de IPTU / ITBI e depois "Emitir 2ª via do IPTU"',
          'Informe o CDC (Código de Cadastro do Contribuinte, que aparece no carnê) e o código da imagem de segurança',
          'O sistema gera o boleto (DAM) para impressão ou pagamento digital',
        ],
      },
      {
        type: 'p',
        text: 'Guarde o CDC do seu imóvel — é o número que identifica o cadastro na Prefeitura e abre praticamente todos os serviços online de IPTU. Se você está comprando um imóvel, peça o CDC ao vendedor: com ele você consulta o histórico de pagamentos e confirma se há débitos em aberto.',
      },
      {
        type: 'callout',
        text: 'Para emitir a 2ª via, consultar débitos, pedir isenção ou conferir a alíquota oficial vigente, use sempre o canal oficial da Prefeitura.',
        link: {
          href: 'https://sf.osasco.sp.gov.br/pages/servicos/iptu',
          label: 'Portal do IPTU — Secretaria de Finanças de Osasco',
        },
      },

      { type: 'h2', text: 'Vencimento, cota única e parcelamento' },
      {
        type: 'p',
        text: 'Em Osasco, o contribuinte pode escolher entre pagar tudo de uma vez (cota única) ou parcelar. As datas de vencimento costumam variar conforme a região da cidade, então a primeira parcela do Centro pode vencer em data diferente da de um bairro — confira sempre o que está impresso no seu carnê.',
      },
      {
        type: 'ul',
        items: [
          'Cota única: pagamento à vista, geralmente com desconto (costuma ficar entre 5% e 10%*) sobre o valor total do exercício',
          'Parcelamento: o imposto pode ser dividido em até 10 parcelas mensais, sem juros — mas também sem o desconto da cota única',
          'Formas de pagamento: rede bancária, casas lotéricas, aplicativo do banco e PIX, que compensa na hora',
        ],
      },
      {
        type: 'p',
        text: 'Minha recomendação prática: se você tem o dinheiro disponível, a cota única quase sempre compensa — o desconto à vista costuma render mais que deixar o valor rendendo na conta para pagar parcelado. Se o orçamento está apertado, o parcelamento em até 10x sem juros é uma forma tranquila de diluir o custo ao longo do ano.',
      },

      { type: 'h2', text: 'Quem tem direito à isenção de IPTU em Osasco' },
      {
        type: 'p',
        text: 'A legislação de Osasco prevê isenção do IPTU para alguns perfis de contribuinte de baixa renda. De forma geral, podem solicitar o benefício aposentados, pensionistas, pessoas com mais de 65 anos, pessoas definitivamente incapacitadas para o trabalho e órfãos menores de 18 anos, desde que cumpram, de forma combinada, requisitos como:',
      },
      {
        type: 'ul',
        items: [
          'Ter rendimentos totais inferiores a 3 salários mínimos',
          'Residir efetivamente no imóvel para o qual pede a isenção',
          'Não possuir outro imóvel em território nacional',
        ],
      },
      {
        type: 'p',
        text: 'A isenção não é automática: precisa ser requerida na Secretaria de Finanças, com a documentação que comprove cada requisito. Um ponto que mudou e vale destacar — o prazo de validade da isenção passou de 3 para 5 anos, o que reduz a frequência do recadastramento. Mesmo assim, fique atento ao período: deixar a isenção vencer faz o IPTU voltar a ser cobrado integralmente.',
      },
      {
        type: 'callout',
        text: 'O atendimento presencial da Secretaria de Finanças para assuntos de IPTU e isenção fica na Rua Narciso Sturlini, 201 — Centro, Osasco, de segunda a sexta. Para registrar a escritura depois da compra, veja também onde ficam os cartórios da cidade.',
        link: {
          href: '/ajuda/cartorios-de-imoveis-em-osasco',
          label: 'Cartórios de imóveis em Osasco',
        },
      },

      { type: 'h2', text: 'IPTU na compra e venda do imóvel: o que conferir' },
      {
        type: 'p',
        text: 'Aqui está a parte que mais protege o comprador. O IPTU é uma obrigação que acompanha o imóvel (e não a pessoa): se o antigo dono deixou parcelas em atraso, essa dívida pode ser cobrada do novo proprietário depois da compra. Por isso, na hora de comprar em Osasco, eu sempre faço três conferências:',
      },
      {
        type: 'ol',
        items: [
          'Solicitar o extrato do IPTU dos últimos 5 anos no portal da Prefeitura, usando o CDC do imóvel, para verificar se há parcelas em aberto ou inscrição em dívida ativa',
          'Exigir a Certidão Negativa de Débitos Municipais (ou certidão de regularidade fiscal do imóvel) antes da escritura',
          'Conferir se o valor venal usado no IPTU é coerente com o preço de compra — ele é a base também para o cálculo do ITBI',
        ],
      },
      {
        type: 'p',
        text: 'Imóvel com IPTU atrasado não impede a venda, mas a pendência precisa ser quitada (geralmente pelo vendedor) ou abatida do valor da negociação, com tudo registrado por escrito no contrato. Esse é exatamente o tipo de detalhe que verifico na análise de documentação antes de qualquer proposta.',
      },
      {
        type: 'callout',
        text: 'Faço a verificação completa da situação fiscal do imóvel — IPTU, dívida ativa e certidões — antes de você fechar a compra, sem custo. Assim você não herda surpresa nenhuma junto com as chaves.',
      },

      {
        type: 'disclaimer',
        text: '* Os percentuais, prazos e regras de isenção indicados com asterisco são estimativas baseadas na legislação municipal e nas práticas da Prefeitura de Osasco na data de atualização deste conteúdo, e não constituem orientação fiscal oficial nem cotação. Alíquotas, valor venal, descontos, datas de vencimento e critérios de isenção do IPTU são definidos exclusivamente pela Secretaria de Finanças de Osasco e podem ser alterados a cada exercício. Confirme sempre as informações no portal oficial do município antes de pagar ou planejar a compra. O Corretor Yuri Imóveis (CRECI-SP 235509) não se responsabiliza por divergências entre os valores aqui indicados e os efetivamente cobrados pela Prefeitura.',
      },
    ],
    faq: [
      {
        pergunta: 'Como é calculado o IPTU em Osasco?',
        resposta:
          'O IPTU de Osasco é calculado multiplicando o valor venal do imóvel (avaliação fiscal da Prefeitura) por uma alíquota definida no Código Tributário Municipal, que varia conforme o uso do imóvel — residencial, comercial ou terreno. Para 2026 a 2028, a base do valor venal foi congelada pela Lei Complementar 17/2025, sofrendo apenas atualização monetária pela UFMO.',
      },
      {
        pergunta: 'Como emitir a 2ª via do IPTU de Osasco pela internet?',
        resposta:
          'Acesse o portal da Secretaria de Finanças de Osasco (sf.osasco.sp.gov.br), clique em "Serviços Online", selecione a opção de IPTU e "Emitir 2ª via", informe o CDC (Código de Cadastro do Contribuinte, que está no carnê) e o código da imagem. O sistema gera o boleto para impressão ou pagamento via PIX.',
      },
      {
        pergunta: 'Posso parcelar o IPTU de Osasco?',
        resposta:
          'Sim. O IPTU de Osasco pode ser parcelado em até 10 vezes mensais, sem juros. Quem prefere pagar à vista na cota única costuma ter um desconto (geralmente entre 5% e 10%) sobre o valor total, mas perde o benefício se optar pelo parcelamento.',
      },
      {
        pergunta: 'Quem tem isenção de IPTU em Osasco?',
        resposta:
          'Podem pedir isenção aposentados, pensionistas, pessoas com mais de 65 anos, pessoas incapacitadas definitivamente para o trabalho e órfãos menores de 18 anos, desde que tenham renda inferior a 3 salários mínimos, residam no imóvel e não possuam outra propriedade no país. O benefício precisa ser solicitado na Secretaria de Finanças e tem validade de 5 anos.',
      },
      {
        pergunta: 'IPTU atrasado passa para o novo dono na compra do imóvel?',
        resposta:
          'Sim. O IPTU é uma obrigação que acompanha o imóvel, então débitos deixados pelo antigo proprietário podem ser cobrados do comprador após a venda. Por isso, antes de comprar em Osasco, confira o extrato do IPTU dos últimos 5 anos pelo CDC e exija a certidão negativa de débitos municipais; pendências devem ser quitadas pelo vendedor ou abatidas do valor, com tudo registrado no contrato.',
      },
    ],
  },

  {
    slug: 'itbi-osasco',
    titulo: 'ITBI de Osasco 2026: Alíquota de 3%, Como Calcular, Guia e Isenção',
    h1: 'ITBI de',
    h1Destaque: 'Osasco',
    descricaoMeta:
      'Tudo sobre o ITBI de Osasco em 2026: alíquota de 3% pela LC 227/2026, base de cálculo, exemplos, como emitir a guia, prazo de pagamento, quem paga e quando há isenção.',
    resumo:
      'O ITBI de Osasco passou para 3% com a LC 227/2026. Veja como calcular sobre o valor de venda ou venal, emitir a guia, o prazo de pagamento, quem paga e quando há isenção.',
    atualizadoEm: '2026-05-31',
    blocks: [
      {
        type: 'p',
        text: 'O ITBI (Imposto de Transmissão de Bens Imóveis) é o imposto municipal que o comprador paga toda vez que um imóvel muda de dono em Osasco. Ele costuma ser o maior dos custos paralelos da compra — e o que mais pega gente de surpresa, porque precisa ser pago em dinheiro, à vista, antes do registro, e não entra no financiamento. Como esse valor subiu em Osasco a partir de 2026, vale entender exatamente como ele funciona para planejar o orçamento sem sustos. Abaixo explico tudo do jeito que oriento meus clientes na prática.',
      },

      {
        type: 'disclaimer',
        text: '⚠️ AVISO IMPORTANTE: As informações desta página têm finalidade exclusivamente informativa e se baseiam na legislação municipal vigente na data de atualização. A alíquota, a base de cálculo, os prazos e os critérios de isenção do ITBI são definidos pela Prefeitura de Osasco e podem ser alterados. Antes de fechar qualquer compra, confirme os valores diretamente no portal de Finanças da Prefeitura de Osasco ou solicite uma simulação personalizada.',
      },

      { type: 'h2', text: 'Qual é a alíquota do ITBI em Osasco em 2026' },
      {
        type: 'p',
        text: 'Em Osasco, a alíquota do ITBI é de 3%* sobre o valor do imóvel, conforme a Lei Complementar 227/2026, que substituiu a alíquota anterior de 2%. Isso significa que, em um imóvel de R$ 300.000, o ITBI passou de R$ 6.000 para R$ 9.000 — uma diferença de R$ 3.000 que precisa entrar no seu planejamento de compra em 2026.',
      },
      {
        type: 'callout',
        text: 'Quer ver o ITBI dentro do quadro completo de custos da compra (escritura, registro e tarifas bancárias)? Veja o guia de custos com a calculadora.',
        link: {
          href: '/ajuda/custos-para-comprar-imovel-em-osasco',
          label: 'Quanto custa comprar imóvel em Osasco',
        },
      },

      { type: 'h2', text: 'Sobre qual valor o ITBI é calculado' },
      {
        type: 'p',
        text: 'Esse é o ponto que mais gera dúvida. O ITBI não incide necessariamente sobre o preço que você pagou: ele é calculado sobre o maior valor entre o preço de venda declarado na escritura e o valor venal de referência que a Prefeitura de Osasco atribui ao imóvel. A lógica do município é evitar que negócios sejam declarados abaixo do valor real só para reduzir o imposto.',
      },
      {
        type: 'p',
        text: 'Na maioria das compras em Osasco, o preço de venda é maior que o valor venal de referência, então o cálculo sai sobre o preço efetivo. Mas em imóveis antigos ou em bairros que se valorizaram pouco, pode acontecer de o valor venal de referência ser maior — e nesse caso é ele que vale como base. Por isso eu sempre confiro os dois valores antes de estimar o ITBI de um cliente.',
      },

      { type: 'h2', text: 'Como calcular o ITBI: exemplos práticos' },
      {
        type: 'p',
        text: 'A conta é direta: multiplique a base de cálculo (o maior valor entre venda e venal) por 3%*. Veja três cenários comuns em Osasco em 2026:',
      },
      {
        type: 'ul',
        items: [
          'Studio de R$ 200.000 (MCMV, perto da estação): ITBI de R$ 6.000* — podendo ter redução parcial se enquadrado no programa habitacional',
          'Apartamento de 2 quartos de R$ 320.000: ITBI de R$ 9.600*',
          'Casa de R$ 600.000 em bairro consolidado: ITBI de R$ 18.000*',
        ],
      },
      {
        type: 'callout',
        text: 'Calcule o ITBI junto com a parcela do financiamento, a entrada e a elegibilidade ao Minha Casa Minha Vida de uma vez só no simulador.',
        link: {
          href: '/simulador',
          label: 'Simular financiamento e custos em Osasco',
        },
      },

      { type: 'h2', text: 'Como emitir a guia e quando pagar o ITBI' },
      {
        type: 'p',
        text: 'A guia do ITBI é emitida pela Prefeitura de Osasco, geralmente pelo portal de serviços da Secretaria de Finanças (e, em muitos casos, com o apoio do tabelionato onde a escritura será lavrada). O recolhimento acontece em um momento específico da compra: depois do acerto entre as partes e antes da lavratura da escritura ou da assinatura do contrato de financiamento.',
      },
      {
        type: 'ul',
        items: [
          'A guia tem prazo de pagamento próprio (costuma ser de cerca de 30 dias* após a emissão) — emitir cedo demais e perder o prazo significa gerar outra',
          'Sem o ITBI quitado, o Cartório de Registro de Imóveis não registra a transferência: o imóvel continua, juridicamente, no nome do vendedor',
          'No financiamento bancário, o ITBI também é pago antes do registro do contrato; o banco costuma orientar o momento exato',
        ],
      },
      {
        type: 'callout',
        text: 'A alíquota e a guia oficiais são definidas pela Prefeitura. Confirme o valor vigente e emita a guia no portal de Finanças do município.',
        link: {
          href: 'http://sf.osasco.sp.gov.br/financas/',
          label: 'Portal de Finanças da Prefeitura de Osasco',
        },
      },

      { type: 'h2', text: 'Quem paga o ITBI: comprador ou vendedor' },
      {
        type: 'p',
        text: 'Por lei e por costume em Osasco, o ITBI é responsabilidade do comprador. Faz parte do conjunto de custos que ficam com quem está adquirindo o imóvel — junto com a escritura e o registro —, enquanto o vendedor costuma arcar com as certidões pessoais e a comissão de corretagem. O contrato pode ajustar essa divisão, mas o padrão do mercado local é esse.',
      },

      { type: 'h2', text: 'Existe isenção ou redução de ITBI em Osasco' },
      {
        type: 'p',
        text: 'Há situações de isenção ou redução parcial, principalmente ligadas a programas habitacionais. Imóveis enquadrados no Minha Casa Minha Vida e financiamentos pelo Sistema Financeiro de Habitação (SFH), em especial para quem está comprando o primeiro imóvel, podem ter desconto sobre a parcela financiada do imposto. A análise é feita caso a caso pela Prefeitura na emissão da guia, mediante comprovação do enquadramento.',
      },
      {
        type: 'callout',
        text: 'Se você quer comparar como o ITBI funciona em Osasco, Barueri, Carapicuíba e na capital — útil para quem está decidindo entre cidades da região oeste — veja o panorama regional completo.',
        link: {
          href: '/blog/itbi-osasco-barueri-carapicuiba-sao-paulo-2026',
          label: 'ITBI em Osasco, Barueri, Carapicuíba e São Paulo 2026',
        },
      },
      {
        type: 'callout',
        text: 'Antes da proposta, eu calculo o ITBI exato do imóvel que você quer (conferindo preço e valor venal) e verifico se há direito a redução pelo MCMV ou SFH. Assim você sabe o valor real a separar, sem surpresa na hora da escritura.',
      },

      {
        type: 'disclaimer',
        text: '* Os valores e percentuais marcados com asterisco são estimativas baseadas na legislação municipal vigente na data de atualização do conteúdo e servem apenas para planejamento. Não constituem oferta, cotação oficial nem orientação fiscal ou jurídica. A alíquota do ITBI, a base de cálculo, os prazos de pagamento e os critérios de isenção são definidos exclusivamente pela Prefeitura de Osasco e podem ser alterados sem aviso prévio. Confirme sempre as informações no portal oficial do município antes de fechar a compra. O Corretor Yuri Imóveis (CRECI-SP 235509) não se responsabiliza por divergências entre os valores aqui indicados e os efetivamente cobrados pela Prefeitura de Osasco.',
      },
    ],
    faq: [
      {
        pergunta: 'Quanto é o ITBI em Osasco em 2026?',
        resposta:
          'A alíquota do ITBI em Osasco é de 3% sobre o valor do imóvel, conforme a Lei Complementar 227/2026, que substituiu o percentual anterior de 2%. Para um imóvel de R$ 300.000, o ITBI é de R$ 9.000.',
      },
      {
        pergunta: 'O ITBI é calculado sobre o preço de compra ou o valor venal?',
        resposta:
          'Sobre o maior dos dois. O ITBI de Osasco incide sobre o maior valor entre o preço de venda declarado e o valor venal de referência da Prefeitura. Na maioria das compras o preço de venda é maior e serve de base, mas em imóveis antigos o valor venal de referência pode prevalecer.',
      },
      {
        pergunta: 'Quem paga o ITBI na compra de um imóvel?',
        resposta:
          'O ITBI é responsabilidade do comprador, por lei e por costume em Osasco. Ele compõe os custos do adquirente junto com escritura e registro, enquanto o vendedor costuma pagar as certidões pessoais e a corretagem. O contrato pode ajustar essa divisão.',
      },
      {
        pergunta: 'Quando o ITBI precisa ser pago?',
        resposta:
          'Antes da lavratura da escritura ou da assinatura do contrato de financiamento, e sempre antes do registro no cartório. A guia é emitida pela Prefeitura de Osasco com prazo próprio de pagamento (em torno de 30 dias). Sem o ITBI quitado, o Cartório de Registro de Imóveis não transfere o imóvel.',
      },
      {
        pergunta: 'Existe isenção de ITBI em Osasco?',
        resposta:
          'Há reduções parciais para imóveis enquadrados no Minha Casa Minha Vida e em financiamentos pelo Sistema Financeiro de Habitação (SFH), sobretudo no primeiro imóvel. O desconto incide sobre a parcela financiada e é analisado caso a caso pela Prefeitura na emissão da guia, mediante comprovação.',
      },
    ],
  },

  {
    slug: 'cartorios-de-imoveis-em-osasco',
    titulo: 'Cartórios de Imóveis em Osasco: Endereços, Telefones e Mapa',
    h1: 'Cartórios de Imóveis em',
    h1Destaque: 'Osasco',
    descricaoMeta:
      'Cartórios de registro de imóveis e tabelionatos de notas em Osasco — endereço, telefone e área de atuação. Saiba onde registrar sua escritura em 2026.',
    resumo:
      'Endereços e contatos dos cartórios de registro de imóveis e tabelionatos de notas que atendem Osasco — informação essencial para escritura, registro e certidões.',
    atualizadoEm: '2026-04-13',
    blocks: [
      {
        type: 'p',
        text: 'Para escriturar e registrar um imóvel em Osasco você precisa interagir com dois tipos de cartório: o tabelionato de notas, onde a escritura pública é lavrada, e o cartório de registro de imóveis, onde a transferência fica oficialmente registrada na matrícula. Abaixo você encontra os endereços e contatos atualizados.',
      },

      { type: 'h2', text: 'Diferença entre tabelionato de notas e registro de imóveis' },
      {
        type: 'p',
        text: 'O tabelionato de notas (também chamado de cartório de notas) lavra a escritura pública de compra e venda — é nele que vendedor, comprador e tabelião assinam o documento. Já o cartório de registro de imóveis é responsável por levar essa escritura à matrícula do imóvel, oficializando a mudança de proprietário. Sem registro, juridicamente a venda ainda não aconteceu.',
      },

      { type: 'h2', text: 'Cartórios em Osasco' },
      {
        type: 'p',
        text: 'A lista abaixo está organizada por tipo de cartório e cobre os principais que atendem a área urbana de Osasco. Recomendo sempre confirmar horários por telefone antes de comparecer.',
      },
    ],
    cartorios: [
      {
        nome: 'Oficial de Registro de Imóveis de Osasco',
        tipo: 'registro-imoveis',
        endereco: 'Avenida Santo Antônio, 1986',
        cidade: 'Osasco',
        uf: 'SP',
        telefone: '(11) 3683-3030',
      },
      {
        nome: '1º Tabelião de Notas de Osasco',
        tipo: 'tabeliao-notas',
        endereco: 'Avenida João Batista, 239',
        cidade: 'Osasco',
        uf: 'SP',
        telefone: '(11) 3681-1282',
      },
      {
        nome: '3º Tabelião de Notas de Osasco',
        tipo: 'tabeliao-notas',
        endereco: 'Rua Dona Primitiva Vianco, 886',
        bairro: 'Jardim Agú',
        cidade: 'Osasco',
        uf: 'SP',
        telefone: '(11) 3681-3000',
      },
      {
        nome: '2º Oficial de Registro de Imóveis, Títulos e Documentos e Pessoa Jurídica de Osasco',
        tipo: 'registro-imoveis',
        endereco: 'Rua Dante Battiston, 249',
        cidade: 'Osasco',
        uf: 'SP',
        telefone: '(11) 3682-4333',
      },
      {
        nome: '1º Cartório de Registro Civil das Pessoas Naturais, Interdições e Tutelas de Osasco',
        tipo: 'registro-civil',
        endereco: 'Avenida João Batista, 259',
        cidade: 'Osasco',
        uf: 'SP',
        telefone: '(11) 3685-9926',
      },
    ],
    faq: [
      {
        pergunta: 'Onde é o Cartório de Registro de Imóveis de Osasco?',
        resposta:
          'O Oficial de Registro de Imóveis de Osasco fica na Avenida Santo Antônio, 1986. Telefone (11) 3683-3030.',
      },
      {
        pergunta: 'Qual cartório lavra escritura em Osasco?',
        resposta:
          'Os tabelionatos de notas de Osasco — como o 1º Tabelião na Avenida João Batista, 239 e o 3º Tabelião na Rua Dona Primitiva Vianco, 886 — são responsáveis por lavrar escrituras públicas de compra e venda de imóveis.',
      },
      {
        pergunta: 'Posso fazer a escritura em qualquer cartório?',
        resposta:
          'A escritura pública pode ser lavrada em qualquer tabelionato de notas do Brasil, independentemente de onde fica o imóvel. Já o registro do imóvel precisa ser feito obrigatoriamente no cartório de registro de imóveis competente para a localização do bem.',
      },
    ],
  },
]

export function getAjudaArtigoBySlug(slug: string): AjudaArtigo | undefined {
  return AJUDA_ARTIGOS.find(a => a.slug === slug)
}
