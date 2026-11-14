"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: ReactNode;
  icone?: ReactNode;
  pequeno?: boolean;
  grande?: boolean;
}

export function Modal({ aberto, aoFechar, titulo, children, icone, pequeno = false, grande = false }: ModalProps) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const idDoTitulo = useId();

  useEffect(() => {
    const elemento = dialogo.current;
    if (!elemento) return;
    if (aberto && !elemento.open) elemento.showModal();
    if (!aberto && elemento.open) elemento.close();
  }, [aberto]);

  const largura = grande ? "max-w-5xl" : pequeno ? "max-w-md" : "max-w-xl";

  return (
    <dialog
      ref={dialogo}
      aria-labelledby={idDoTitulo}
      onClose={() => {
        if (aberto) aoFechar();
      }}
      // Clicar fora da caixa também fecha.
      onClick={(evento) => {
        if (evento.target === dialogo.current) aoFechar();
      }}
      className={`m-auto w-full rounded-xl bg-card p-0 backdrop:bg-black/50 ${largura}`}
    >
      <div className={`relative p-8 ${icone ? "text-center" : ""}`}>
        <button
          type="button"
          aria-label="Fechar"
          onClick={aoFechar}
          className="absolute right-4 top-4 cursor-pointer text-preto/60 hover:text-preto"
        >
          <X size={20} />
        </button>
        {icone && <div className="mb-4 flex justify-center">{icone}</div>}
        <h2 id={idDoTitulo} className="mb-6 text-xl text-azul-1">
          {titulo}
        </h2>
        {children}
      </div>
    </dialog>
  );
}