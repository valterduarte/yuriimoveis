import { memo } from 'react'

function Logo({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Corretor Yuri"
    >
      {/* Marca: quadrado vermelho com Y */}
      <rect width="52" height="52" fill="#af1e23" />
      <line x1="14" y1="13" x2="26" y2="27" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="38" y1="13" x2="26" y2="27" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="26" y1="27" x2="26" y2="40" stroke="white" strokeWidth="4" strokeLinecap="round" />

      {/* Linha divisória */}
      <line x1="62" y1="8" x2="62" y2="44" stroke="#af1e23" strokeWidth="1.5" />

      {/* YURI — nome principal grande */}
      <text
        x="70"
        y="30"
        fontFamily="'Arial', sans-serif"
        fontWeight="900"
        fontSize="24"
        letterSpacing="3"
        fill="white"
        textAnchor="start"
      >
        YURI
      </text>

      {/* CORRETOR — label pequeno abaixo */}
      <text
        x="72"
        y="44"
        fontFamily="'Arial', sans-serif"
        fontWeight="600"
        fontSize="10"
        letterSpacing="4"
        fill="#9ca3af"
        textAnchor="start"
      >
        CORRETOR
      </text>
    </svg>
  )
}

export default memo(Logo)
