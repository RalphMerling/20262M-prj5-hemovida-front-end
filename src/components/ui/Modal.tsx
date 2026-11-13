"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: ReactNode;
  // Opcionais, usados pelas janelas de confirmação: um ícone em cima, tudo centralizado e uma caixa menor.
  icone?: ReactNode;
  pequeno?: boolean;
}

// Janela por cima da tela. Usa o <dialog> do navegador, que já faz o fundo escurecer,
// prende o foco do teclado dentro dela e fecha com a tecla Esc. A página decide quando abre.
export function Modal({ aberto, aoFechar, titulo, children, icone, pequeno = false }: ModalProps) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const idDoTitulo = useId();

  useEffect(() => {
    const elemento = dialogo.current;
    if (!elemento) return;
    if (aberto && !elemento.open) elemento.showModal();
    if (!aberto && elemento.open) elemento.close();
  }, [aberto]);

  return (
    <dialog
      ref={dialogo}
      aria-labelledby={idDoTitulo}
      // O navegador avisa "fechou" também quando NÓS fechamos (aberto = false).
      // Só repassamos o aviso quando foi a pessoa que fechou (Esc), senão ele dispararia duas vezes.
      onClose={() => {
        if (aberto) aoFechar();
      }}
      // Clicar no fundo escuro (fora da caixa) também fecha.
      onClick={(evento) => {
        if (evento.target === dialogo.current) aoFechar();
      }}
      // m-auto: o reset do Tailwind zera a margem e o <dialog> iria para o canto.
      className={`m-auto w-full rounded-xl bg-card p-0 backdrop:bg-black/50 ${pequeno ? "max-w-md" : "max-w-xl"}`}
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