interface FaqItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  faqs: FaqItem[]
  headingId?: string
  title?: string
}

export default function FaqAccordion({ faqs, headingId = 'faq-heading', title = 'Perguntas frequentes' }: FaqAccordionProps) {
  return (
    <section className="mt-14" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-base font-bold text-dark mb-4 uppercase tracking-wide">
        {title}
      </h2>
      <div className="divide-y divide-gray-200 border border-gray-200 bg-white">
        {faqs.map((faq, i) => (
          <details key={i} className="group">
            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-sm font-bold text-dark hover:text-primary">
              <span>{faq.q}</span>
              <span className="text-primary text-lg leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="px-5 pb-4 text-sm text-gray-700 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
