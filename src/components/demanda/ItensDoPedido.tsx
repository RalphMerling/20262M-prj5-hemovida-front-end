"use client";

import { Maximize2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import type { Coluna } from "@/components/ui/Table";
import type { ItemPedido } from "@/models/pedido";

// Quantos itens aparecem na página. O resto fica no "ver mais".
const LIMITE_NA_PAGINA = 3;

const colunas: Coluna<ItemPedido>[] = [
  { titulo: "Tipo Sanguíneo", largura: "25%", render: (i) => i.tipoSanguineo },
  { titulo: "Hemocomponente", largura: "45%", render: (i) => i.hemocomponente },
  { titulo: "Quantidade", largura: "30%", render: (i) => `${i.quantidade} bolsas` },
];

// Tabela de itens do pedido. Com mais de 3 itens, aparece "ver mais" e abre todos numa janela.
export function ItensDoPedido({ itens }: { itens: ItemPedido[] }) {
  const [aberto, setAberto] = useState(false);
  const temMais = itens.length > LIMITE_NA_PAGINA;

  return (
    <section aria-labelledby="titulo-itens" className="flex flex-col gap-2">
      <div className="flex items-end justify-between">
        <h2 id="titulo-itens" className="text-xl text-azul-1">
          Itens Solicitados
        </h2>
        {temMais && (
          <button
            type="button"
            onClick={() => setAberto(true)}
            className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-azul-2 hover:underline"
          >
            ver mais
            <Maximize2 size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <Table dados={itens.slice(0, LIMITE_NA_PAGINA)} colunas={colunas} larguraMinima="min-w-[420px]" />

      <Modal aberto={aberto} aoFechar={() => setAberto(false)} titulo="Itens Solicitados">
        <Table dados={itens} colunas={colunas} larguraMinima="min-w-[420px]" />
      </Modal>
    </section>
  );
}
