import Link from 'next/link'
import { PHONE_WA } from '../lib/config'
import type { ReactNode } from 'react'

export interface FaqItem {
  question: string
  answerText: string
  answerNode: ReactNode
}

export const HOMEPAGE_FAQ: FaqItem[] = [
  {
    question: 'Que tipos de imóveis o Corretor Yuri trabalha?',
    answerText:
      'Trabalhamos com casas, apartamentos, terrenos, chalés, chácaras e imóveis comerciais para venda e aluguel em Osasco, Barueri, Carapicuíba, Cotia e demais cidades da Zona Oeste da Grande SP. Tem opção para diferentes perfis e orçamentos, seja para comprar, alugar ou investir.',
    answerNode: (
      <>
        Trabalhamos com <strong>casas, apartamentos, terrenos, chalés, chácaras e imóveis comerciais</strong> para
        venda e aluguel em Osasco, Barueri, Carapicuíba, Cotia e demais cidades da Zona Oeste da Grande SP. Tem
        opção para diferentes perfis e orçamentos — seja para comprar seu primeiro imóvel, alugar uma casa ou
        investir em sala comercial.{' '}
        <Link href="/imoveis" className="text-primary underline">
          Veja todos os imóveis disponíveis
        </Link>
        .
      </>
    ),
  },
  {
    question: 'Como funciona o financiamento imobiliário?',
    answerText:
      'Para financiar um imóvel você precisa de entrada a partir de 20% do valor (que pode ser paga com saldo do FGTS) e parcela o restante em até 420 meses pela Caixa Econômica Federal ou bancos privados como Itaú, Bradesco e Santander. Imóveis dentro do teto do SFH podem usar recursos do FGTS e do SBPE, e famílias com renda de até R$ 12 mil podem se enquadrar no Minha Casa Minha Vida com juros reduzidos e subsídios. Reserve cerca de 4,5% do valor do imóvel para ITBI e registro em cartório.',
    answerNode: (
      <>
        Para <strong>financiar um imóvel</strong>, você precisa de entrada a partir de 20% do valor (que pode ser
        paga com <strong>saldo do FGTS</strong>) e parcela o restante em até 420 meses pela Caixa Econômica Federal
        ou bancos privados como Itaú, Bradesco e Santander. Imóveis dentro do teto do <strong>SFH</strong> podem
        usar recursos do FGTS e do SBPE, e famílias com renda de até R$ 12 mil podem se enquadrar no{' '}
        <strong>Minha Casa Minha Vida</strong> com juros reduzidos e subsídios. Além do financiamento, reserve
        cerca de 4,5% do valor do imóvel para ITBI e registro em cartório.{' '}
        <Link href="/contato" className="text-primary underline">
          Fale com o Corretor Yuri
        </Link>{' '}
        para uma simulação gratuita.
      </>
    ),
  },
  {
    question: 'Quais são os melhores bairros para morar em Osasco?',
    answerText:
      'Os bairros mais procurados de Osasco são: Centro — coração comercial, com Shopping União e estação CPTM; Jardim Roberto — residencial tradicional com fácil acesso ao centro; Presidente Altino — excelente acesso pela CPTM, ideal para quem trabalha na capital; Rochdale — residencial consolidado; Bela Vista — tranquilo e familiar; Km 18 — imóveis mais acessíveis e fácil acesso à Raposo Tavares; Jaguaribe — próximo ao centro comercial, com ampla rede de serviços. Cada bairro tem perfil e faixa de preço diferentes.',
    answerNode: (
      <>
        Os bairros mais procurados de Osasco são:
        <ul className="mt-2 ml-4 list-disc space-y-1">
          <li>
            <strong>Centro</strong> — coração comercial da cidade, com Shopping União, estação CPTM e ampla oferta
            de apartamentos à venda e para alugar.
          </li>
          <li>
            <strong>Jardim Roberto</strong> — residencial tradicional, com boa oferta de casas e apartamentos e
            fácil acesso ao centro e à CPTM.
          </li>
          <li>
            <strong>Presidente Altino</strong> — excelente acesso pela estação CPTM, comércio completo e boa oferta
            de apartamentos à venda. Ideal para quem trabalha na capital.
          </li>
          <li>
            <strong>Rochdale</strong> — residencial consolidado, com comércio local ativo e boa infraestrutura
            para famílias.
          </li>
          <li>
            <strong>Bela Vista</strong> — tranquilo, com infraestrutura familiar, escolas e parques próximos.
          </li>
          <li>
            <strong>Km 18</strong> — região em crescimento, com imóveis mais acessíveis e fácil acesso à Raposo
            Tavares.
          </li>
          <li>
            <strong>Jaguaribe</strong> — próximo ao centro comercial, com ampla rede de serviços e transporte
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
    question: 'Preciso de um corretor pra comprar imóvel?',
    answerText:
      'Sim. O corretor cuida da negociação, verifica toda a documentação do imóvel, acompanha o processo de compra e garante segurança jurídica na transação. O acompanhamento profissional evita armadilhas, agiliza o fechamento e protege você de comprar um imóvel com pendências.',
    answerNode: (
      <>
        Sim. O corretor cuida da negociação, verifica toda a <strong>documentação do imóvel</strong>, acompanha o
        processo de compra e garante <strong>segurança jurídica</strong> na transação. O acompanhamento
        profissional evita armadilhas, agiliza o fechamento e protege você de comprar um imóvel com pendências.{' '}
        <Link href="/contato" className="text-primary underline">
          Fale com o Corretor Yuri
        </Link>{' '}
        para uma consultoria gratuita.
      </>
    ),
  },
  {
    question: 'Quais documentos são necessários para comprar um imóvel?',
    answerText:
      'Do comprador: RG, CPF, comprovante de renda, comprovante de residência e certidão de estado civil. No caso de financiamento, o banco pode pedir extrato do FGTS, declaração de Imposto de Renda e carteira de trabalho. Do imóvel: matrícula atualizada, certidões negativas (ônus, débitos municipais) e IPTU em dia. Cuidamos de toda essa verificação para você.',
    answerNode: (
      <>
        <strong>Do comprador:</strong> RG, CPF, comprovante de renda, comprovante de residência e certidão de
        estado civil. No caso de financiamento, o banco pode pedir extrato do FGTS, declaração de Imposto de Renda
        e carteira de trabalho.
        <br />
        <strong>Do imóvel:</strong> matrícula atualizada, certidões negativas (ônus, débitos municipais) e IPTU em
        dia. Cuidamos de toda essa verificação para você.
      </>
    ),
  },
  {
    question: 'Como falar com o Corretor Yuri?',
    answerText:
      'Pelo WhatsApp (11) 97256-3420 ou pela página de contato do site. Atendimento de segunda a sexta das 9h às 18h e sábado das 9h às 12h. Respondemos em até 2 horas dentro do horário comercial.',
    answerNode: (
      <>
        Pelo{' '}
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
        . Atendimento de segunda a sexta das 9h às 18h e sábado das 9h às 12h. Respondemos em até 2 horas dentro do
        horário comercial.
      </>
    ),
  },
]
