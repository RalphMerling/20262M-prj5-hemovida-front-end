"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// Mostra até 5 números de página, sempre em volta da página atual.
function numerosVisiveis(atual: number, total: number): number[] {
  const quantidade = Math.min(5, total);
  const inicio = Math.min(Math.max(1, atual - 2), total - quantidade + 1);
  return Array.from({ length: quantidade }, (_, i) => inicio + i);
}

interface PaginationProps {
  paginaAtual: number;
  totalPaginas: number;
  aoMudar: (pagina: number) => void;
}

export function Pagination({ paginaAtual, totalPaginas, aoMudar }: PaginationProps) {
  if (totalPaginas <= 1) return null; // com uma página só, não precisa de paginação

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-2 pt-4">
      <button
        aria-label="Página anterior"
        disabled={paginaAtual === 1}
        onClick={() => aoMudar(paginaAtual - 1)}
        className="cursor-pointer p-2 text-preto disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft size={18} />
      </button>

      {numerosVisiveis(paginaAtual, totalPaginas).map((numero) => (
        <button
          key={numero}
          aria-current={numero === paginaAtual ? "page" : undefined}
          onClick={() => aoMudar(numero)}
          className={`h-10 w-10 cursor-pointer rounded-lg transition ${
            numero === paginaAtual ? "border border-azul-2 text-azul-2" : "hover:bg-azul-3/30"
          }`}
        >
          {numero}
        </button>
      ))}

      <button
        aria-label="Próxima página"
        disabled={paginaAtual === totalPaginas}
        onClick={() => aoMudar(paginaAtual + 1)}
        className="cursor-pointer p-2 text-preto disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}