'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import { FiSend, FiX } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { PHONE_WA } from '../../lib/config'
import { INCOME_RANGES } from '../../lib/chat/incomeRanges'

interface ChatPanelProps {
  onClose: () => void
}

interface PropertyResult {
  id: number
  titulo: string
  precoFormatado: string
  bairro: string
  cidade: string
  quartos: number
  area: number
  parcelaEstimada: string | null
  url: string
}

/** Tool/text parts arrive as a wide union; we read them defensively at runtime. */
type LoosePart = { type: string; text?: string; output?: unknown }

const GREETING = 'Oi! 👋 Bora achar o seu próximo imóvel? Me conta o que você procura 👇'

const QUICK_REPLIES = ['Quero comprar', 'Quero alugar', 'Simular financiamento']

function asProperties(output: unknown): PropertyResult[] {
  if (!output || typeof output !== 'object') return []
  const imoveis = (output as { imoveis?: unknown }).imoveis
  return Array.isArray(imoveis) ? (imoveis as PropertyResult[]) : []
}

function asWhatsappUrl(output: unknown): string | null {
  if (!output || typeof output !== 'object') return null
  const url = (output as { whatsappUrl?: unknown }).whatsappUrl
  return typeof url === 'string' ? url : null
}

interface FinancingResult {
  programa: string
  prazoMeses: number
  taxaFormatada: string
  valorImovelFormatado: string
  entradaFormatada: string
  primeiraParcelaFormatada: string
  ultimaParcelaFormatada: string
}

function asFinancing(output: unknown): FinancingResult | null {
  if (!output || typeof output !== 'object') return null
  const o = output as Record<string, unknown>
  if (typeof o.primeiraParcelaFormatada !== 'string' || typeof o.programa !== 'string') return null
  return o as unknown as FinancingResult
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const { messages, sendMessage, status, error } = useChat()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, status])

  function send(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput('')
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    send(input)
  }

  return (
    <div
      role="dialog"
      aria-label="Atendimento virtual do Corretor Yuri"
      className="fixed inset-x-2 bottom-24 top-16 z-50 flex flex-col overflow-hidden rounded-lg bg-white shadow-2xl md:inset-auto md:bottom-24 md:right-6 md:h-[600px] md:max-h-[80vh] md:w-96"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-dark px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-black text-white">Y</div>
          <div>
            <p className="text-sm font-bold text-white">Corretor Yuri</p>
            <p className="text-[11px] text-gray-400">Assistente virtual · responde na hora</p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Fechar atendimento" className="text-gray-400 transition-colors hover:text-white">
          <FiX size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
        {/* Static greeting + quick replies before the conversation starts */}
        <Bubble role="assistant">{GREETING}</Bubble>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK_REPLIES.map(reply => (
              <button
                key={reply}
                onClick={() => send(reply)}
                className="rounded-full border border-primary/40 bg-white px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {messages.map(message => {
          const parts = (message.parts ?? []) as LoosePart[]
          return (
            <div key={message.id} className="space-y-2">
              {parts.map((part, index) => {
                if (part.type === 'text' && part.text) {
                  return (
                    <Bubble key={index} role={message.role === 'user' ? 'user' : 'assistant'}>
                      {part.text}
                    </Bubble>
                  )
                }
                if (part.type === 'tool-buscarImoveis') {
                  const imoveis = asProperties(part.output)
                  if (imoveis.length === 0) return null
                  return <PropertyList key={index} imoveis={imoveis} />
                }
                if (part.type === 'tool-estimarFinanciamento') {
                  const fin = asFinancing(part.output)
                  if (!fin) return null
                  return <FinancingCard key={index} fin={fin} />
                }
                if (part.type === 'tool-perguntarRenda') {
                  return <IncomeRanges key={index} onSelect={send} disabled={busy} />
                }
                if (part.type === 'tool-registrarLead') {
                  const url = asWhatsappUrl(part.output)
                  if (!url) return null
                  return <WhatsAppHandoff key={index} url={url} />
                }
                return null
              })}
            </div>
          )
        })}

        {busy && <TypingIndicator />}

        {(status === 'error' || error) && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-dark">
            <p className="mb-2.5">Estou com muitos atendimentos agora e não consegui responder. Você pode tentar de novo em instantes ou falar direto com o Yuri:</p>
            <a
              href={PHONE_WA}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-whatsapp-dark"
            >
              <FaWhatsapp size={16} />
              Falar com o Yuri no WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 bg-white p-3">
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="Escreva sua mensagem..."
          aria-label="Sua mensagem"
          className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm text-dark outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Enviar"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white transition-opacity disabled:opacity-40"
        >
          <FiSend size={16} />
        </button>
      </form>
    </div>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser ? 'rounded-br-sm bg-primary text-white' : 'rounded-bl-sm bg-white text-dark shadow-sm'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

function PropertyList({ imoveis }: { imoveis: PropertyResult[] }) {
  return (
    <div className="space-y-2">
      {imoveis.map(imovel => (
        <a
          key={imovel.id}
          href={imovel.url}
          target="_blank"
          rel="noreferrer"
          className="block rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-primary"
        >
          <p className="text-sm font-bold text-dark">{imovel.titulo}</p>
          <p className="mt-0.5 text-sm font-black text-primary">{imovel.precoFormatado}</p>
          <p className="mt-1 text-[11px] text-gray-500">
            {imovel.bairro}, {imovel.cidade}
            {imovel.quartos ? ` · ${imovel.quartos} quarto${imovel.quartos > 1 ? 's' : ''}` : ''}
            {imovel.area ? ` · ${imovel.area} m²` : ''}
          </p>
          {imovel.parcelaEstimada && (
            <p className="mt-1 text-[11px] text-gray-500">A partir de {imovel.parcelaEstimada}/mês*</p>
          )}
        </a>
      ))}
    </div>
  )
}

function FinancingCard({ fin }: { fin: FinancingResult }) {
  const rows: [string, string][] = [
    ['Imóvel', fin.valorImovelFormatado],
    ['Entrada', fin.entradaFormatada],
    ['1ª parcela', fin.primeiraParcelaFormatada],
    ['Última parcela', fin.ultimaParcelaFormatada],
    ['Prazo', `${fin.prazoMeses} meses · ${fin.taxaFormatada}`],
  ]
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="bg-dark px-3.5 py-2.5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-primary font-bold">Simulação de financiamento</p>
        <p className="text-sm font-bold text-white">{fin.programa}</p>
      </div>
      <div className="divide-y divide-gray-100 px-3.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-2 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-dark">{value}</span>
          </div>
        ))}
      </div>
      <p className="bg-gray-50 px-3.5 py-2 text-[11px] leading-snug text-gray-500">
        Parcelas decrescentes (SAC). Estimativa aproximada — a aprovação depende da análise do banco.
      </p>
    </div>
  )
}

function IncomeRanges({ onSelect, disabled }: { onSelect: (message: string) => void; disabled: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-dark">Qual é a renda mensal da sua família? 👇</p>
      <div className="flex flex-wrap gap-2">
        {INCOME_RANGES.map(range => (
          <button
            key={range.label}
            onClick={() => onSelect(range.message)}
            disabled={disabled}
            className="rounded-full border border-primary/40 bg-white px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-40"
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function WhatsAppHandoff({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-whatsapp-dark"
    >
      <FaWhatsapp size={18} />
      Falar agora com o Yuri
    </a>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
      </div>
    </div>
  )
}
