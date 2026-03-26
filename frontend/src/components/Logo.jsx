export default function Logo({ className = '' }) {
  return (
    <svg
      viewBox="0 0 220 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Corretor Yuri"
    >
      {/* Marca: quadrado com Y estilizado */}
      <rect width="52" height="52" fill="#af1e23" />

      {/* Y — dois braços diagonais */}
      <line x1="14" y1="14" x2="26" y2="28" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="38" y1="14" x2="26" y2="28" stroke="white" strokeWidth="4" strokeLinecap="round" />
      {/* Y — haste vertical */}
      <line x1="26" y1="28" x2="26" y2="40" stroke="white" strokeWidth="4" strokeLinecap="round" />

      {/* Linha divisória vertical */}
      <line x1="64" y1="8" x2="64" y2="44" stroke="#af1e23" strokeWidth="1.5" />

      {/* CORRETOR */}
      <text
        x="74"
        y="24"
        fontFamily="'Arial', sans-serif"
        fontWeight="800"
        fontSize="13"
        letterSpacing="3"
        fill="white"
        textAnchor="start"
      >
        CORRETOR
      </text>

      {/* YURI */}
      <text
        x="75"
        y="41"
        fontFamily="'Arial', sans-serif"
        fontWeight="700"
        fontSize="15"
        letterSpacing="5"
        fill="#af1e23"
        textAnchor="start"
      >
        YURI
      </text>
    </svg>
  )
}
