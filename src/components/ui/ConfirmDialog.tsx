"use client";

import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  aberto: boolean;
  titulo: string; // a pergunta. Ex.: "Tem certeza que deseja cancelar a triagem?"
  descricao?: string; // uma explicação a mais (opcional)
  textoConfirmar?: string;
  textoCancelar?: string;
  // "perigo" = botão de confirmar vermelho (cancelar, excluir). "normal" = azul escuro.
  tom?: "perigo" | "normal";
  aoConfirmar: () => void;
  aoCancelar: () => void; // vale para o botão, o X, a tecla Esc e o clique no fundo
}

// Janela de confirmação: "Tem certeza?". A página guarda se está aberta e o que fazer ao confirmar.
export function ConfirmDialog({
  aberto,
  titulo,
  descricao,
  textoConfirmar = "Sim",
  textoCancelar = "Não, voltar",
  tom = "perigo",
  aoConfirmar,
  aoCancelar,
}: ConfirmDialogProps) {
  return (
    <Modal
      aberto={aberto}
      aoFechar={aoCancelar}
      titulo={titulo}
      pequeno
      icone={
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 text-5xl font-bold text-branco">
          !
        </span>
      }
    >
      {descricao && <p className="-mt-3 mb-6 text-preto/70">{descricao}</p>}
      <div className="flex justify-center gap-3">
        <Button variante="voltar" onClick={aoCancelar}>
          {textoCancelar}
        </Button>
        <Button variante={tom === "perigo" ? "primario" : "secundario"} onClick={aoConfirmar}>
          {textoConfirmar}
        </Button>
      </div>
    </Modal>
  );
}