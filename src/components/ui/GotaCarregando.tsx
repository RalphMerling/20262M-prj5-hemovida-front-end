interface GotaCarregandoProps {
  animar?: boolean;
  texto?: string;
}

// Gota de sangue que vai enchendo. É um SVG.
export function GotaCarregando({ animar = true, texto = "Carregando..." }: GotaCarregandoProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 100 124" className="h-32 w-28" aria-hidden>
        <defs>
          {/* O formato da gota */}
          <clipPath id="formato-gota">
            <path d="M50 4 C50 4 12 52 12 82 a38 38 0 0 0 76 0 C88 52 50 4 50 4 Z" />
          </clipPath>
        </defs>

        {/* Fundo claro da gota */}
        <path d="M50 4 C50 4 12 52 12 82 a38 38 0 0 0 76 0 C88 52 50 4 50 4 Z" className="fill-vermelho-1/15" />

        {animar && (
          <g clipPath="url(#formato-gota)">
            <g className="gota-nivel">
              <path
                className="gota-onda fill-vermelho-1"
                d="M-50 20 q12.5 -6 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 V130 H-50 Z"
              />
            </g>
          </g>
        )}

        {/* Contorno */}
        <path
          d="M50 4 C50 4 12 52 12 82 a38 38 0 0 0 76 0 C88 52 50 4 50 4 Z"
          className="fill-none stroke-vermelho-2"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <p className="font-semibold text-vermelho-2">{texto}</p>
    </div>
  );
}