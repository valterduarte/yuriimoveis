'use client'

import { useState } from 'react'

const FAQ_ITEMS = [
  {
    question: 'Quais tipos de imóveis o Corretor Yuri oferece em Osasco?',
    answer:
      'Casas, apartamentos, terrenos, chalés, chácaras e imóveis comerciais para venda e aluguel em Osasco e Grande São Paulo.',
  },
  {
    question: 'Como funciona o financiamento imobiliário em Osasco?',
    answer:
      'Financiamento de até 80% do valor em até 360 meses via Caixa ou bancos privados. Imóveis até R$ 264.000 podem se enquadrar no Minha Casa Minha Vida com taxas a partir de 5,5% ao ano.',
  },
  {
    question: 'Quais são os melhores bairros para morar em Osasco?',
    answer:
      'Presidente Altino, Bela Vista, Km 18 e Jaguaribe se destacam pela infraestrutura, transporte e acesso à Grande São Paulo. Cada bairro tem perfil e faixa de preço diferentes.',
  },
  {
    question: 'Como entrar em contato com o Corretor Yuri?',
    answer:
      'WhatsApp (11) 97256-3420 ou Instagram @valterrduarte. Atendimento de segunda a sexta das 9h às 18h e sábado das 9h às 12h.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <span className="section-label">Dúvidas Frequentes</span>
          <h2 className="section-title mb-10">Perguntas e Respostas</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white border border-gray-200">
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
                {openIndex === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
