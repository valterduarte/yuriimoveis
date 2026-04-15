import Link from 'next/link'
import type { ReactNode } from 'react'
import { PHONE_WA } from '../lib/config'

export interface FaqItem {
  question: string
  answerText: string
  answerNode: ReactNode
}

export const HOMEPAGE_FAQ: FaqItem[] = [
  {
    question: 'Quais tipos de imóveis o Corretor Yuri oferece em Osasco e Região?',
    answerText:
      'Trabalhamos com casas à venda, apartamentos, terrenos, chalés, chácaras e imóveis comerciais para venda e aluguel em Osasco e toda a Grande São Paulo. Seja para comprar apartamento, alugar casa ou investir em imóvel comercial, nossa imobiliária tem opções para diferentes perfis e orçamentos.',
    answerNode: (
      <>
        Como <strong>corretor de imóveis em Osasco e Região</strong>, trabalhamos com casas à venda, apartamentos,
        terrenos, chalés, chácaras e imóveis comerciais para venda e aluguel em toda a Grande São Paulo. Seja para
        comprar seu apartamento, alugar uma casa ou investir em imóvel comercial, nossa imobiliária tem opções para
        diferentes perfis e orçamentos.{' '}
        <Link href="/imoveis" className="text-primary underline">
          Veja todos os imóveis disponíveis
        </Link>
        .
      </>
    ),
  },
  {
    question: 'Como funciona o financiamento imobiliário em Osasco e Região?',
    answerText:
      'Para financiar um imóvel você precisa de entrada a partir de 20% do valor (que pode ser paga com saldo do FGTS) e parcela o restante em até 420 meses pela Caixa Econômica Federal ou bancos privados como Itaú, Bradesco e Santander. Imóveis dentro do teto do SFH podem usar recursos do FGTS e do SBPE, e famílias com renda de até R$ 12 mil podem se enquadrar no Minha Casa Minha Vida com juros reduzidos e subsídios. Reserve cerca de 4,5% do valor do imóvel para ITBI e registro em cartório.',
    answerNode: (
      <>
        Para <strong>financiar um imóvel em Osasco e região</strong>, você precisa de entrada a partir de 20% do valor
        (que pode ser paga com <strong>saldo do FGTS</strong>) e parcela o restante em até 420 meses pela Caixa
        Econômica Federal ou bancos privados como Itaú, Bradesco e Santander. Imóveis dentro do teto do{' '}
        <strong>SFH</strong> podem usar recursos do FGTS e do SBPE, e famílias com renda de até R$ 12 mil podem se
        enquadrar no <strong>Minha Casa Minha Vida</strong> com juros reduzidos e subsídios. Além do financiamento,
        reserve cerca de 4,5% do valor do imóvel para ITBI e registro em cartório.{' '}
        <Link href="/contato" className="text-primary underline">
          Fale com o Corretor Yuri
        </Link>{' '}
        para uma simulação gratuita.
      </>
    ),
  },
  {
    question: 'Quais são os melhores bairros para morar em Osasco e Região?',
    answerText:
      'Os bairros mais procurados de Osasco para morar são: Centro de Osasco — coração comercial, com Shopping União e estação CPTM; Jardim Roberto — residencial tradicional com fácil acesso ao centro; Presidente Altino — excelente acesso pela CPTM, ideal para quem trabalha em São Paulo; Rochdale — residencial consolidado; Bela Vista — tranquilo e familiar; Km 18 — imóveis mais acessíveis e fácil acesso à Raposo Tavares; Jaguaribe — próximo ao centro comercial, com ampla rede de serviços. Cada bairro tem perfil e faixa de preço diferentes.',
    answerNode: (
      <>
        Os bairros mais procurados de Osasco para morar são:
        <ul className="mt-2 ml-4 list-disc space-y-1">
          <li>
            <strong>Centro de Osasco</strong> — coração comercial da cidade, com Shopping União, estação CPTM e ampla
            oferta de apartamentos à venda e para alugar.
          </li>
          <li>
            <strong>Jardim Roberto</strong> — bairro residencial tradicional de Osasco, com boa oferta de casas e
            apartamentos e fácil acesso ao centro e à CPTM.
          </li>
          <li>
            <strong>Presidente Altino</strong> — excelente acesso pela estação CPTM, comércio completo e boa oferta
            de apartamentos à venda. Ideal para quem trabalha em São Paulo.
          </li>
          <li>
            <strong>Rochdale</strong> — bairro residencial consolidado, com comércio local ativo e boa infraestrutura
            para famílias.
          </li>
          <li>
            <strong>Bela Vista</strong> — bairro residencial tranquilo com infraestrutura familiar, escolas e parques
            próximos.
          </li>
          <li>
            <strong>Km 18</strong> — região em crescimento com imóveis mais acessíveis em Osasco e fácil acesso à
            Raposo Tavares.
          </li>
          <li>
            <strong>Jaguaribe</strong> — próximo ao centro comercial de Osasco, com ampla rede de serviços e transporte
            público.
          </li>
        </ul>
        <span className="block mt-2">
          Cada bairro tem perfil e faixa de preço diferentes.{' '}
          <Link href="/contato" className="text-primary underline">
            Fale conosco
          </Link>{' '}
          para uma recomendação personalizada.
        </span>
      </>
    ),
  },
  {
    question: 'Preciso de um corretor de imóveis para comprar meu imóvel em Osasco e Região?',
    answerText:
      'Sim, contar com um corretor de imóveis em Osasco e Região faz toda a diferença. O corretor cuida da negociação, verifica a documentação imobiliária do imóvel, acompanha todo o processo de compra e garante segurança jurídica na transação. O acompanhamento profissional evita problemas e agiliza o fechamento.',
    answerNode: (
      <>
        Sim, contar com um <strong>corretor de imóveis em Osasco e Região</strong> faz toda a diferença. O corretor
        cuida da negociação, verifica a documentação imobiliária do imóvel, acompanha todo o processo de compra e
        garante segurança jurídica na transação. Seja para comprar seu imóvel, apartamento à venda ou imóvel
        comercial, o acompanhamento profissional evita problemas e agiliza o fechamento.{' '}
        <Link href="/contato" className="text-primary underline">
          Fale com o Corretor Yuri
        </Link>{' '}
        para uma consultoria gratuita.
      </>
    ),
  },
  {
    question: 'Quais documentos são necessários para comprar um imóvel em Osasco e Região?',
    answerText:
      'Para comprar um imóvel em Osasco e Região, os principais documentos são: RG, CPF, comprovante de renda, comprovante de residência e certidão de estado civil. No caso de financiamento, o banco pode solicitar também extrato do FGTS, declaração do Imposto de Renda e carteira de trabalho. A documentação imobiliária do imóvel (matrícula atualizada, certidões negativas, IPTU) é igualmente importante.',
    answerNode: (
      <>
        Para comprar um imóvel em Osasco e Região, os principais documentos são: <strong>RG, CPF, comprovante de renda,
        comprovante de residência e certidão de estado civil</strong>. No caso de financiamento, o banco pode
        solicitar também extrato do FGTS, declaração do Imposto de Renda e carteira de trabalho. A{' '}
        <strong>documentação imobiliária</strong> do imóvel (matrícula atualizada, certidões negativas, IPTU) é
        igualmente importante. Como sua imobiliária em Osasco e Região, cuidamos de toda essa parte para você.
      </>
    ),
  },
  {
    question: 'Como entrar em contato com o Corretor Yuri?',
    answerText:
      'Você pode entrar em contato pelo WhatsApp (11) 97256-3420 ou pela página de contato do site. O atendimento é de segunda a sexta das 9h às 18h e sábado das 9h às 12h. Respondemos todas as mensagens em até 2 horas durante o horário comercial.',
    answerNode: (
      <>
        Você pode entrar em contato pelo{' '}
        <a
          href={PHONE_WA}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          WhatsApp (11) 97256-3420
        </a>{' '}
        ou pela nossa{' '}
        <Link href="/contato" className="text-primary underline">
          página de contato
        </Link>
        . O atendimento é de segunda a sexta das 9h às 18h e sábado das 9h às 12h. Respondemos todas as mensagens em
        até 2 horas durante o horário comercial.
      </>
    ),
  },
]
