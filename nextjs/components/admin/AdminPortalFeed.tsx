'use client'

import { useState } from 'react'
import { FiShare2, FiCopy, FiCheck, FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { SITE_URL } from '../../lib/config'

const FEED_URL = `${SITE_URL}/api/feed/imoveis.xml`
const TUTORIAL_URL = 'https://app.notion.com/p/392d2fa9b1b281429a19ea75ecaba2ec'

/**
 * Card informativo no admin: mostra a URL do feed VRSync pronta para colar no
 * Canal Pro (OLX/ZAP/Viva Real), com botão de copiar, um checklist rápido e o
 * link do tutorial completo salvo no Notion.
 */
export default function AdminPortalFeed() {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(FEED_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard bloqueado — o usuário ainda consegue selecionar e copiar o texto */
    }
  }

  return (
    <div className="mb-6 rounded-md border border-indigo-300 bg-indigo-50">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 text-sm flex items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2">
          <FiShare2 size={16} className="text-indigo-600" />
          <strong className="text-indigo-700">Feed dos portais (OLX / ZAP / Viva Real)</strong>
          <span className="hidden sm:inline text-[11px] text-indigo-500">— pronto para conectar</span>
        </span>
        {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="border-t border-indigo-200 px-4 py-4 space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide font-bold text-gray-500 mb-1">
              URL do feed
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-white border border-indigo-200 rounded px-2 py-2 break-all text-dark">
                {FEED_URL}
              </code>
              <button
                type="button"
                onClick={copyUrl}
                className="shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide font-bold text-gray-500 mb-2">
              Como conectar (resumo)
            </p>
            <ol className="text-xs text-gray-700 leading-relaxed list-decimal pl-4 space-y-1">
              <li>Abra conta/plano no portal (ZAP, Viva Real e OLX usam o mesmo painel: Canal Pro).</li>
              <li>No Canal Pro: bolinha da conta → <strong>Configurações da conta</strong> → <strong>Integração de anúncios</strong>.</li>
              <li>Escolha <strong>&quot;Outro&quot;</strong> (sistema próprio) e cole a URL acima.</li>
              <li>Salve. A primeira importação pode levar até ~24h (o feed é lido a cada ~12h).</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
            <a
              href={TUTORIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900"
            >
              <FiExternalLink size={14} />
              Ver tutorial completo (Notion)
            </a>
            <span className="hidden sm:inline text-gray-300">•</span>
            <p className="text-[11px] text-gray-500">
              Todo imóvel ativo entra no feed. Para tirar um, desmarque
              <strong> &quot;Publicar nos portais&quot;</strong> ao editar o imóvel.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
