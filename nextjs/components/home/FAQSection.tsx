'use client'

import { useState } from 'react'
import { HOMEPAGE_FAQ } from '../../data/faq'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <span className="section-label">Dúvidas Frequentes</span>
          <h2 className="section-title mb-10">Perguntas Frequentes sobre Imóveis em Osasco e Região</h2>
          <div className="space-y-3">
            {HOMEPAGE_FAQ.map((item, i) => {
              const isOpen = openIndex === i
              const panelId = `faq-panel-${i}`
              const buttonId = `faq-button-${i}`
              return (
                <div key={item.question} className="bg-white border border-gray-200">
                  <h3>
                    <button
                      id={buttonId}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <span className="text-sm font-bold text-dark pr-4">{item.question}</span>
                      <span className="text-primary text-xl flex-shrink-0" aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="px-6 pb-5 text-sm text-gray-600 leading-relaxed"
                  >
                    {item.answerNode}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
