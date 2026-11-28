"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ModalConfirmarPedidoProps {
  aberto: boolean;
  aoConfirmar: () => void;
  aoCancelar: () => void; // vale para o botão Cancelar, o X, a tecla Esc e o clique no fundo
}

// "Atenção! Tem certeza que deseja realizar esta solicitação?" Aparece quando o gestor aperta Confirmar Pedido.
export function ModalConfirmarPedido({ aberto, aoConfirmar, aoCancelar }: ModalConfirmarPedidoProps) {
  return (
    <Modal
      aberto={aberto}
      aoFechar={aoCancelar}
      titulo="Atenção! Tem certeza que deseja realizar esta solicitação?"
      pequeno
      icone={
        <span
          aria-hidden="true"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 text-5xl font-bold text-branco"
        >
          !
        </span>
      }
    >
      <div className="flex justify-center gap-3">
        <Button variante="cancelar" tamanho="sm" onClick={aoCancelar}>
          Cancelar
        </Button>
        <Button variante="secundario" tamanho="sm" onClick={aoConfirmar}>
          Sim
        </Button>
      </div>
    </Modal>
  );
}
