export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; text: string; link?: { href: string; label: string } }

export interface Cartorio {
  nome: string
  tipo: 'registro-imoveis' | 'tabeliao-notas' | 'registro-civil'
  endereco: string
  bairro?: string
  cidade: string
  uf: string
  telefone: string
}

export interface AjudaFAQ {
  pergunta: string
  resposta: string
}

export interface AjudaArtigo {
  slug: string
  titulo: string
  h1: string
  descricaoMeta: string
  resumo: string
  atualizadoEm: string
  blocks: ArticleBlock[]
  cartorios?: Cartorio[]
  faq?: AjudaFAQ[]
}

export const AJUDA_ARTIGOS: AjudaArtigo[] = [
  {
    slug: 'documentos-para-comprar-imovel',
    titulo: 'Documentos para Comprar Imóvel em Osasco — Lista Completa',
    h1: 'Documentos necessários para comprar um imóvel',
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
    titulo: 'Custos para Comprar Imóvel em Osasco — ITBI, Escritura e Registro',
    h1: 'Custos para comprar um imóvel em Osasco',
    descricaoMeta:
      'Quanto custa comprar um imóvel em Osasco? Veja ITBI, escritura, registro e demais taxas com valores atualizados para 2026 e simulações por faixa de preço.',
    resumo:
      'Conheça todos os custos que entram na compra de um imóvel em Osasco — do ITBI da Prefeitura à escritura no tabelião — e como planejar seu orçamento com segurança.',
    atualizadoEm: '2026-04-13',
    blocks: [
      {
        type: 'p',
        text: 'Além do valor do imóvel, comprar uma casa ou apartamento em Osasco envolve impostos, taxas de cartório e despesas com documentação. Em geral, esses custos somam de 4% a 6% do valor do imóvel. Conhecer cada item ajuda a planejar o orçamento e evita correr atrás de dinheiro na hora da escritura.',
      },

      { type: 'h2', text: 'ITBI — Imposto de Transmissão de Bens Imóveis' },
      {
        type: 'p',
        text: 'O ITBI é o imposto cobrado pela Prefeitura de Osasco sempre que um imóvel muda de dono. Em Osasco, a alíquota atual é de 2% sobre o maior valor entre o preço de venda e o valor venal de referência. O pagamento é feito antes da lavratura da escritura — sem o ITBI quitado, o cartório não realiza a transferência.',
      },
      {
        type: 'ul',
        items: [
          'Alíquota em Osasco: 2% sobre o valor do imóvel',
          'Pago à Prefeitura Municipal de Osasco',
          'Obrigatório antes do registro em cartório',
          'Existem isenções parciais para imóveis no programa Minha Casa Minha Vida e primeiro imóvel financiado pelo SFH',
        ],
      },

      { type: 'h2', text: 'Escritura pública' },
      {
        type: 'p',
        text: 'A escritura é lavrada em um tabelionato de notas (cartório de notas) e formaliza a transferência. O valor segue uma tabela progressiva de emolumentos definida pelo Tribunal de Justiça de São Paulo — quanto maior o valor do imóvel, maior a taxa. As faixas abaixo são estimativas aproximadas e servem apenas para planejamento; os valores oficiais são atualizados pelo TJ-SP no início de cada ano.',
      },
      {
        type: 'ul',
        items: [
          'Imóveis até R$ 200.000: aproximadamente R$ 1.500 a R$ 2.500',
          'Imóveis de R$ 200.000 a R$ 500.000: aproximadamente R$ 2.500 a R$ 4.500',
          'Imóveis acima de R$ 500.000: cálculo proporcional pela tabela do TJ-SP',
        ],
      },
      {
        type: 'callout',
        text: 'Os emolumentos de tabelionato em São Paulo são reajustados anualmente. Antes de fechar a compra, consulte a tabela oficial atualizada no site do Tribunal de Justiça de São Paulo ou peça uma simulação direto ao cartório escolhido.',
        link: {
          href: 'https://www.tjsp.jus.br/IndicesTaxasJudiciarias/TaxasCustasEmolumentos',
          label: 'Tabela oficial de emolumentos do TJ-SP',
        },
      },
      {
        type: 'callout',
        text: 'Quando a compra é financiada (Caixa, Itaú, Bradesco, Santander), o contrato de financiamento substitui a escritura pública. Nesse caso, o comprador economiza essa taxa e paga apenas as tarifas do banco.',
      },

      { type: 'h2', text: 'Registro no Cartório de Imóveis' },
      {
        type: 'p',
        text: 'Depois da escritura, o documento precisa ser registrado no Cartório de Registro de Imóveis competente — em Osasco, o Oficial de Registro de Imóveis fica na Avenida Santo Antônio. Só após o registro o comprador é oficialmente o dono. A taxa também segue a tabela progressiva do TJ-SP e fica em torno de 1% do valor do imóvel.',
      },

      { type: 'h2', text: 'Tarifas bancárias (financiamento)' },
      {
        type: 'p',
        text: 'Quem financia paga ainda algumas tarifas do banco: avaliação do imóvel (R$ 3.500 a R$ 4.500 em média), tarifa de abertura de crédito e seguros obrigatórios (MIP e DFI) embutidos nas parcelas. Na Caixa, dentro do Minha Casa Minha Vida, várias dessas tarifas são reduzidas ou subsidiadas.',
      },

      { type: 'h2', text: 'Resumo dos custos esperados' },
      {
        type: 'ul',
        items: [
          'ITBI: 2% (Osasco)',
          'Escritura ou contrato bancário: 0,5% a 1%',
          'Registro de imóveis: cerca de 1%',
          'Avaliação do imóvel (financiamento): valor fixo do banco',
          'Total estimado: 4% a 6% do valor do imóvel à vista',
        ],
      },

      {
        type: 'callout',
        text: 'Faço a simulação personalizada de todos os custos antes da proposta. Assim você sabe exatamente quanto vai precisar separar para fechar a compra sem surpresas.',
      },
    ],
    faq: [
      {
        pergunta: 'Quanto é o ITBI em Osasco?',
        resposta:
          'A alíquota do ITBI em Osasco é de 2% sobre o maior valor entre o preço de venda do imóvel e o valor venal de referência informado pela Prefeitura.',
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
    slug: 'cartorios-de-imoveis-em-osasco',
    titulo: 'Cartórios de Imóveis em Osasco — Endereços e Telefones',
    h1: 'Cartórios de imóveis em Osasco',
    descricaoMeta:
      'Lista completa dos cartórios de registro de imóveis e tabelionatos de notas em Osasco SP, com endereço, telefone e área de atuação. Atualizado para 2026.',
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
