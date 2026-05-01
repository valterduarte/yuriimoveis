'use client'

import { useState, useEffect, useRef } from 'react'
import { FiX, FiCalendar, FiClock, FiUser, FiPhone, FiHome, FiCheck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { track } from '@vercel/analytics'
import { PHONE_WA_BASE } from '../lib/config'
import { trackEvent } from './GoogleAnalytics'

interface ScheduleVisitModalProps {
  imovelTitulo: string
  imovelId: number
  onClose: () => void
}

const TIME_SLOTS = [
  { value: '08:00', label: '08:00', period: 'Manhã' },
  { value: '09:00', label: '09:00', period: 'Manhã' },
  { value: '10:00', label: '10:00', period: 'Manhã' },
  { value: '11:00', label: '11:00', period: 'Manhã' },
  { value: '13:00', label: '13:00', period: 'Tarde' },
  { value: '14:00', label: '14:00', period: 'Tarde' },
  { value: '15:00', label: '15:00', period: 'Tarde' },
  { value: '16:00', label: '16:00', period: 'Tarde' },
  { value: '17:00', label: '17:00', period: 'Tarde' },
]

export default function ScheduleVisitModal({ imovelTitulo, imovelId, onClose }: ScheduleVisitModalProps) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [visible, setVisible] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 200)
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  function formatDateBR(dateStr: string) {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  function getWeekday(dateStr: string) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    return days[new Date(dateStr + 'T12:00:00').getDay()]
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const message = [
      `Olá! Gostaria de agendar uma visita.`,
      ``,
      `*Imóvel:* ${imovelTitulo} — Código #${imovelId}`,
      `*Nome:* ${nome}`,
      `*Telefone:* ${telefone}`,
      `*Data preferida:* ${getWeekday(data)}, ${formatDateBR(data)}`,
      `*Horário:* ${horario}`,
    ].join('\n')

    track('schedule_visit', { imovel_id: String(imovelId), source: 'modal' })
    trackEvent('schedule_visit', 'lead', `imovel_${imovelId}`)

    window.open(`${PHONE_WA_BASE}?text=${encodeURIComponent(message)}`, '_blank')
    handleClose()
  }

  const isValid = nome.trim().length >= 2 && telefone.replace(/\D/g, '').length >= 10 && data && horario

  const filledFields = [nome.trim().length >= 2, telefone.replace(/\D/g, '').length >= 10, !!data, !!horario].filter(Boolean).length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Agendar visita"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={panelRef}
        className={`relative w-full max-w-lg overflow-hidden shadow-2xl transition-all duration-200 ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
      >
        {/* Header with gradient */}
        <div className="relative bg-dark overflow-hidden">
          {/* Decorative accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

          <div className="relative px-7 pt-8 pb-6">
            <button
              onClick={handleClose}
              aria-label="Fechar"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 flex items-center justify-center">
                <FiCalendar size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">Agendar</p>
                <h2 className="text-xl font-black text-white uppercase tracking-wide">Visita ao Imóvel</h2>
              </div>
            </div>

            {/* Property info card */}
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4">
              <FiHome size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm text-white font-semibold leading-snug truncate">{imovelTitulo}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Código #{imovelId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white">
          <div className="px-7 py-6 space-y-5">
            {/* Name */}
            <div className="group">
              <label htmlFor="visit-nome" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2.5">
                <FiUser size={12} className="text-primary" />
                Seu nome
              </label>
              <input
                id="visit-nome"
                type="text"
                required
                autoFocus
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Maria Silva"
                className="w-full border-b-2 border-gray-200 px-0 py-3 text-sm text-dark placeholder:text-gray-300 focus:border-primary focus:outline-none transition-colors bg-transparent"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="visit-telefone" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2.5">
                <FiPhone size={12} className="text-primary" />
                Seu telefone
              </label>
              <input
                id="visit-telefone"
                type="tel"
                required
                value={telefone}
                onChange={e => setTelefone(formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                className="w-full border-b-2 border-gray-200 px-0 py-3 text-sm text-dark placeholder:text-gray-300 focus:border-primary focus:outline-none transition-colors bg-transparent"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label htmlFor="visit-data" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2.5">
                  <FiCalendar size={12} className="text-primary" />
                  Data
                </label>
                <input
                  id="visit-data"
                  type="date"
                  required
                  min={today}
                  value={data}
                  onChange={e => setData(e.target.value)}
                  className="w-full border-b-2 border-gray-200 px-0 py-3 text-sm text-dark focus:border-primary focus:outline-none transition-colors bg-transparent"
                />
                {data && (
                  <p className="text-[11px] text-primary font-semibold mt-1.5">
                    {getWeekday(data)}, {formatDateBR(data)}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="visit-horario" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2.5">
                  <FiClock size={12} className="text-primary" />
                  Horário
                </label>
                <select
                  id="visit-horario"
                  required
                  value={horario}
                  onChange={e => setHorario(e.target.value)}
                  className="w-full border-b-2 border-gray-200 px-0 py-3 text-sm text-dark focus:border-primary focus:outline-none transition-colors bg-transparent appearance-none cursor-pointer"
                >
                  <option value="">Selecione</option>
                  <optgroup label="Manhã">
                    {TIME_SLOTS.filter(t => t.period === 'Manhã').map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Tarde">
                    {TIME_SLOTS.filter(t => t.period === 'Tarde').map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Progress + Submit */}
          <div className="border-t border-gray-100">
            {/* Progress bar */}
            <div className="px-7 pt-5 pb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Progresso</span>
                <span className="text-[10px] font-bold text-gray-400">{filledFields}/4</span>
              </div>
              <div className="h-1 bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${(filledFields / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="px-7 pb-7 pt-3">
              <button
                type="submit"
                disabled={!isValid}
                className="group w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 font-black uppercase tracking-[0.2em] text-xs py-5 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
              >
                {isValid ? (
                  <>
                    <FaWhatsapp size={20} />
                    Agendar pelo WhatsApp
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />
                    Preencha todos os campos
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-gray-400 mt-3 tracking-wide">
                Seus dados serão enviados diretamente ao corretor
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
