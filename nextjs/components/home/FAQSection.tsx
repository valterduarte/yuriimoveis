'use client'

import { useState } from 'react'
import Link from 'next/link'

const FAQ_ITEMS = [
  {
    question: 'Quais tipos de imóveis o Corretor Yuri oferece em Osasco e Região?',
    answer: (
      <>
        Como <strong>corretor de imóveis em Osasco e Região</strong>, trabalhamos com casas à venda, apartamentos à
        venda, terrenos, chalés, chácaras e imóveis comerciais para venda e aluguel em Osasco e Grande São Paulo. Seja
        para comprar apartamento em Osasco e Região, alugar casa ou investir em imóvel comercial, nossa imobiliária em
        Osasco e Região tem
        opções para diferentes perfis e orçamentos.{' '}
        <Link href="/imoveis" className="text-primary underline">
          Veja todos os imóveis disponíveis
        </Link>
        .
      </>
    ),
  },
  {
    question: 'Como funciona o financiamento imobiliário em Osasco e Região?',
    answer: (
      <>
        Para <strong>financiar um imóvel em Osasco e região</strong>, você precisa de entrada a partir de 20% do valor (que pode
        ser paga com <strong>saldo do FGTS</strong>) e parcela o restante em até 420 meses pela Caixa Econômica Federal
        ou bancos privados como Itaú, Bradesco e Santander. Imóveis dentro do teto do <strong>SFH</strong> podem usar
        recursos do FGTS e do SBPE, e famílias com renda de até R$ 12 mil podem se enquadrar no{' '}
        <strong>Minha Casa Minha Vida</strong> com juros reduzidos e subsídios. Além do financiamento, reserve cerca de
        4,5% do valor do imóvel para ITBI e registro em cartório.{' '}
        <Link href="/contato" className="text-primary underline">
          Fale com o Corretor Yuri
        </Link>{' '}
        para uma simulação gratuita e encontrar a melhor condição para comprar casa ou apartamento em Osasco e região.
      </>
    ),
  },
  {
    question: 'Quais são os melhores bairros para morar em Osasco e Região?',
    answer: (
      <>
        Os bairros mais procurados de Osasco para morar são:
        <ul className="mt-2 ml-4 list-disc space-y-1">
          <li>
            <strong>Vila Yara</strong> — um dos bairros mais valorizados de Osasco, com condomínios de alto padrão,
            comércio sofisticado e proximidade com o Shopping União.
          </li>
          <li>
            <strong>Jardim das Flores</strong> — bairro residencial arborizado e tranquilo, ideal para famílias, com
            boa oferta de casas à venda e apartamentos em Osasco.
          </li>
          <li>
            <strong>Presidente Altino</strong> — excelente acesso pela estação CPTM, comércio completo e boa oferta
            de apartamentos à venda. Ideal para quem trabalha em São Paulo.
          </li>
          <li>
            <strong>Quitaúna</strong> — região residencial consolidada, com áreas verdes, colégios e fácil acesso ao
            centro de Osasco.
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
    answer: (
      <>
        Sim, contar com um <strong>corretor de imóveis em Osasco e Região</strong> faz toda a diferença. O corretor cuida da
        negociação, verifica a documentação imobiliária do imóvel, acompanha todo o processo de compra e garante
        segurança jurídica na transação. Seja para comprar seu imóvel, apartamento à venda ou imóvel comercial,
        o acompanhamento profissional evita problemas e agiliza o fechamento.{' '}
        <Link href="/contato" className="text-primary underline">
          Fale com o Corretor Yuri
        </Link>{' '}
        para uma consultoria gratuita.
      </>
    ),
  },
  {
    question: 'Quais documentos são necessários para comprar um imóvel em Osasco e Região?',
    answer: (
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
    answer: (
      <>
        Você pode entrar em contato pelo{' '}
        <a
          href="https://wa.me/5511972563420?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20im%C3%B3veis."
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

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <span className="section-label">Dúvidas Frequentes</span>
          <h2 className="section-title mb-10">Perguntas Frequentes sobre Imóveis em Osasco e Região</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white border border-gray-200">
                <h3>
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                    aria-expanded={openIndex === i}
                  >
                    <span className="text-sm font-bold text-dark pr-4">{item.question}</span>
                    <span className="text-primary text-xl flex-shrink-0" aria-hidden="true">
                      {openIndex === i ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    openIndex === i ? 'max-h-[800px] pb-5' : 'max-h-0'
                  }`}
                >
                  <div className="text-sm text-gray-600 leading-relaxed">{item.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
