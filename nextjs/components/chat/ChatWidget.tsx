'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { FiMessageSquare, FiX } from 'react-icons/fi'

// The conversation panel pulls in the AI SDK client; load it only on open so it
// stays out of the initial bundle and never weighs on page load / Core Web Vitals.
const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false })

export default function ChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen(value => !value)}
        aria-label={open ? 'Fechar atendimento' : 'Falar com a assistente virtual'}
        aria-expanded={open}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6"
      >
        {open ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </button>
    </>
  )
}
