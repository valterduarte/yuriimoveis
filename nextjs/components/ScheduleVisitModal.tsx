'use client'

import { useState } from 'react'
import { FiX, FiCalendar, FiClock } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { track } from '@vercel/analytics'
import { trackEvent } from './GoogleAnalytics'
import { PHONE_WA_BASE } from '../lib/config'

interface ScheduleVisitModalProps {
  imovelTitulo: string
  imovelId: number
  onClose: () => void
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
]

export default function ScheduleVisitModal({ imovelTitulo, imovelId, onClose }: ScheduleVisitModalProps) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')

  const today = new Date().toISOString().split('T')[0]

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const message = [
      `Olá! Gostaria de agendar uma visita.`,
      ``,
      `*Imóvel:* ${imovelTitulo} — Código #${imovelId}`,
      `*Nome:* ${nome}`,
      `*Telefone:* ${telefone}`,
      `*Data preferida:* ${formatDateBR(data)}`,
      `*Horário:* ${horario}`,
    ].join('\n')

    track('schedule_visit', { imovel_id: String(imovelId), source: 'modal' })
    trackEvent('schedule_visit', 'lead', `imovel_${imovelId}`)

    window.open(`${PHONE_WA_BASE}?text=${encodeURIComponent(message)}`, '_blank')
    onClose()
  }

  const isValid = nome.trim().length >= 2 && telefone.replace(/\D/g, '').length >= 10 && data && horario

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Agendar visita">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
        <div className="bg-dark p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Agendar</p>
            <h2 className="text-lg font-black text-white uppercase tracking-wide">Visita ao Imóvel</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-xs text-gray-500 leading-relaxed">
            Preencha seus dados e enviaremos a solicitação direto para o corretor via WhatsApp.
          </p>

          <div>
            <label htmlFor="visit-nome" className="block text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500 mb-2">
              Seu nome
            </label>
            <input
              id="visit-nome"
              type="text"
              required
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Maria Silva"
              className="w-full border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="visit-telefone" className="block text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500 mb-2">
              Seu telefone
            </label>
            <input
              id="visit-telefone"
              type="tel"
              required
              value={telefone}
              onChange={e => setTelefone(formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              className="w-full border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="visit-data" className="block text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500 mb-2">
                <FiCalendar className="inline mr-1" size={12} />
                Data
              </label>
              <input
                id="visit-data"
                type="date"
                required
                min={today}
                value={data}
                onChange={e => setData(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="visit-horario" className="block text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500 mb-2">
                <FiClock className="inline mr-1" size={12} />
                Horário
              </label>
              <select
                id="visit-horario"
                required
                value={horario}
                onChange={e => setHorario(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none transition-colors bg-white"
              >
                <option value="">Selecione</option>
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-3">
            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 mb-1">Imóvel</p>
            <p className="text-xs text-dark font-semibold">{imovelTitulo}</p>
            <p className="text-[10px] text-gray-400">Código #{imovelId}</p>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold uppercase tracking-[0.15em] text-xs py-4 transition-colors"
          >
            <FaWhatsapp size={18} />
            Enviar pelo WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}
